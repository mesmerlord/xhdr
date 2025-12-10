import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import { s3Client, BUCKET_NAME } from "@/server/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export const uploadRouter = router({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { filename, contentType } = input;
      const key = `uploads/${ctx.user.id}/${uuidv4()}-${filename}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      const publicUrl = `${process.env.IMAGE_PUBLIC_URL}/${key}`;

      return {
        presignedUrl,
        key,
        publicUrl,
      };
    }),

  saveUploadedImage: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        key: z.string(),
        size: z.number(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const uploadedImage = await ctx.prisma.uploadedImage.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });

      return uploadedImage;
    }),

  getUserImages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const images = await ctx.prisma.uploadedImage.findMany({
        where: { userId: ctx.user.id },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (images.length > limit) {
        const nextItem = images.pop();
        nextCursor = nextItem!.id;
      }

      return {
        images,
        nextCursor,
      };
    }),
});
