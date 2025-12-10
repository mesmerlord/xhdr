import { router } from "@/server/trpc";
import { userRouter } from "@/routers/user";
import { uploadRouter } from "@/routers/upload";
import { adGenerationRouter } from "@/routers/adGeneration";

export const appRouter = router({
  upload: uploadRouter,
  user: userRouter,
  adGeneration: adGenerationRouter,
});

export type AppRouter = typeof appRouter;
