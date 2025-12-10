import { fal } from "@fal-ai/client";

// Configure fal client with proxy and secret for backend usage
fal.config({
  proxyUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/next-api/proxy"
      : "https://admakeai.com/api/next-api/proxy",
  requestMiddleware: async (request) => {
    // Add secret header for backend requests to bypass model restrictions
    if (process.env.FAL_PROXY_SECRET) {
      return {
        ...request,
        headers: {
          ...request.headers,
          "x-fal-proxy-secret": process.env.FAL_PROXY_SECRET,
        },
      };
    }
    return request;
  },
});

console.log("FAL client configured");
export { fal };
