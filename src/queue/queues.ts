import { DefaultJobOptions, JobsOptions, Queue } from "bullmq";
import { redisConnection } from "@/server/utils/redis";

// Ad Generation queue types
export interface AdGenerationJobData {
  adGenerationId: string;
}

// Email queue types
export interface EmailJobData {
  type:
    | "welcome"
    | "first_sale_offer"
    | "free_credits_reminder"
    | "daily_email_automation";
  userId: string;
  maxEmails?: number;
  opts?: JobsOptions;
}

// Subscription queue types
export interface SubscriptionJobData {
  type: "yearly_monthly_reset";
  userId?: string;
  customDay?: number;
}

export const defaultQueueConfig: DefaultJobOptions = {
  attempts: 10,
  backoff: {
    type: "exponential",
    delay: 30000,
  },
  keepLogs: 100,
};

export function createQueue(name: string) {
  return new Queue(name, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueConfig,
  });
}

export const adGenerationQueue = createQueue("ad-generation");
export const emailQueue = createQueue("email");
export const subscriptionQueue = createQueue("subscription");

// Helper functions to add jobs
export const addToAdGenerationQueue = async ({
  adGenerationId,
  opts,
}: {
  adGenerationId: string;
  opts?: JobsOptions;
}) => {
  console.log("Adding to ad generation queue:", adGenerationId);
  const job = await adGenerationQueue.add(
    "ad-generation",
    { adGenerationId },
    opts
  );
  console.log("Added ad generation job:", job.id);
  return job;
};

export const addToEmailQueue = async ({
  type,
  userId,
  maxEmails,
  opts,
}: {
  type: EmailJobData["type"];
  userId: string;
  maxEmails?: number;
  opts?: JobsOptions;
}) => {
  console.log("Adding to email queue:", type, "for user:", userId);
  const job = await emailQueue.add(type, { type, userId, maxEmails }, opts);
  console.log("Added email job:", job.id);
  return job;
};

export const addToSubscriptionQueue = async ({
  type,
  userId,
  opts,
}: {
  type: SubscriptionJobData["type"];
  userId?: string;
  opts?: JobsOptions;
}) => {
  console.log("Adding to subscription queue:", type, userId ? `for user: ${userId}` : "for all users");
  const job = await subscriptionQueue.add(type, { type, userId }, opts);
  console.log("Added subscription job:", job.id);
  return job;
};
