import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "../../../server/utils/db";
import { planList } from "@/constants/pricing";
import { CreditReason } from "@prisma/client";

// Disable the default body parser to get the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to get credits from price
async function getCreditsFromPrice(priceId: string): Promise<number> {
  const price = await stripe.prices.retrieve(priceId);
  const product = await stripe.products.retrieve(price.product as string);

  const planName = product.name;

  const plan = planList.find((p) => p.plan_name === planName);

  const credits = plan?.credits_per_month || 0;
  return credits;
}

// Handle new subscription creation
async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  customer: any
) {
  // Check if subscription already exists (e.g., created by checkout.session.completed)
  const existingSubscription = await prisma.stripeSubscription.findUnique({
    where: { id: subscription.id },
  });

  if (existingSubscription) {
    console.log(
      `Subscription ${subscription.id} already exists, skipping creation in handleSubscriptionCreated`
    );
    return;
  }

  // Only create the subscription record, don't grant credits yet
  await prisma.stripeSubscription.create({
    data: {
      id: subscription.id,
      customer: { connect: { id: customer.id } },
      price: { connect: { id: subscription.items.data[0].price.id } },
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      metadata: subscription.metadata || {},
    },
  });

  // Don't grant credits here - wait for invoice.payment_succeeded
  console.log(
    `Subscription ${subscription.id} created with status: ${subscription.status} - credits will be granted when payment succeeds`
  );
}

// Handle subscription updates (upgrades/downgrades/renewals)
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  customer: any,
  previousAttributes: Partial<Stripe.Subscription> | null
) {
  console.log("handleSubscriptionUpdated called with:", {
    subscriptionId: subscription.id,
    previousAttributes: previousAttributes ? Object.keys(previousAttributes) : "null",
    hasCurrentPeriodEnd: !!previousAttributes?.current_period_end,
    hasCurrentPeriodStart: !!previousAttributes?.current_period_start,
    hasItems: !!previousAttributes?.items,
  });

  const newCredits = await getCreditsFromPrice(
    subscription.items.data[0].price.id
  );

  console.log("Credits for this subscription:", newCredits);

  // Handle credit adjustments
  if (previousAttributes?.items) {
    // Upgrade/downgrade case
    console.log("Handling upgrade/downgrade case");
    const oldPriceId = (previousAttributes.items as any)?.data[0]?.price?.id;
    if (oldPriceId) {
      const oldCredits = await getCreditsFromPrice(oldPriceId);
      const creditDifference = newCredits - oldCredits;
      console.log("Credit difference:", creditDifference);
      if (creditDifference > 0) {
        const previousCredits = customer.user.credits;
        await prisma.$transaction([
          prisma.user.update({
            where: { id: customer.user.id },
            data: { credits: { increment: creditDifference } },
          }),
          prisma.userCreditHistory.create({
            data: {
              userId: customer.user.id,
              credits: creditDifference,
              previousCredits,
              newCredits: previousCredits + creditDifference,
              reason: CreditReason.SUBSCRIPTION_UPDATE,
              reasonExtra: `Subscription upgraded: ${subscription.id}`,
            },
          }),
        ]);
        console.log(`Granted ${creditDifference} credits for upgrade`);
      }
    }
  } else if (
    previousAttributes?.current_period_end ||
    previousAttributes?.current_period_start
  ) {
    // Renewal case - refresh credits to plan amount
    console.log("Handling renewal case - refreshing credits");
    const previousCredits = customer.user.credits;
    const creditDifference = newCredits - previousCredits;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: customer.user.id },
        data: { credits: newCredits }, // Set to plan amount, not increment
      }),
      prisma.userCreditHistory.create({
        data: {
          userId: customer.user.id,
          credits: creditDifference, // The actual change (can be negative if user had more)
          previousCredits,
          newCredits: newCredits, // The new total
          reason: CreditReason.SUBSCRIPTION_RENEWAL,
          reasonExtra: `Subscription renewed - credits refreshed to ${newCredits}`,
        },
      }),
    ]);
    console.log(`Refreshed credits for user ${customer.user.id}: ${previousCredits} → ${newCredits} (${creditDifference > 0 ? '+' : ''}${creditDifference})`);
  } else {
    console.log("No matching renewal or upgrade condition");
  }

  // Update subscription record
  await prisma.stripeSubscription.update({
    where: { id: subscription.id },
    data: {
      status: subscription.status,
      price: { connect: { id: subscription.items.data[0].price.id } },
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      metadata: subscription.metadata || {},
    },
  });
}

// Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.stripeSubscription.update({
    where: { id: subscription.id },
    data: {
      status: subscription.status,
      canceledAt: new Date(),
      metadata: {
        ...subscription.metadata,
        ended_reason: subscription.cancellation_details?.reason || "unknown",
      },
    },
  });
}

// Handle invoice payment success
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    return;
  }

  // Handle initial subscription creation
  if (invoice.billing_reason === "subscription_create") {
    console.log("Processing initial subscription payment:", {
      id: invoice.id,
      subscription: invoice.subscription,
      billing_reason: invoice.billing_reason,
    });

    const customer = await prisma.stripeCustomer.findUnique({
      where: { id: invoice.customer as string },
      include: { user: true },
    });

    if (!customer?.user) {
      console.error(`No user found for customer ${invoice.customer}`);
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
    const priceId = subscription.items.data[0].price.id;
    const credits = await getCreditsFromPrice(priceId);

    const previousCredits = customer.user.credits;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: customer.user.id },
        data: { credits: { increment: credits } },
      }),
      prisma.userCreditHistory.create({
        data: {
          userId: customer.user.id,
          credits: credits,
          previousCredits,
          newCredits: previousCredits + credits,
          reason: CreditReason.SUBSCRIPTION_CREATE,
          reasonExtra: `Initial subscription payment: ${subscription.id}`,
        },
      }),
    ]);

    console.log(
      `Granted ${credits} credits for initial subscription payment to user ${customer.user.id}`
    );
    return;
  }

  // Handle subscription renewals (regular billing cycle)
  if (invoice.billing_reason === "subscription_cycle") {
    console.log("Processing subscription renewal via invoice:", {
      id: invoice.id,
      subscription: invoice.subscription,
      billing_reason: invoice.billing_reason,
    });

    const customer = await prisma.stripeCustomer.findUnique({
      where: { id: invoice.customer as string },
      include: { user: true },
    });

    if (!customer?.user) {
      console.error(`No user found for customer ${invoice.customer}`);
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
    const priceId = subscription.items.data[0].price.id;
    const credits = await getCreditsFromPrice(priceId);

    const previousCredits = customer.user.credits;
    const creditDifference = credits - previousCredits;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: customer.user.id },
        data: { credits: credits }, // Set to plan amount, not increment
      }),
      prisma.userCreditHistory.create({
        data: {
          userId: customer.user.id,
          credits: creditDifference, // The actual change
          previousCredits,
          newCredits: credits, // The new total
          reason: CreditReason.SUBSCRIPTION_RENEWAL,
          reasonExtra: `Subscription renewal via invoice payment - credits refreshed to ${credits}`,
        },
      }),
    ]);

    console.log(
      `Refreshed credits for user ${customer.user.id}: ${previousCredits} → ${credits} (${creditDifference > 0 ? '+' : ''}${creditDifference}) via invoice payment`
    );
    return;
  }

  // Handle subscription updates (plan changes mid-cycle)
  if (invoice.billing_reason !== "subscription_update") {
    return;
  }

  console.log("Processing subscription update via invoice:", {
    id: invoice.id,
    subscription: invoice.subscription,
    billing_reason: invoice.billing_reason,
  });

  const customer = await prisma.stripeCustomer.findUnique({
    where: { id: invoice.customer as string },
    include: { user: true },
  });

  if (!customer?.user) {
    console.error(`No user found for customer ${invoice.customer}`);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );
  const priceId = subscription.items.data[0].price.id;
  const credits = await getCreditsFromPrice(priceId);

  // For plan changes, only grant the difference in credits
  const oldPriceId = invoice.lines.data.find(
    (line) =>
      line.type === "invoiceitem" && line.description?.includes("Unused time")
  )?.price?.id;

  if (oldPriceId) {
    const oldCredits = await getCreditsFromPrice(oldPriceId);
    const creditDifference = credits - oldCredits;
    if (creditDifference > 0) {
      const previousCredits = customer.user.credits;
      await prisma.$transaction([
        prisma.user.update({
          where: { id: customer.user.id },
          data: { credits: { increment: creditDifference } },
        }),
        prisma.userCreditHistory.create({
          data: {
            userId: customer.user.id,
            credits: creditDifference,
            previousCredits,
            newCredits: previousCredits + creditDifference,
            reason: CreditReason.SUBSCRIPTION_UPDATE,
            reasonExtra: `Plan upgraded via invoice payment`,
          },
        }),
      ]);
      console.log(
        `Granted ${creditDifference} additional credits to user ${customer.user.id} for plan upgrade`
      );
    }
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Processing checkout session:", {
    id: session.id,
    mode: session.mode,
    metadata: session.metadata,
    customer_email: session.customer_details?.email,
  });

  if (!session.metadata?.userId) {
    console.error("No userId in session metadata");
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.metadata.userId },
  });

  if (!user) {
    console.error(`No user found for id ${session.metadata.userId}`);
    return;
  }

  // For subscription mode, we don't do anything here
  // The subscription.created webhook handles creating the subscription record
  // The invoice.payment_succeeded webhook handles granting credits
  if (session.mode === "subscription") {
    console.log(
      `Checkout completed for subscription ${session.subscription}, credits will be granted via invoice.payment_succeeded`
    );
    return;
  }
  // Handle one-time credit purchase
  else if (session.mode === "payment") {
    const credits = session.metadata?.credits
      ? parseInt(session.metadata.credits)
      : 0;

    if (credits > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { credits: { increment: credits } },
        }),
        prisma.userCreditHistory.create({
          data: {
            userId: user.id,
            credits: credits,
            previousCredits: user.credits,
            newCredits: user.credits + credits,
            reason: CreditReason.PURCHASE,
            reasonExtra: `One-time credit purchase via checkout`,
          },
        }),
      ]);
      console.log(`Granted ${credits} credits to user ${user.id}`);
    }
  }
}

