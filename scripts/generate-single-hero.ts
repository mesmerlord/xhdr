import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

fal.config({
  credentials: process.env.FAL_KEY,
});

const OUTPUT_DIR = path.join(process.cwd(), "public/blog-images");

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function main() {
  const filename = "hdr-ads-instagram-facebook-hero.jpg";
  const prompt =
    "Tech infographic showing Instagram and Facebook app icons glowing with HDR brightness effect, orange and pink gradient light beams emanating from icons, dark gray background with subtle grid pattern, modern social media marketing aesthetic, wide banner format 16:9";

  console.log(`Generating: ${filename}...`);

  const result = await fal.subscribe("fal-ai/z-image/turbo", {
    input: {
      prompt: prompt,
      image_size: {
        width: 1280,
        height: 720,
      },
      num_inference_steps: 8,
      num_images: 1,
      enable_safety_checker: false,
      output_format: "jpeg",
    },
  });

  const imageUrl = (result.data as { images?: { url: string }[] })?.images?.[0]
    ?.url;
  if (!imageUrl) {
    throw new Error("No image returned");
  }

  const filepath = path.join(OUTPUT_DIR, filename);
  await downloadImage(imageUrl, filepath);
  console.log(`Saved: ${filepath}`);
}

main().catch(console.error);
