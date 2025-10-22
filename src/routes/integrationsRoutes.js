import express from "express";
import { 
  fetchAllMessages, 
  getSummary, 
  prioritizeTasks, 
  healthCheck 
} from "../controllers/integrationsController.js";
import { validateMessages } from "../middleware/validation.js";

export function createIntegrationsRouter() {
  const router = express.Router();
  
  router.get("/health", healthCheck);
  router.get("/fetch", fetchAllMessages);
  router.get("/summarize", getSummary);
  router.post("/prioritize", express.json(), validateMessages, prioritizeTasks);
  
  return router;
}
