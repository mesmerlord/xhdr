import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { Toaster } from "sonner";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);
