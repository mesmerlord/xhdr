import { Worker, Job } from "bullmq";
import { redisConnection } from "@/server/utils/redis";
import { prisma } from "@/server/utils/db";
import { SubscriptionJobData } from "./queues";
import { planList } from "@/constants/pricing";
import { CreditReason } from "@prisma/client";

async function processSubscription(job: Job<SubscriptionJobData>) {
  const { type, userId } = job.data;

  console.log(`Processing subscription job: ${type} for user: ${userId || "all"}`);

  try {
    if (type === "yearly_monthly_reset") {
      // Reset monthly credits for yearly subscribers
      const subscriptions = await prisma.stripeSubscription.findMany({
        where: {
          status: "active",
          price: {
            interval: "year",
          },
          ...(userId ? { customer: { userId } } : {}),
        },
        include: {
          customer: {
            include: {
              user: true,
            },
          },
          price: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const subscription of subscriptions) {
        const user = subscription.customer.user;
        if (!user) continue;

        // Get credits from product metadata
        const metadata = subscription.price.product?.metadata as Record<string, string> | null;
        const creditsPerMonth = metadata?.credits_per_month;
        if (!creditsPerMonth) continue;

        const credits = parseInt(creditsPerMonth);
        const previousCredits = user.credits;

        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { credits },
          }),
          prisma.userCreditHistory.create({
            data: {
              userId: user.id,
              credits,
              previousCredits,
              newCredits: credits,
              reason: CreditReason.MONTHLY_RESET,
              reasonExtra: `Monthly reset for yearly subscription ${subscription.id}`,
            },
          }),
        ]);

        console.log(`Reset credits for user ${user.id} to ${credits}`);
      }
    }
  } catch (error) {
    console.error(`Error processing subscription job:`, error);
    throw error;
  }
}

const worker = new Worker("subscription", processSubscription, {
  connection: redisConnection,
  concurrency: 1,
});

worker.on("completed", (job) => {
  console.log(`Subscription job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Subscription job ${job?.id} failed:`, err);
});

console.log("Subscription worker started");
