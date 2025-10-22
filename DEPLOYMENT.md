# Deployment Guide

## Lokale Entwicklung

```bash
git clone <repo-url>
cd ai-assistant-mvp
npm install
cp .env.example .env
# .env editieren
npm run dev
```

Browser: http://localhost:8080

## Production Deployment

### Option 1: Render.com

1. Repository auf GitHub pushen
2. Render.com Account erstellen
3. "New Web Service" → Repository verknüpfen
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm run prod`
   - Environment: Node 18+
5. Environment Variables setzen:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=sk-...
   SESSION_SECRET=random-secure-string
   ```

### Option 2: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set OPENAI_API_KEY=sk-...
railway variables set NODE_ENV=production
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "run", "prod"]
```

```bash
docker build -t ai-assistant .
docker run -p 8080:8080 --env-file .env ai-assistant
```

### Option 4: VPS (Ubuntu)

```bash
# Server Setup
sudo apt update
sudo apt install nodejs npm nginx certbot

# App Setup
git clone <repo-url>
cd ai-assistant-mvp
npm install
cp .env.example .env
nano .env  # Keys eintragen

# PM2 Process Manager
npm install -g pm2
pm2 start server.js --name ai-assistant
pm2 startup
pm2 save

# Nginx Reverse Proxy
sudo nano /etc/nginx/sites-available/ai-assistant
```

Nginx Config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ai-assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL mit Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Required
```env
OPENAI_API_KEY=sk-proj-...
```

### Optional
```env
PORT=8080
NODE_ENV=production
LOG_LEVEL=ERROR

SESSION_SECRET=generate-with-crypto
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=.txt,.md,.csv,.json
ALLOWED_ORIGINS=https://yourdomain.com

# Gmail OAuth (future)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Slack (future)
SLACK_BOT_TOKEN=xoxb-...
```

## Health Checks

```bash
curl https://your-domain.com/api/health
```

Expected Response:
```json
{
  "ok": true,
  "timestamp": "2025-10-22T10:00:00.000Z",
  "uptime": 3600.5,
  "memory": {...}
}
```

## Monitoring

### Logs
```bash
# PM2
pm2 logs ai-assistant

# Docker
docker logs -f <container-id>

# Render/Railway
Dashboard → Logs Tab
```

### Metrics
- Response Times
- Error Rates
- Rate Limit Hits
- Memory Usage
- CPU Usage

Tools: Datadog, New Relic, Prometheus

## Backup Strategy

### Database (Future)
```bash
# PostgreSQL Dump
pg_dump -U user -d db > backup.sql
```

### Environment
- Secrets in KMS (AWS/Azure/GCP)
- `.env` niemals committen
- Separate Keys für Environments

## Rollback

```bash
# PM2
pm2 restart ai-assistant

# Git
git checkout <previous-commit>
pm2 restart ai-assistant

# Docker
docker pull <image>:<previous-tag>
docker stop <container>
docker run ...
```

## Performance Tuning

### Node.js
```bash
NODE_OPTIONS="--max-old-space-size=4096"
```

### Nginx Caching
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
proxy_cache my_cache;
proxy_cache_valid 200 1h;
```

### CDN für Static Assets
- Cloudflare
- AWS CloudFront
- Vercel Edge

## Security Checklist

- [ ] HTTPS aktiviert
- [ ] Environment Variables gesichert
- [ ] Rate Limits getestet
- [ ] CORS konfiguriert
- [ ] Security Headers aktiv
- [ ] File Upload Limits gesetzt
- [ ] Error Masking in Production
- [ ] Logging ohne Secrets
- [ ] Firewall konfiguriert
- [ ] SSH Key-based Auth
- [ ] Auto-Updates aktiviert

## Troubleshooting

### Port bereits belegt
```bash
lsof -i :8080
kill -9 <PID>
```

### Permissions Error
```bash
sudo chown -R $USER:$USER /app
```

### High Memory Usage
```bash
pm2 restart ai-assistant
# oder
pm2 reload ai-assistant  # zero-downtime
```

### 502 Bad Gateway
- Server läuft nicht → `pm2 status`
- Port falsch → Nginx Config prüfen
- Firewall blockiert → `sudo ufw status`

## Support

Issues: https://github.com/your-repo/issues
Docs: https://github.com/your-repo/wiki
