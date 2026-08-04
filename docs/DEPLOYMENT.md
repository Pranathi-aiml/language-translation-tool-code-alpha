# Production Deployment Guide — LinguaBridge AI

## 1. Docker Multi-Container Deployment

LinguaBridge AI includes Docker configurations for containerized cloud deployment.

### `docker-compose.yml` Template

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - DATABASE_URL=sqlite:///database.db
      - LIBRETRANSLATE_URL=http://translation-engine:5000/translate
    depends_on:
      - translation-engine

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

  translation-engine:
    image: libretranslate/libretranslate:latest
    restart: always
    ports:
      - "5001:5000"
```

### Launch Containers
```bash
docker-compose up -d --build
```

---

## 2. Nginx Reverse Proxy & SSL Configuration

Create `/etc/nginx/sites-available/linguabridge`:

```nginx
server {
    listen 80;
    server_name translation.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name translation.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/translation.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/translation.yourdomain.com/privkey.pem;

    # Serve React Static Build
    location / {
        root /var/www/linguabridge/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy REST API requests to Flask
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Production Environment Checklist
- [x] Set `DEBUG=False` in `.env`.
- [x] Generate a secure 64-character random string for `JWT_SECRET_KEY`.
- [x] Configure SSL/TLS certificates via Certbot (`sudo certbot --nginx`).
- [x] Enable rate limiting and CORS origin locks.
