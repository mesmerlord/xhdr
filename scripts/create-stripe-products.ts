import Stripe from "stripe";
import { prisma } from "../src/server/utils/db";
import { planList } from "../src/constants/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// Convert dollar amount to cents
function toCents(amount: number): number {
  return Math.round(amount * 100);
}

async function createOrUpdateStripeProducts() {
  console.log("\n=== Creating/Updating Stripe Products for AdMakeAI ===");

  // First, get all existing products
  const existingProducts = await stripe.products.list({
    active: true,
    limit: 100,
  });

  // Sort products by creation date in descending order
  const sortedProducts = existingProducts.data.sort(
    (a, b) => b.created - a.created
  );

  for (const plan of planList) {
    // Try to find existing product
    const existingProduct = sortedProducts.find(
      (p) => p.name === plan.plan_name
    );

    let product;
    if (existingProduct) {
      // Update existing product
      product = await stripe.products.update(existingProduct.id, {
        description: plan.description,
        metadata: {
          credits_per_month: plan.credits_per_month.toString(),
        },
      });
      console.log(`Updated existing product: ${product.name}`);
    } else {
      // Create new product
      product = await stripe.products.create({
        name: plan.plan_name,
        description: plan.description,
        metadata: {
          credits_per_month: plan.credits_per_month.toString(),
        },
      });
      console.log(`Created new product: ${product.name}`);
    }

    // Handle prices
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
      type: "recurring",
    });

    // Handle monthly price
    let monthlyPrice = existingPrices.data.find(
      (p) =>
        p.recurring?.interval === "month" &&
        p.unit_amount === toCents(plan.price.monthly)
    );

    if (!monthlyPrice) {
      monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: toCents(plan.price.monthly),
        currency: "usd",
        recurring: {
          interval: "month",
        },
        metadata: {
          credits_per_month: plan.credits_per_month.toString(),
        },
      });
      console.log(`Created monthly price: $${plan.price.monthly}/month`);
    }

    // Handle yearly price
    let yearlyPrice = existingPrices.data.find(
      (p) =>
        p.recurring?.interval === "year" &&
        p.unit_amount === toCents(plan.price.yearly)
    );

    if (!yearlyPrice) {
      yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: toCents(plan.price.yearly),
        currency: "usd",
        recurring: {
          interval: "year",
        },
        metadata: {
          credits_per_month: plan.credits_per_month.toString(),
        },
      });
      console.log(`Created yearly price: $${plan.price.yearly}/year`);
    }

    console.log(`Monthly price ID: ${monthlyPrice.id}`);
    console.log(`Yearly price ID: ${yearlyPrice.id}`);
    console.log("---");
  }
}

async function syncStripeProducts() {
  console.log("\n=== Syncing Stripe Products to Database ===");
  const stripeProducts = await stripe.products.list({
    active: true,
    limit: 100,
  });

  for (const product of stripeProducts.data) {
    await prisma.stripeProduct.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        active: product.active,
        metadata: product.metadata || {},
      },
      update: {
        name: product.name,
        description: product.description || undefined,
        active: product.active,
        metadata: product.metadata || {},
      },
    });
    console.log(`Synced product: ${product.id}`);
  }
}

async function syncStripePrices() {
  console.log("\n=== Syncing Stripe Prices to Database ===");
  const stripePrices = await stripe.prices.list({ active: true, limit: 100 });

  for (const price of stripePrices.data) {
    await prisma.stripePrice.upsert({
      where: { id: price.id },
      create: {
        id: price.id,
        product: { connect: { id: price.product as string } },
        active: price.active,
        currency: price.currency,
        unitAmount: price.unit_amount || 0,
        type: price.type,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        metadata: price.metadata || {},
      },
      update: {
        active: price.active,
        currency: price.currency,
        unitAmount: price.unit_amount || 0,
        type: price.type,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        metadata: price.metadata || {},
      },
    });
    console.log(`Synced price: ${price.id}`);
  }
}

async function syncStripeSubscriptions() {
  console.log("\n=== Syncing Stripe Subscriptions ===");
  const stripeSubscriptions = await stripe.subscriptions.list({ limit: 100 });

  for (const subscription of stripeSubscriptions.data) {
    const customer = await prisma.stripeCustomer.findUnique({
      where: { id: subscription.customer as string },
    });

    if (!customer) {
      console.log(
        `Customer ${subscription.customer} not found, skipping subscription ${subscription.id}`
      );
      continue;
    }

    await prisma.stripeSubscription.upsert({
      where: { id: subscription.id },
      create: {
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
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        metadata: subscription.metadata || {},
      },
    });
    console.log(`Synced subscription: ${subscription.id}`);
  }
}

async function syncStripeCharges() {
  console.log("\n=== Syncing Stripe Charges ===");
  const stripeCharges = await stripe.charges.list({ limit: 100 });

  for (const charge of stripeCharges.data) {
    if (typeof charge.customer !== "string") continue;

    const customer = await prisma.stripeCustomer.findUnique({
      where: { id: charge.customer },
    });

    if (!customer) {
      console.log(
        `Customer ${charge.customer} not found, skipping charge ${charge.id}`
      );
      continue;
    }

    await prisma.stripeCharge.upsert({
      where: { id: charge.id },
      create: {
        id: charge.id,
        customer: { connect: { id: customer.id } },
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        description: charge.description || undefined,
        metadata: charge.metadata || {},
        paymentMethod: charge.payment_method || undefined,
        refunded: charge.refunded || false,
      },
      update: {
        status: charge.status,
        metadata: charge.metadata || {},
        refunded: charge.refunded || false,
      },
    });
    console.log(`Synced charge: ${charge.id}`);
  }
}

export async function createStripeProducts() {
  try {
    await createOrUpdateStripeProducts();
    await syncStripeProducts();
    await syncStripePrices();
    await syncStripeSubscriptions();
    await syncStripeCharges();
    console.log("\n=== All done! ===");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run if called directly
createStripeProducts();
