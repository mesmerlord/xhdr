import { Worker, Job } from "bullmq";
import { redisConnection } from "@/server/utils/redis";
import { prisma } from "@/server/utils/db";
import { fal } from "@/lib/fal-client";
import { AdGenerationJobData } from "./queues";

async function processAdGeneration(job: Job<AdGenerationJobData>) {
  const { adGenerationId } = job.data;

  console.log(`Processing ad generation: ${adGenerationId}`);

  try {
    // Get ad generation record
    const adGeneration = await prisma.adGeneration.findUnique({
      where: { id: adGenerationId },
      include: { inputImage: true },
    });

    if (!adGeneration) {
      throw new Error(`Ad generation ${adGenerationId} not found`);
    }

    // Update status to processing
    await prisma.adGeneration.update({
      where: { id: adGenerationId },
      data: { status: "PROCESSING" },
    });

    // Determine which model to use based on whether there's an input image
    let result;

    if (adGeneration.inputImage) {
      // Use Seedream 3 Edit for image-to-image
      result = await fal.subscribe("fal-ai/seedream-3-edit", {
        input: {
          prompt: adGeneration.prompt,
          image_url: adGeneration.inputImage.url,
          image_size: {
            width: adGeneration.width,
            height: adGeneration.height,
          },
        },
        logs: true,
      });
    } else {
      // Use Nano Banana Pro for text-to-image
      result = await fal.subscribe("fal-ai/nano-banana-pro", {
        input: {
          prompt: adGeneration.prompt,
          image_size: {
            width: adGeneration.width,
            height: adGeneration.height,
          },
          num_images: 1,
        },
        logs: true,
      });
    }

    // Extract image URLs from result
    const imageUrls = result.data?.images?.map((img: { url: string }) => img.url) || [];

    // Update with completed status and image URLs
    await prisma.adGeneration.update({
      where: { id: adGenerationId },
      data: {
        status: "COMPLETED",
        imageUrls,
        seed: result.data?.seed,
      },
    });

    console.log(`Ad generation ${adGenerationId} completed successfully`);
  } catch (error) {
    console.error(`Error processing ad generation ${adGenerationId}:`, error);

    // Update status to failed
    await prisma.adGeneration.update({
      where: { id: adGenerationId },
      data: { status: "FAILED" },
    });

    throw error;
  }
}

const worker = new Worker("ad-generation", processAdGeneration, {
  connection: redisConnection,
  concurrency: 5,
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log("Ad generation worker started");
