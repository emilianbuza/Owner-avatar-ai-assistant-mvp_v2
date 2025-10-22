export const PRIORITY = {
  URGENT: 1,
  IMPORTANT: 2,
  LATER: 3
};

export const PRIORITY_LABELS = {
  [PRIORITY.URGENT]: "Dringend",
  [PRIORITY.IMPORTANT]: "Wichtig (48h)",
  [PRIORITY.LATER]: "Später"
};

export const TASK_DEFAULTS = {
  EFFORT_MINUTES: 30,
  MAX_STEPS: 5,
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 200
};

export const AI_CONFIG = {
  MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.2,
  MAX_TOKENS: 3000,
  TIMEOUT_MS: 30000
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ERROR_MESSAGES = {
  NO_API_KEY: "OpenAI API Key fehlt",
  NO_MESSAGES: "Keine Nachrichten zur Analyse",
  INVALID_INPUT: "Ungültige Eingabe",
  AI_FAILED: "KI-Analyse fehlgeschlagen",
  FILE_TOO_LARGE: "Datei zu groß",
  FILE_TYPE_INVALID: "Dateityp nicht erlaubt",
  RATE_LIMIT_EXCEEDED: "Rate Limit überschritten"
};

export const STORAGE_KEYS = {
  TASKS: "aii_tasks_v2",
  DONE_TASKS: "aii_tasks_done_v2",
  TIME_SAVED: "aii_time_saved_today",
  SESSION: "aii_session"
};
