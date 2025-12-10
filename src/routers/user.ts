import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { TRPCError } from "@trpc/server";
import { goodEmailDomains } from "@/constants/good_emails";

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        stripeCustomer: {
          include: {
            subscriptions: {
              where: {
                status: { in: ["active", "trialing"] },
              },
              orderBy: { currentPeriodEnd: "desc" },
              take: 1,
              include: {
                price: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const subscription = user.stripeCustomer?.subscriptions[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      credits: user.credits,
      subscriptionStatus: subscription?.status || null,
      subscriptionPlan: subscription?.price?.product?.name?.toLowerCase() || null,
    };
  }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create verification token
      const token = uuidv4();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      // Create verification token
      await ctx.prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // TODO: Send verification email

      return { success: true, message: "Please check your email to verify your account" };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      const verificationToken = await ctx.prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid verification token",
        });
      }

      if (verificationToken.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification token has expired",
        });
      }

      // Update user
      await ctx.prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });

      // Delete verification token
      await ctx.prisma.verificationToken.delete({
        where: { token },
      });

      return { success: true, message: "Email verified successfully" };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        credits: true,
        createdAt: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  getCredits: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { credits: true },
    });

    return user?.credits ?? 0;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      });

      return user;
    }),
});
