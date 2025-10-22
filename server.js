import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./src/config/index.js";
import { logger } from "./src/utils/logger.js";
import { errorHandler, notFoundHandler } from "./src/middleware/errorHandler.js";
import { rateLimit, securityHeaders, requestLogger } from "./src/middleware/security.js";
import { createInboxRouter } from "./src/routes/inboxRoutes.js";
import { createIntegrationsRouter } from "./src/routes/integrationsRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("config", config);
app.set("uploadDir", path.join(__dirname, "inbox", "uploads"));
app.set("trust proxy", 1);

app.use(cors({
  origin: config.isDevelopment() ? "*" : process.env.ALLOWED_ORIGINS?.split(",") || [],
  credentials: true
}));

app.use(securityHeaders);
app.use(requestLogger);
app.use(rateLimit(config.security));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/inbox", createInboxRouter(app.get("uploadDir")));
app.use("/api", createIntegrationsRouter());

app.use(notFoundHandler);
app.use(errorHandler);

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message, stack: error.stack });
  process.exit(1);
});

const server = app.listen(config.port, () => {
  logger.info(`AI Assistant MVP running on port ${config.port}`, {
    env: config.nodeEnv,
    pid: process.pid
  });
});

function gracefulShutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`);
  
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
