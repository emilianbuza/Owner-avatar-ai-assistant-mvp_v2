# AI Inbox Assistant MVP v2.0

Production-ready AI-powered inbox assistant mit Task-Priorisierung, Security Best Practices und modularer Architektur.

## 🚀 Neu in v2.0

- ✅ **Security**: Rate Limiting, Input Validation, Security Headers, XSS Protection
- ✅ **Architektur**: Saubere Trennung (Controllers, Services, Middleware, Routes)
- ✅ **Error Handling**: Zentral, strukturiert, mit Logging
- ✅ **Frontend**: Modular (App, UI, Utils, Constants)
- ✅ **Config Management**: Environment-basiert, validiert
- ✅ **Code Quality**: JSDoc Types, Konstanten, DRY-Prinzip

## 📋 Features

- Gmail & Slack Integration (Demo-Modus)
- KI-basierte Aufgabenanalyse mit GPT-4o-mini
- Prioritätsbasierte Task-Sortierung
- File Upload mit Validierung
- Zeitschätzung & Tracking
- Responsive UI
- Lokale Datenpersistenz

## 🛠️ Installation

```bash
npm install
cp .env.example .env
# .env editieren und API-Keys eintragen
npm start
```

## 🔧 Konfiguration

Alle Einstellungen in `.env`:

```env
PORT=8080
NODE_ENV=development
OPENAI_API_KEY=dein-key-hier

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE_MB=10
```

## 📁 Projektstruktur

```
/src
  /config          # Environment & Config
  /constants       # Zentrale Konstanten
  /controllers     # Request Handler
  /middleware      # Validation, Error, Security
  /services        # Business Logic (AI, Gmail, Slack)
  /routes          # API Routes
  /utils           # Logger, Helpers
/public
  /css             # Styles
  /js              # Frontend Module
  index.html       # UI
server.js          # Entry Point
```

## 🔒 Sicherheit

- Rate Limiting (100 Requests / 15 Min)
- Input Sanitization & Validation
- Security Headers (XSS, CSRF Protection)
- File Upload Restrictions
- Error Masking in Production
- Environment Variable Validation

## 🚦 API Endpoints

### Public
- `GET /` - UI
- `GET /api/health` - Health Check

### Inbox
- `POST /inbox/text` - Text analysieren
- `POST /inbox/upload` - File hochladen
- `GET /inbox/list` - Uploads auflisten

### Integrations
- `GET /api/fetch` - Gmail/Slack abrufen
- `POST /api/prioritize` - Tasks priorisieren
- `GET /api/summarize` - Nachrichten zusammenfassen

## 🎨 Frontend Module

- `app.js` - Main App Logic
- `ui.js` - Rendering
- `utils.js` - Helpers (Storage, API)
- `constants.js` - Frontend Konstanten

## 📝 Logging

```javascript
import { logger } from "./src/utils/logger.js";

logger.info("Message", { meta: "data" });
logger.warn("Warning", { details });
logger.error("Error", { error });
```

## 🧪 Testing

```bash
# Health Check
curl http://localhost:8080/api/health

# Demo Fetch
curl http://localhost:8080/api/fetch

# Task Analysis
curl -X POST http://localhost:8080/inbox/text \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"source":"Test","text":"Meeting heute 15 Uhr"}]}'
```

## ⚠️ WICHTIG: Sicherheit

1. **NIEMALS** `.env` ins Repository committen
2. API-Keys regelmäßig rotieren
3. Rate Limits an Traffic anpassen
4. HTTPS in Produktion verwenden
5. Logging-Level in Produktion auf ERROR setzen

## 🔄 Migration von v1.0

1. Dependencies aktualisieren: `npm install`
2. `.env` nach `.env.example` anpassen
3. Server-Start: `npm start`
4. Frontend-Cache leeren (Strg+Shift+R)

## 📈 Performance

- Response Caching (TODO)
- Database Connection Pooling (TODO)
- CDN für Static Assets (TODO)
- Compression Middleware (TODO)

## 🐛 Known Issues

- OAuth für Gmail/Slack noch nicht implementiert (Demo-Modus aktiv)
- File Upload nur im Memory (für Produktion: S3/Cloud Storage)
- Keine Datenbank (localStorage only)

## 📄 License

MIT

## 🤝 Contributing

Pull Requests willkommen! Bitte Tests und Dokumentation beilegen.
