const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || "INFO";
  }
  
  shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
  }
  
  format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }
  
  error(message, meta) {
    if (this.shouldLog("ERROR")) {
      console.error(this.format("ERROR", message, meta));
    }
  }
  
  warn(message, meta) {
    if (this.shouldLog("WARN")) {
      console.warn(this.format("WARN", message, meta));
    }
  }
  
  info(message, meta) {
    if (this.shouldLog("INFO")) {
      console.log(this.format("INFO", message, meta));
    }
  }
  
  debug(message, meta) {
    if (this.shouldLog("DEBUG")) {
      console.log(this.format("DEBUG", message, meta));
    }
  }
}

export const logger = new Logger();
