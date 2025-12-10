import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "xhdr-org";

export const CDN_URL = process.env.CDN_PUBLIC_URL || "https://images.xhdr.org";

// Folder structure in R2 bucket (xhdr-org):
//   public_media/    - Static assets from /public folder
//   uploads/         - User uploaded files (videos, images)

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  return `${CDN_URL}/${key}`;
}

export function getPublicUrl(key: string): string {
  return `${CDN_URL}/${key}`;
}
