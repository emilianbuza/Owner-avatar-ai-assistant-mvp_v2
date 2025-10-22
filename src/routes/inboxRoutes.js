import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { analyzeText, analyzeFile, listFiles } from "../controllers/inboxController.js";
import { validateMessages, validateFileUpload } from "../middleware/validation.js";

export function createInboxRouter(uploadDir) {
  const router = express.Router();
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      cb(null, `${timestamp}_${safe}`);
    }
  });
  
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });
  
  router.post("/text", express.json(), validateMessages, analyzeText);
  router.post("/upload", upload.single("file"), validateFileUpload, analyzeFile);
  router.get("/list", listFiles);
  
  return router;
}
