const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Include ICC profile and WASM for HDR image processing
    outputFileTracingIncludes: {
      '/api/tools/twitter-hdr': [
        './2020_profile.icc',
        './node_modules/@imagemagick/magick-wasm/dist/magick.wasm',
      ],
    },
  },
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google user profile images
      "avatars.githubusercontent.com", // GitHub avatars (if needed)
      "fal.media", // FAL AI generated images
      "v3.fal.media", // FAL AI v3 images
      "storage.googleapis.com", // GCS images
    ],
  },
  webpack: (config, { webpack }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals["node:fs"] = "commonjs node:fs";
    config.externals["node:path"] = "commonjs node:path";
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );

    return config;
  },
};

// Only apply Sentry configuration in production
if (process.env.NODE_ENV === "production") {
  module.exports = withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "sentry",
    project: "admakeai",
    sentryUrl: process.env.SENTRY_URL || "https://sentry.io",

    // Only print logs for uploading source maps in CI
    silent: true,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Disable source map uploading to prevent interference with standalone builds
    hideSourceMaps: false,
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    webpack: (config, { webpack }) => {
      config.plugins.push(
        new webpack.DefinePlugin({
          __SENTRY_DEBUG__: false,
          __SENTRY_TRACING__: false,
          __RRWEB_EXCLUDE_IFRAME__: true,
          __RRWEB_EXCLUDE_SHADOW_DOM__: true,
          __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
        })
      );
      // return the modified config
      return config;
    },
  });
} else {
  // In development, just export the base config without Sentry
  module.exports = nextConfig;
}
