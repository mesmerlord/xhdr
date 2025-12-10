import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { addToAdGenerationQueue } from "@/queue/queues";
import { CREDITS_COST } from "@/constants/pricing";

export const adGenerationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        width: z.number().min(256).max(2048).default(1024),
        height: z.number().min(256).max(2048).default(1024),
        inputImageId: z.string().optional(),
        adType: z.enum(["PRODUCT_AD", "BANNER_AD", "SOCIAL_AD", "DISPLAY_AD"]).default("PRODUCT_AD"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has enough credits
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { credits: true },
      });

      if (!user || user.credits < CREDITS_COST.AD_GENERATION) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not enough credits. Please upgrade your plan.",
        });
      }

      // Create ad generation record
      const adGeneration = await ctx.prisma.adGeneration.create({
        data: {
          prompt: input.prompt,
          width: input.width,
          height: input.height,
          adType: input.adType,
          inputImageId: input.inputImageId,
          userId: ctx.user.id,
          modelId: "fal-ai/seedream-3-edit", // Default model
          status: "PENDING",
          imageUrls: [],
        },
      });

      // Deduct credits
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          credits: { decrement: CREDITS_COST.AD_GENERATION },
        },
      });

      // Add to queue
      await addToAdGenerationQueue({ adGenerationId: adGeneration.id });

      return adGeneration;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const adGeneration = await ctx.prisma.adGeneration.findUnique({
        where: { id: input.id },
        include: {
          inputImage: true,
        },
      });

      if (!adGeneration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ad generation not found",
        });
      }

      if (adGeneration.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this ad generation",
        });
      }

      return adGeneration;
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const generations = await ctx.prisma.adGeneration.findMany({
        where: { userId: ctx.user.id },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          inputImage: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (generations.length > limit) {
        const nextItem = generations.pop();
        nextCursor = nextItem!.id;
      }

      return {
        generations,
        nextCursor,
      };
    }),

  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const adGeneration = await ctx.prisma.adGeneration.findUnique({
        where: { id: input.id },
      });

      if (!adGeneration || adGeneration.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ad generation not found",
        });
      }

      const updated = await ctx.prisma.adGeneration.update({
        where: { id: input.id },
        data: { favorite: !adGeneration.favorite },
      });

      return updated;
    }),

  getRecent: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      const generations = await ctx.prisma.adGeneration.findMany({
        where: {
          userId: ctx.user.id,
          status: "COMPLETED",
        },
        take: input.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          imageUrls: true,
          prompt: true,
          createdAt: true,
        },
      });

      return generations;
    }),

  generate: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        width: z.number().min(256).max(2048).default(1024),
        height: z.number().min(256).max(2048).default(1024),
        inputImageId: z.string().optional(),
        adType: z.enum(["PRODUCT_AD", "BANNER_AD", "SOCIAL_AD", "DISPLAY_AD", "SOCIAL_MEDIA", "BANNER", "PROMOTIONAL"]).default("PRODUCT_AD"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has enough credits
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { credits: true },
      });

      if (!user || user.credits < CREDITS_COST.AD_GENERATION) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not enough credits. Please upgrade your plan.",
        });
      }

      // Normalize ad type
      const normalizedAdType = (input.adType === "SOCIAL_MEDIA" ? "SOCIAL_AD" :
                               input.adType === "BANNER" ? "BANNER_AD" :
                               input.adType === "PROMOTIONAL" ? "PRODUCT_AD" :
                               input.adType) as "PRODUCT_AD" | "BANNER_AD" | "SOCIAL_AD" | "DISPLAY_AD";

      // Create ad generation record
      const adGeneration = await ctx.prisma.adGeneration.create({
        data: {
          prompt: input.prompt,
          width: input.width,
          height: input.height,
          adType: normalizedAdType,
          inputImageId: input.inputImageId,
          userId: ctx.user.id,
          modelId: input.inputImageId ? "fal-ai/seedream-3-edit" : "fal-ai/nano-banana-pro",
          status: "PENDING",
          imageUrls: [],
        },
      });

      // Deduct credits
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          credits: { decrement: CREDITS_COST.AD_GENERATION },
        },
      });

      // Add to queue
      await addToAdGenerationQueue({ adGenerationId: adGeneration.id });

      return adGeneration;
    }),
});
