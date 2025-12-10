import type { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { uploadToR2 } from "@/server/utils/r2";

const OUTPUT_SIZE = 400;

interface HDRSettings {
  intensity: number;
  gamma: number;
  cropOffset: number; // 0-1, where 0.5 is center
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

function calculateCropPosition(
  width: number,
  height: number,
  cropOffset: number // 0-1, where 0.5 is center
): { left: number; top: number } {
  const minDim = Math.min(width, height);
  const isWide = width > height;

  let left = 0;
  let top = 0;

  if (isWide) {
    // Horizontal image - crop moves left/right
    const maxOffset = width - minDim;
    left = Math.floor(cropOffset * maxOffset);
  } else {
    // Vertical image - crop moves up/down
    const maxOffset = height - minDim;
    top = Math.floor(cropOffset * maxOffset);
  }

  return { left, top };
}

async function processImageWithHDR(
  inputBuffer: Buffer,
  settings: HDRSettings
): Promise<Buffer> {
  const sharp = (await import("sharp")).default;

  // Step 1: Use sharp to crop and resize only
  const metadata = await sharp(inputBuffer).metadata();
  const width = metadata.width || OUTPUT_SIZE;
  const height = metadata.height || OUTPUT_SIZE;
  const minDim = Math.min(width, height);

  // Calculate crop position based on user selection
  const { left, top } = calculateCropPosition(
    width,
    height,
    settings.cropOffset
  );

  const resizedBuffer = await sharp(inputBuffer)
    .extract({
      left,
      top,
      width: minDim,
      height: minDim,
    })
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  // Step 2: Use ImageMagick for the HDR conversion
  const tempId = randomUUID();
  const inputPath = join(tmpdir(), `input-${tempId}.png`);
  const outputPath = join(tmpdir(), `output-${tempId}.png`);
  const iccPath = join(process.cwd(), "2020_profile.icc");

  try {
    writeFileSync(inputPath, resizedBuffer);

    // Exact ImageMagick command that works:
    // 1. Convert to linear RGB
    // 2. Auto-gamma
    // 3. Multiply (brightness boost)
    // 4. Pow (gamma)
    // 5. Back to sRGB
    // 6. 16-bit depth
    // 7. Assign Rec.2020 ICC profile
    // 8. Add alpha channel with slight transparency (99.6% opaque) to force Twitter to keep PNG
    const cmd = `convert "${inputPath}" -define quantum:format=floating-point -colorspace RGB -auto-gamma -evaluate Multiply ${settings.intensity} -evaluate Pow ${settings.gamma} -colorspace sRGB -depth 16 -profile "${iccPath}" -alpha on -channel A -evaluate set 99.6% +channel "${outputPath}"`;

    execSync(cmd, { stdio: "pipe" });

    const outputBuffer = readFileSync(outputPath);
    return outputBuffer;
  } finally {
    // Cleanup temp files
    try {
      unlinkSync(inputPath);
      unlinkSync(outputPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, settings } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const hdrSettings: HDRSettings = {
      intensity: settings?.hdrIntensity ?? 1.5,
      gamma: settings?.gamma ?? 0.9,
      cropOffset: settings?.cropOffset ?? 0.5,
    };

    // Extract base64 data - use indexOf instead of regex to avoid stack overflow on large strings
    const base64Prefix = "base64,";
    const base64Index = image.indexOf(base64Prefix);
    if (base64Index === -1 || !image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    const base64Data = image.slice(base64Index + base64Prefix.length);
    const imageBuffer = Buffer.from(base64Data, "base64");
    const processedBuffer = await processImageWithHDR(imageBuffer, hdrSettings);

    // Upload to R2 and return CDN URL
    const imageId = randomUUID();
    const key = `uploads/images/${imageId}.png`;
    const cdnUrl = await uploadToR2(processedBuffer, key, "image/png");

    return res.status(200).json({ image: cdnUrl });
  } catch (error) {
    console.error("HDR processing error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process image",
    });
  }
}
