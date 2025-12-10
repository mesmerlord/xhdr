import type { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

interface HDRSettings {
  intensity: number;
  gamma: number;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

async function processImageWithHDR(
  inputBuffer: Buffer,
  settings: HDRSettings
): Promise<Buffer> {
  const tempId = randomUUID();
  const inputPath = join(tmpdir(), `input-${tempId}.png`);
  const outputPath = join(tmpdir(), `output-${tempId}.png`);
  const iccPath = join(process.cwd(), "2020_profile.icc");

  try {
    // Convert input to PNG first using sharp (handles various input formats)
    const sharp = (await import("sharp")).default;
    const pngBuffer = await sharp(inputBuffer).png().toBuffer();
    writeFileSync(inputPath, pngBuffer);

    // ImageMagick command for HDR conversion (no resize)
    // 1. Convert to linear RGB
    // 2. Auto-gamma
    // 3. Multiply (brightness boost)
    // 4. Pow (gamma)
    // 5. Back to sRGB
    // 6. 16-bit depth
    // 7. Assign Rec.2020 ICC profile
    // 8. Add alpha with slight transparency
    const cmd = `magick "${inputPath}" -define quantum:format=floating-point -colorspace RGB -auto-gamma -evaluate Multiply ${settings.intensity} -evaluate Pow ${settings.gamma} -colorspace sRGB -depth 16 -profile "${iccPath}" \\( +clone -alpha extract -evaluate Multiply 0.996 \\) -alpha off -compose CopyOpacity -composite "${outputPath}"`;

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
    };

    // Extract base64 data
    const base64Match = image.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    const imageBuffer = Buffer.from(base64Match[1], "base64");
    const processedBuffer = await processImageWithHDR(imageBuffer, hdrSettings);
    const base64Output = `data:image/png;base64,${processedBuffer.toString("base64")}`;

    return res.status(200).json({ image: base64Output });
  } catch (error) {
    console.error("HDR processing error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process image",
    });
  }
}
