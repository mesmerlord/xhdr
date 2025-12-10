// This file configures the initialization of Sentry on the server side.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Only import and initialize Sentry in production
if (process.env.NODE_ENV === "production") {
  import("@sentry/nextjs").then((Sentry) => {
    console.log("🚀 Sentry server config loading...");
    console.log("SENTRY_DSN:", process.env.SENTRY_DSN);

    if (!process.env.SENTRY_DSN) {
      console.error("❌ SENTRY_DSN is not set!");
    } else {
      console.log("✅ Server DSN found, initializing Sentry...");

      Sentry.init({
        dsn: process.env.SENTRY_DSN,

        // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 1,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false, // Disable debug in production

        // uncomment the line below to enable Spotlight (https://spotlightjs.com)
        // spotlight: process.env.NODE_ENV === 'development',
      });

      console.log("✅ Sentry server initialization complete");
    }
  });
} else {
  console.log("🚫 Skipping Sentry server initialization in development mode");
}

export {};
