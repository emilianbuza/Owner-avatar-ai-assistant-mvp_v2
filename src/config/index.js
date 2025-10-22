import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["OPENAI_API_KEY"];

function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

validateEnv();

export const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN || ""
  },
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || ""
  },
  
  security: {
    sessionSecret: process.env.SESSION_SECRET || "fallback-dev-secret",
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10)
  },
  
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || ".txt,.md,.csv,.json").split(",")
  },
  
  isDevelopment: () => config.nodeEnv === "development",
  isProduction: () => config.nodeEnv === "production"
};
