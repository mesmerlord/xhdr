import { config } from "dotenv";

// Load environment variables first, before any other imports
if (process.env.NODE_ENV === "production") {
  config({ path: ".env.production" });
} else {
  config();
}

// Import after environment variables are loaded
import "./ad-generation.worker";
import "./email.worker";
import "./subscription.worker";

console.log("Queue worker started");
console.log("Environment:", process.env.NODE_ENV);
console.log("Redis URL:", process.env.REDIS_URL);
console.log("FAL API Key:", process.env.FAL_KEY ? "Set" : "Not Set");
console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not Set");
console.log("Resend API Key:", process.env.RESEND_API_KEY ? "Set" : "Not Set");

// Keep the process running
process.on("SIGTERM", () => {
  console.log("Shutting down queues...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Shutting down queues...");
  process.exit(0);
});
