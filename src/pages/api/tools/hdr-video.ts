import type { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { uploadToR2 } from "@/server/utils/r2";

interface HDRVideoSettings {
  intensity: number; // Brightness multiplier
  saturation: number; // Saturation multiplier
  maxDimension?: number;
}

// Twitter video requirements (conservative to avoid recompression)
const TWITTER_MAX_DURATION = 140; // 2:20 in seconds
const TWITTER_MAX_BITRATE = "8M";
const TWITTER_MAX_FPS = 30;
const MAX_DIMENSION = 1080;

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
      // Scale if needed (Twitter min 32x32, we cap at 1080)
      settings.maxDimension ? `scale='min(${settings.maxDimension},iw)':-2:flags=lanczos` : null,
      // Cap framerate to Twitter max of 40fps
      `fps=fps='min(source_fps,${TWITTER_MAX_FPS})'`,
      // Convert to BT.709 full range first
      "zscale=pin=709:tin=709:min=709:rin=limited:p=709:t=709:m=709:r=full",
      // High precision format for color math
      "format=gbrpf32le",
      // Convert to BT.2020 with PQ (HDR10)
      "zscale=p=2020:t=smpte2084:m=2020_ncl:r=full",
      // Saturation adjustment (now independent from brightness)
      `vibrance=intensity=${-0.5 + (settings.saturation - 1) * 0.3}:alternate=0`,
      `vibrance=intensity=${0.25 + (settings.saturation - 1) * 0.2}:alternate=1`,
      // First curves: gamma, brightness, white level
      `curves=all='0/0 0.1/${gamma.toFixed(2)} 0.3/${brightness.toFixed(2)} 0.75/${whiteLevel.toFixed(2)}'`,
      // Second curves: black level, shadows, contrast
      "curves=all='0/0 0.3/0.16 0.8/0.78 0.9/0.95 1/1'",
      // Final format
      "format=yuv420p10le",
    ].filter(Boolean).join(",");

    // FFmpeg command with HDR10 metadata
    // Twitter requirements: max 512MB, max 2:20 duration, max 25mbps bitrate, max 40fps
    const cmd = `ffmpeg -y -i "${inputPath}" -t ${TWITTER_MAX_DURATION} -vf "${filters}" \
      -c:v libx265 -preset fast -crf 28 -tag:v hvc1 \
      -maxrate ${TWITTER_MAX_BITRATE} -bufsize 8M \
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
      saturation: settings?.saturation ?? 1.0,
      maxDimension: settings?.maxDimension ?? MAX_DIMENSION,
    };

    // Extract base64 data - use indexOf instead of regex to avoid stack overflow on large strings
    const base64Prefix = "base64,";
    const base64Index = video.indexOf(base64Prefix);
    if (base64Index === -1 || !video.startsWith("data:video/")) {
      return res.status(400).json({ error: "Invalid video format" });
    }

    const base64Data = video.slice(base64Index + base64Prefix.length);
    const videoBuffer = Buffer.from(base64Data, "base64");
    const processedBuffer = await processVideoWithHDR(videoBuffer, hdrSettings);

    // Upload to R2 and return CDN URL
    const videoId = randomUUID();
    const key = `uploads/videos/${videoId}.mp4`;
    const cdnUrl = await uploadToR2(processedBuffer, key, "video/mp4");

    return res.status(200).json({ video: cdnUrl });
  } catch (error) {
    console.error("HDR video processing error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process video",
    });
  }
}
