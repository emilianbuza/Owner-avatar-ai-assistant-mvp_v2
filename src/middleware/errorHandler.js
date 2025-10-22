import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import { logger } from "../utils/logger.js";

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.SERVER_ERROR, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err, req, res, next) {
  let { statusCode, message, details } = err;
  
  if (!err.isOperational) {
    statusCode = HTTP_STATUS.SERVER_ERROR;
    message = "Ein unerwarteter Fehler ist aufgetreten";
    logger.error("Unhandled error:", err);
  } else {
    logger.warn(`Operational error: ${message}`, { statusCode, details, path: req.path });
  }
  
  const response = {
    ok: false,
    error: message
  };
  
  if (details && req.app.get("env") !== "production") {
    response.details = details;
  }
  
  if (req.app.get("env") !== "production" && err.stack) {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    ok: false,
    error: `Route ${req.method} ${req.path} nicht gefunden`
  });
}
