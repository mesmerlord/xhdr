import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/utils/auth";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/server/utils/db";
import type { NextApiRequest } from "next";
import type { Session } from "next-auth";
import * as Sentry from "@sentry/node";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts.req, opts.res, authOptions);
  return {
    session,
    prisma,
    req: opts.req || undefined,
  };
};

export type Context = {
  session: Session | null;
  prisma: typeof prisma;
  req?: NextApiRequest;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;

// Sentry middleware for all procedures
const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: false,
  })
);

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this. Please login",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

export const publicProcedure = t.procedure.use(sentryMiddleware);
export const protectedProcedure = t.procedure
  .use(sentryMiddleware)
  .use(isAuthed);
