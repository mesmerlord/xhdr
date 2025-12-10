import type { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

interface HDRVideoSettings {
  intensity: number; // Brightness multiplier
  maxDimension?: number;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
    responseLimit: "50mb",
  },
};

async function processVideoWithHDR(
  inputBuffer: Buffer,
  settings: HDRVideoSettings
): Promise<Buffer> {
  const tempId = randomUUID();
  const inputPath = join(tmpdir(), `input-${tempId}.mp4`);
  const outputPath = join(tmpdir(), `output-${tempId}.mp4`);

  try {
    writeFileSync(inputPath, inputBuffer);

    const boost = settings.intensity;

    // Based on Reddit SDR to HDR conversion command
    // Adjust curves based on intensity
    const gamma = 0.1 + (boost - 1) * 0.05; // 2nd point Y value
    const brightness = 0.54 + (boost - 1) * 0.1; // 3rd point Y value
    const whiteLevel = Math.min(1, 0.9 + (boost - 1) * 0.1); // 4th point Y value

    const filters = [
      // Scale if needed
      settings.maxDimension ? `scale='min(${settings.maxDimension},iw)':-2:flags=lanczos` : null,
      // Convert to BT.709 full range first
      "zscale=pin=709:tin=709:min=709:rin=limited:p=709:t=709:m=709:r=full",
      // High precision format for color math
      "format=gbrpf32le",
      // Convert to BT.2020 with PQ (HDR10)
      "zscale=p=2020:t=smpte2084:m=2020_ncl:r=full",
      // Saturation adjustment
      `vibrance=intensity=${-0.5 + (boost - 1) * 0.2}:alternate=0`,
      `vibrance=intensity=${0.25 + (boost - 1) * 0.1}:alternate=1`,
      // First curves: gamma, brightness, white level
      `curves=all='0/0 0.1/${gamma.toFixed(2)} 0.3/${brightness.toFixed(2)} 0.75/${whiteLevel.toFixed(2)}'`,
      // Second curves: black level, shadows, contrast
      "curves=all='0/0 0.3/0.16 0.8/0.78 0.9/0.95 1/1'",
      // Final format
      "format=yuv420p10le",
    ].filter(Boolean).join(",");

    // FFmpeg command with HDR10 metadata
    const cmd = `ffmpeg -y -i "${inputPath}" -vf "${filters}" \
      -c:v libx265 -preset fast -crf 18 -tag:v hvc1 \
      -x265-params "hdr10=1:hdr10-opt=1" \
      -colorspace bt2020nc -color_primaries bt2020 -color_trc smpte2084 \
      -pix_fmt yuv420p10le \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      "${outputPath}" 2>&1`;

    try {
      execSync(cmd, { stdio: "pipe", maxBuffer: 100 * 1024 * 1024 });
    } catch (error: unknown) {
      const execError = error as { stderr?: Buffer; stdout?: Buffer };
      console.error(
        "FFmpeg error:",
        execError.stderr?.toString() || execError.stdout?.toString()
      );
      throw new Error("Failed to process video");
    }

    if (!existsSync(outputPath)) {
      throw new Error("Output video was not created");
    }

    const outputBuffer = readFileSync(outputPath);
    return outputBuffer;
  } finally {
    // Cleanup temp files
    try {
      if (existsSync(inputPath)) unlinkSync(inputPath);
      if (existsSync(outputPath)) unlinkSync(outputPath);
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
    const { video, settings } = req.body;

    if (!video) {
      return res.status(400).json({ error: "No video provided" });
    }

    const hdrSettings: HDRVideoSettings = {
      intensity: settings?.intensity ?? 1.5,
      maxDimension: settings?.maxDimension ?? 1080,
    };

    // Extract base64 data
    const base64Match = video.match(/^data:video\/\w+;base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({ error: "Invalid video format" });
    }

    const videoBuffer = Buffer.from(base64Match[1], "base64");
    const processedBuffer = await processVideoWithHDR(videoBuffer, hdrSettings);
    const base64Output = `data:video/mp4;base64,${processedBuffer.toString("base64")}`;

    return res.status(200).json({ video: base64Output });
  } catch (error) {
    console.error("HDR video processing error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process video",
    });
  }
}
