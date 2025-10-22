# Security Policy

## Implementierte Sicherheitsmaßnahmen

### 1. Rate Limiting
- Default: 100 Requests pro 15 Minuten
- Konfigurierbar via `RATE_LIMIT_*` env vars
- IP-basierte Tracking

### 2. Input Validation
- Alle User-Inputs werden validiert und sanitized
- Max. Längen für Strings
- File-Type & Size Restrictions
- JSON Schema Validation

### 3. Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security (bei HTTPS)
```

### 4. File Upload Security
- Dateigröße: Max 10MB (konfigurierbar)
- Erlaubte Typen: .txt, .md, .csv, .json
- Filename Sanitization
- Temporäre Files werden nach Verarbeitung gelöscht

### 5. Error Handling
- Production: Keine Stack Traces
- Development: Vollständige Error Details
- Zentrale Error Logs

### 6. Environment Variables
- Validation beim Start
- Keine Secrets im Code
- `.env` in `.gitignore`

## Best Practices für Deployment

### HTTPS Erzwingen
```javascript
// In Production
if (req.headers['x-forwarded-proto'] !== 'https') {
  return res.redirect(`https://${req.headers.host}${req.url}`);
}
```

### Secrets Management
- Nutze KMS (AWS Secrets Manager, Azure Key Vault)
- Rotiere API-Keys regelmäßig
- Verwende separate Keys für Dev/Staging/Prod

### CORS Configuration
```javascript
// Production
cors({
  origin: ['https://yourdomain.com'],
  credentials: true
})
```

### Logging
- Keine Secrets in Logs
- Structured Logging (JSON)
- Log Rotation aktivieren
- Monitoring & Alerting

## Vulnerability Reporting

Bitte **KEINE** öffentlichen Issues für Security-Probleme erstellen.

Kontakt: [Deine E-Mail hier einfügen]

## Dependency Security

```bash
npm audit
npm audit fix
```

Regelmäßig Dependencies aktualisieren und prüfen.

## Checklist für Production

- [ ] `.env` nicht im Repo
- [ ] HTTPS aktiviert
- [ ] Rate Limits getestet
- [ ] CORS richtig konfiguriert
- [ ] Security Headers aktiv
- [ ] Error Handling getestet
- [ ] File Upload Limits gesetzt
- [ ] Logging konfiguriert
- [ ] Monitoring aktiv
- [ ] Backup-Strategie definiert
- [ ] Incident Response Plan vorhanden

## Known Limitations

1. **In-Memory Rate Limiting**: Bei Multi-Instance Setup Redis verwenden
2. **File Storage**: Local filesystem - für Produktion Cloud Storage nutzen
3. **Session Management**: Noch nicht implementiert
4. **OAuth**: Demo-Modus - für Produktion OAuth 2.0 implementieren

## Updates

Version 2.0.0 - Initial Security Hardening
- Rate Limiting
- Input Validation
- Security Headers
- Error Masking
