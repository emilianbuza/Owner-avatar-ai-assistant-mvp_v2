import { HTTP_STATUS, ERROR_MESSAGES, TASK_DEFAULTS } from "../constants/index.js";
import { AppError } from "./errorHandler.js";

export function validateMessages(req, res, next) {
  const { body } = req;
  
  if (!body || typeof body !== "object") {
    throw new AppError(ERROR_MESSAGES.INVALID_INPUT, HTTP_STATUS.BAD_REQUEST);
  }
  
  const messages = body.messages || body.text;
  
  if (!messages) {
    throw new AppError(ERROR_MESSAGES.NO_MESSAGES, HTTP_STATUS.BAD_REQUEST);
  }
  
  let parsed;
  if (typeof messages === "string") {
    try {
      parsed = JSON.parse(messages);
    } catch {
      parsed = [{ source: "Direct", text: messages }];
    }
  } else {
    parsed = messages;
  }
  
  if (!Array.isArray(parsed)) {
    parsed = [parsed];
  }
  
  if (parsed.length === 0) {
    throw new AppError(ERROR_MESSAGES.NO_MESSAGES, HTTP_STATUS.BAD_REQUEST);
  }
  
  if (parsed.length > 100) {
    throw new AppError("Maximal 100 Nachrichten erlaubt", HTTP_STATUS.BAD_REQUEST);
  }
  
  req.validatedMessages = parsed.map(sanitizeMessage);
  next();
}

function sanitizeMessage(msg) {
  return {
    source: String(msg.source || "Unknown").slice(0, 50),
    subject: String(msg.subject || "").slice(0, 200),
    text: String(msg.text || msg.snippet || "").slice(0, 5000),
    from: String(msg.from || "").slice(0, 200)
  };
}

export function validateFileUpload(req, res, next) {
  if (!req.file) {
    throw new AppError("Keine Datei hochgeladen", HTTP_STATUS.BAD_REQUEST);
  }
  
  const maxSize = req.app.get("config").upload.maxFileSizeMB * 1024 * 1024;
  if (req.file.size > maxSize) {
    throw new AppError(ERROR_MESSAGES.FILE_TOO_LARGE, HTTP_STATUS.BAD_REQUEST);
  }
  
  const ext = req.file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
  const allowedTypes = req.app.get("config").upload.allowedTypes;
  
  if (!ext || !allowedTypes.includes(ext)) {
    throw new AppError(ERROR_MESSAGES.FILE_TYPE_INVALID, HTTP_STATUS.BAD_REQUEST);
  }
  
  next();
}

export function sanitizeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
