// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Only import and initialize Sentry in production
if (process.env.NODE_ENV === "production") {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });

    console.log("✅ Sentry edge initialization complete");
  });
} else {
  console.log("🚫 Skipping Sentry edge initialization in development mode");
}

export {};
