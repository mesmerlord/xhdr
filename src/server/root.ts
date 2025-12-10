import { router } from "@/server/trpc";
import { userRouter } from "@/routers/user";
import { adGenerationRouter } from "@/routers/adGeneration";

export const appRouter = router({
  user: userRouter,
  adGeneration: adGenerationRouter,
});

export type AppRouter = typeof appRouter;