export async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const previousAttributes = event.data
    .previous_attributes as Partial<Stripe.Subscription> | null;

  // Verify that the customer exists in our database
  const customer = await prisma.stripeCustomer.findUnique({
    where: { id: subscription.customer as string },
    include: {
      user: true,
      subscriptions: {
        where: {
          status: { in: ["active", "trialing"] },
        },
        include: {
          price: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!customer) {
    console.error(`Customer ${subscription.customer} not found in database`);
    return;
  }

  if (!customer.user) {
    console.error(`No user found for customer ${subscription.customer}`);
    return;
  }

  // Handle different subscription events
  switch (event.type) {
    case "customer.subscription.created":
      await handleSubscriptionCreated(subscription, customer);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(
        subscription,
        customer,
        previousAttributes
      );
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(subscription);
      break;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Webhook received:", {
    method: req.method,
    headers: req.headers,
  });

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  console.log("Webhook details:", {
    hasSignature: !!sig,
    hasWebhookSecret: !!webhookSecret,
    bodyLength: buf.length,
  });

  if (!sig || !webhookSecret) {
    return res.status(400).send("Webhook signature or secret missing");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log("Webhook event constructed:", {
      type: event.type,
      id: event.id,
      object: event.object,
      apiVersion: event.api_version,
    });
  } catch (err) {
    console.error(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
  }

  try {
    console.log("Processing webhook event:", event.type);

    // Trim any whitespace from event type
    const eventType = event.type.trim();

    switch (eventType) {
      case "checkout.session.completed":
        console.log("Processing checkout.session.completed event");
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "invoice.payment_succeeded":
        console.log("Processing invoice.payment_succeeded event");
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("Processing subscription event:", eventType);
        await handleSubscriptionEvent(event);
        break;
      default:
        console.log(`Unhandled event type: ${eventType} (original: '${event.type}')`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(
      `Error processing webhook: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    res
      .status(500)
      .send(
        `Server error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
  }
}
