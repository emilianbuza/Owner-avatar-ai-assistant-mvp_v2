import fs from "fs";
import { analyzeToTasks } from "../services/aiService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { logger } from "../utils/logger.js";

export const analyzeText = asyncHandler(async (req, res) => {
  const messages = req.validatedMessages;
  const tasks = await analyzeToTasks(messages);
  
  res.json({
    ok: true,
    tasks,
    count: tasks.length
  });
});

export const analyzeFile = asyncHandler(async (req, res) => {
  const filePath = req.file.path;
  
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const messages = [{ 
      source: "File", 
      subject: req.file.originalname, 
      text: content.slice(0, 10000)
    }];
    
    const tasks = await analyzeToTasks(messages);
    
    fs.unlinkSync(filePath);
    
    res.json({
      ok: true,
      file: req.file.originalname,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
});

export const listFiles = asyncHandler(async (req, res) => {
  const uploadDir = req.app.get("uploadDir");
  
  if (!fs.existsSync(uploadDir)) {
    return res.json({ ok: true, files: [] });
  }
  
  const files = fs.readdirSync(uploadDir).map(name => ({
    name,
    size: fs.statSync(`${uploadDir}/${name}`).size,
    created: fs.statSync(`${uploadDir}/${name}`).birthtime
  }));
  
  res.json({ ok: true, files });
});
