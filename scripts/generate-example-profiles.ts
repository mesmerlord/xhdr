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

const OUTPUT_DIR = path.join(process.cwd(), "public/example-profiles");

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

// Example profile pictures with specified races for diversity
const EXAMPLE_PROFILES = [
  {
    filename: "profile-woman-1.jpg",
    prompt:
      "Professional headshot portrait of a confident Black woman in her 30s, natural hair, warm smile, wearing orange blazer, clean neutral gray background, soft studio lighting, high quality corporate headshot, square format 1:1",
  },
  {
    filename: "profile-man-1.jpg",
    prompt:
      "Professional headshot portrait of a Caucasian man in his 40s, short brown hair, friendly expression, wearing navy suit jacket, clean neutral background, soft studio lighting, high quality LinkedIn headshot, square format 1:1",
  },
  {
    filename: "profile-woman-2.jpg",
    prompt:
      "Professional headshot portrait of an Asian woman in her 20s, long black hair, confident smile, wearing red top, clean white background, natural lighting, high quality professional photo, square format 1:1",
  },
  {
    filename: "profile-man-2.jpg",
    prompt:
      "Professional headshot portrait of a Hispanic man in his 30s, neat beard, warm genuine smile, wearing light blue shirt, clean gray background, soft studio lighting, high quality headshot, square format 1:1",
  },
];

async function generateProfile(
  prompt: string,
  filename: string
): Promise<void> {
  console.log(`Generating: ${filename}...`);

  const result = await fal.subscribe("fal-ai/z-image/turbo", {
    input: {
      prompt: prompt,
      image_size: {
        width: 512,
        height: 512,
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
  console.log("Generating example profile pictures...\n");

  for (const profile of EXAMPLE_PROFILES) {
    try {
      await generateProfile(profile.prompt, profile.filename);
    } catch (error) {
      console.error(`Failed to generate ${profile.filename}:`, error);
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
