import { addToEmailQueue } from "@/queue/queues";

export const scheduleWelcomeEmail = async (userId: string) => {
  await addToEmailQueue({
    type: "welcome",
    userId,
    opts: {
      delay: 1000, // Send after 1 second
    },
  });
};

export const scheduleFreeCreditsReminder = async (userId: string) => {
  await addToEmailQueue({
    type: "free_credits_reminder",
    userId,
    opts: {
      delay: 24 * 60 * 60 * 1000, // Send after 24 hours
    },
  });
};
