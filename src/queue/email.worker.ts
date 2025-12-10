import { Worker, Job } from "bullmq";
import { redisConnection } from "@/server/utils/redis";
import { prisma } from "@/server/utils/db";
import { Resend } from "resend";
import { EmailJobData } from "./queues";
import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/welcome";
import FreeCreditsReminderEmail from "@/emails/free-credits-reminder";

const resend = new Resend(process.env.RESEND_API_KEY);

async function processEmail(job: Job<EmailJobData>) {
  const { type, userId } = job.data;

  console.log(`Processing email: ${type} for user: ${userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        allowMarketing: true,
      },
    });

    if (!user || !user.email) {
      console.log(`User ${userId} not found or has no email`);
      return;
    }

    if (!user.allowMarketing && type !== "welcome") {
      console.log(`User ${userId} has unsubscribed from marketing emails`);
      return;
    }

    let subject: string;
    let html: string;

    switch (type) {
      case "welcome":
        subject = "Welcome to AdMake AI!";
        html = await render(WelcomeEmail({ name: user.name || "there" }));
        break;
      case "free_credits_reminder":
        subject = "Your free credits are waiting!";
        html = await render(FreeCreditsReminderEmail({ name: user.name || "there" }));
        break;
      default:
        console.log(`Unknown email type: ${type}`);
        return;
    }

    // Send email
    const result = await resend.emails.send({
      from: "AdMake AI <noreply@admakeai.com>",
      to: user.email,
      subject,
      html,
    });

    // Save email record
    await prisma.email.create({
      data: {
        resendId: result.data?.id,
        fromEmail: "noreply@admakeai.com",
        to: [user.email],
        subject,
        htmlMessage: html,
        emailType: type === "welcome" ? "WELCOME" : "FREE_CREDITS_REMINDER",
        userId: user.id,
      },
    });

    console.log(`Email sent successfully to ${user.email}`);
  } catch (error) {
    console.error(`Error processing email for user ${userId}:`, error);
    throw error;
  }
}

const worker = new Worker("email", processEmail, {
  connection: redisConnection,
  concurrency: 10,
});

worker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});

console.log("Email worker started");
