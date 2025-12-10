import { route } from "@fal-ai/server-proxy/nextjs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: false,
  },
};

export const { GET, POST } = route;
export default route.handler;
