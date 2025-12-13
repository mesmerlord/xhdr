import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as dotenv from "dotenv";

// Load env from project root
dotenv.config({ path: path.join(process.cwd(), ".env") });

fal.config({
  credentials: process.env.FAL_KEY,
});

console.log("FAL_KEY loaded:", process.env.FAL_KEY ? "yes" : "no");

const OUTPUT_DIR = path.join(process.cwd(), "public/blog-images");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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

// Hero image prompts - simple, graphic designs that work well with z-image-turbo
const HERO_IMAGES = [
  {
    filename: "profile-picture-tips-hero.jpg",
    prompt:
      "Minimalist graphic design showing a glowing circular profile picture frame with orange and pink gradient rim light against dark gray background, abstract light rays emanating outward, clean modern tech aesthetic, wide banner format",
  },
  {
    filename: "what-is-hdr-hero.jpg",
    prompt:
      "Split comparison graphic showing same circular portrait silhouette, left side dim and flat labeled 'SDR', right side glowing bright with orange highlights labeled 'HDR', dark background with subtle gradient, tech infographic style, wide aspect ratio",
  },
  {
    filename: "hdr-effect-hero.jpg",
    prompt:
      "Abstract visualization of light intensity levels, gradient bars transitioning from dark shadows through midtones to bright glowing highlights in orange and white, minimalist data visualization style on dark background, wide banner format",
  },
  {
    filename: "hdr-ads-instagram-facebook-hero.jpg",
    prompt:
      "Tech infographic showing Instagram and Facebook app icons glowing with HDR brightness effect, orange and pink gradient light beams emanating from icons, dark gray background with subtle grid pattern, modern social media marketing aesthetic, wide banner format 16:9",
  },
];

async function generateHeroImage(
  prompt: string,
  filename: string
): Promise<void> {
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
    throw new Error(`No image returned for ${filename}`);
  }

  const filepath = path.join(OUTPUT_DIR, filename);
  await downloadImage(imageUrl, filepath);
  console.log(`Saved: ${filepath}`);
}

async function main() {
  console.log("Generating blog hero images...\n");

  for (const hero of HERO_IMAGES) {
    try {
      await generateHeroImage(hero.prompt, hero.filename);
    } catch (error) {
      console.error(`Failed to generate ${hero.filename}:`, error);
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
