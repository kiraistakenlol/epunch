# epunch VPS Deployment Guide

Complete guide for deploying epunch to your VPS at epunch.app domain.

---

## Prerequisites

- VPS with root access (same VPS as kiraistaken.lol)
- Domain: epunch.app with DNS management access
- Docker and Docker Compose installed on VPS
- Git access to epunch repository

---

## Architecture Overview

### VPS Structure
```
VPS (45.32.117.48)
├── /root/kiraistaken-infra/          # Nginx configs for all projects
│   └── nginx/sites/
│       ├── root.conf                  # kiraistaken.lol
│       ├── soulmirror.conf           # soulmirror.kiraistaken.lol
│       ├── xchange.conf              # xchange.kiraistaken.lol
│       └── epunch.conf               # NEW: epunch.app configs
│
├── /root/epunch/                      # epunch application
│   ├── docker-compose.yml
│   ├── .env
│   ├── application/
│   └── database/
│
└── nginx (system-level)
    Routes both kiraistaken.lol AND epunch.app domains
```

### Domain & Port Mapping
```
epunch.app                  → Backend port 4000 (user-app served at /)
api.epunch.app             → Backend port 4000 (API routes)
merchant.epunch.app        → Merchant app port 3002
admin.epunch.app           → Admin app port 3003

Database: Internal PostgreSQL on port 54320 (mapped from container)
```

### API Path Configuration
**Important:** The API prefix differs between local and production:

**Local Development:**
- Backend prefix: `/api/v1`
- Full API URL: `http://localhost:4000/api/v1`
- Example: `http://localhost:4000/api/v1/auth`

**Production (VPS):**
- Backend prefix: `/v1` (domain already contains "api")
- Full API URL: `https://api.epunch.app/v1`
- Example: `https://api.epunch.app/v1/auth`

This is controlled by the `API_PREFIX` environment variable in backend configuration.

---

## Phase 1: VPS Preparation

### 1.1 Update DNS Records

Point your epunch.app domain to VPS IP:

```
A Record:
  epunch.app          → 45.32.117.48
  *.epunch.app        → 45.32.117.48

Or individual subdomains:
  epunch.app          → 45.32.117.48
  api.epunch.app      → 45.32.117.48
  merchant.epunch.app → 45.32.117.48
  admin.epunch.app    → 45.32.117.48
```

**Verify DNS propagation:**
```bash
dig epunch.app
dig api.epunch.app
```

### 1.2 Clone Repository to VPS

```bash
ssh root@45.32.117.48

cd /root
git clone <your-epunch-repo-url> epunch
cd epunch
```

---

## Phase 2: Production Configuration

### 2.1 Create Production docker-compose.yml

Create `/root/epunch/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: epunch-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - /root/epunch/data/postgres:/var/lib/postgresql/data
      - ./database/ddl/core-schema.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "127.0.0.1:54320:5432"
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U epunch"]
      interval: 30s
      timeout: 10s
      retries: 5

  backend:
    build:
      context: ./application/backend
      dockerfile: Dockerfile
    container_name: epunch-backend
    ports:
      - "127.0.0.1:4000:4000"
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - /root/epunch/uploads:/app/uploads
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/api/v1/hello-world"]
      interval: 30s
      timeout: 10s
      retries: 3

  user-app:
    build:
      context: ./application/user-app
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://api.epunch.app/v1
        VITE_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
        VITE_GOOGLE_REDIRECT_URI: https://epunch.app/auth/callback
    container_name: epunch-user-app
    ports:
      - "127.0.0.1:3001:80"
    restart: always

  merchant-app:
    build:
      context: ./application/merchant-app
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://api.epunch.app/v1
        VITE_USER_APP_URL: https://epunch.app
    container_name: epunch-merchant-app
    ports:
      - "127.0.0.1:3002:80"
    restart: always

  admin-app:
    build:
      context: ./application/admin-app
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://api.epunch.app/v1
    container_name: epunch-admin-app
    ports:
      - "127.0.0.1:3003:80"
    restart: always
```

### 2.2 Create Backend Dockerfile

Create `/root/epunch/application/backend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package.json yarn.lock ./
COPY application/backend/package.json ./application/backend/
COPY application/common-core/package.json ./application/common-core/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY application/common-core ./application/common-core
COPY application/backend ./application/backend

# Build common-core and backend
WORKDIR /app/application/common-core
RUN yarn build

WORKDIR /app/application/backend
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/application/backend/package.json ./application/backend/
COPY --from=builder /app/application/common-core/package.json ./application/common-core/

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built files
COPY --from=builder /app/application/common-core/dist ./application/common-core/dist
COPY --from=builder /app/application/backend/dist ./application/backend/dist

# Create uploads directory
RUN mkdir -p /app/uploads

WORKDIR /app/application/backend

EXPOSE 4000

CMD ["node", "dist/main.js"]
```

### 2.3 Create Frontend Dockerfiles

**User App Dockerfile** (`/root/epunch/application/user-app/Dockerfile`):

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root files
COPY package.json yarn.lock ./
COPY application/user-app/package.json ./application/user-app/
COPY application/common-core/package.json ./application/common-core/
COPY application/common-ui/package.json ./application/common-ui/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY application/common-core ./application/common-core
COPY application/common-ui ./application/common-ui
COPY application/user-app ./application/user-app

# Build dependencies
WORKDIR /app/application/common-core
RUN yarn build

WORKDIR /app/application/common-ui
RUN yarn build

# Build app
WORKDIR /app/application/user-app
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_REDIRECT_URI

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_REDIRECT_URI=$VITE_GOOGLE_REDIRECT_URI

RUN yarn build

# Production stage - nginx
FROM nginx:alpine

COPY --from=builder /app/application/user-app/dist /usr/share/nginx/html

# Nginx config for SPA
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Merchant App & Admin App Dockerfiles**: Same structure, just change the app directory.

### 2.4 Create Production Environment File

Create `/root/epunch/.env.production`:

```env
NODE_ENV=production

APP_PORT=4000
APP_HOST=0.0.0.0
API_PREFIX=v1

# Database Configuration
POSTGRES_USER=epunch
POSTGRES_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
POSTGRES_DB=epunch

DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=epunch
DB_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
DB_DATABASE=epunch
DB_SSL=false

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_REDIRECT_URI=https://epunch.app/auth/callback

# JWT Configuration
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING_MIN_32_CHARS
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOADS_DIRECTORY=/app/uploads
```

**Important:** Update all placeholder values!

---

## Phase 3: Nginx Configuration

### 3.1 Create epunch.conf in kiraistaken-infra

In your kiraistaken-infra repo, create `nginx/sites/epunch.conf`:

```nginx
# User App (main domain)
server {
    listen 80;
    server_name epunch.app www.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name epunch.app www.epunch.app;

    ssl_certificate /etc/letsencrypt/live/epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/epunch.app/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:3001;
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

# Backend API
server {
    listen 80;
    server_name api.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.epunch.app;

    ssl_certificate /etc/letsencrypt/live/api.epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.epunch.app/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # API routes
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # File uploads
    location /uploads/ {
        alias /root/epunch/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Merchant App
server {
    listen 80;
    server_name merchant.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name merchant.epunch.app;

    ssl_certificate /etc/letsencrypt/live/merchant.epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/merchant.epunch.app/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:3002;
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

# Admin App
server {
    listen 80;
    server_name admin.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.epunch.app;

    ssl_certificate /etc/letsencrypt/live/admin.epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.epunch.app/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:3003;
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

### 3.2 Update kiraistaken-infra SSL Script

Update `/root/kiraistaken-infra/scripts/setup-ssl.sh` to include epunch domains:

```bash
#!/bin/bash

set -e

EMAIL="${1:-sobolevchelovek@gmail.com}"

echo "Installing certbot..."
apt update
apt install -y certbot python3-certbot-nginx

echo "Getting SSL certificates for $EMAIL..."

# Existing domains
certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d kiraistaken.lol -d www.kiraistaken.lol

certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d soulmirror.kiraistaken.lol

certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d api.soulmirror.kiraistaken.lol

certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d xchange.kiraistaken.lol

# New epunch domains
certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d epunch.app -d www.epunch.app

certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d api.epunch.app

certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d merchant.epunch.app

certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" \
  -d admin.epunch.app

echo "SSL certificates installed successfully!"
echo "Certificates auto-renew every 90 days via certbot timer"
```

---

## Phase 4: Deployment Scripts

### 4.1 Create Initial Deployment Script

Create `/root/epunch/deploy-initial.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting initial epunch deployment..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /root/epunch/data/postgres
mkdir -p /root/epunch/uploads

# Check environment file
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found!"
    echo "Please create .env.production with all required variables"
    exit 1
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check container status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

# Check backend health
echo "🏥 Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:4000/api/v1/hello-world > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to become healthy"
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi
    echo "Waiting for backend... ($i/30)"
    sleep 2
done

echo "✅ Initial deployment complete!"
echo ""
echo "Next steps:"
echo "1. Update nginx configs in kiraistaken-infra"
echo "2. Get SSL certificates"
echo "3. Deploy nginx configs"
```

### 4.2 Create Update Deployment Script

Create `/root/epunch/deploy-update.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Updating epunch deployment..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull

# Rebuild and restart services
echo "🐳 Rebuilding containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services
echo "⏳ Waiting for services to restart..."
sleep 10

# Check health
echo "🏥 Checking backend health..."
if curl -f http://localhost:4000/api/v1/hello-world > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "❌ Backend health check failed"
    docker-compose -f docker-compose.prod.yml logs --tail=50 backend
    exit 1
fi

echo "✅ Deployment updated successfully!"
```

Make scripts executable:
```bash
chmod +x /root/epunch/deploy-initial.sh
chmod +x /root/epunch/deploy-update.sh
```

---

## Phase 5: Google OAuth Production Setup

### 5.1 Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `https://epunch.app/auth/callback`
   - `https://merchant.epunch.app/auth/callback` (if needed)
   - `https://admin.epunch.app/auth/callback` (if needed)
6. Save changes
7. Update `.env.production` with production Client ID and Secret

---

## Phase 6: Deployment Steps (Execution Order)

### Step 1: Prepare VPS
```bash
ssh root@45.32.117.48

# Clone repo
cd /root
git clone <repo-url> epunch
cd epunch
```

### Step 2: Configure Environment
```bash
# Create .env.production
nano .env.production
# Fill in all values (see Phase 2.4)
```

### Step 3: Initial Deploy
```bash
cd /root/epunch
./deploy-initial.sh
```

### Step 4: Setup SSL Certificates
```bash
cd /root/kiraistaken-infra
git pull  # Get updated epunch.conf
./scripts/setup-ssl.sh
```

### Step 5: Deploy Nginx Config
```bash
cd /root/kiraistaken-infra
./scripts/update-nginx.sh
```

### Step 6: Verify Deployment
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test endpoints
curl https://epunch.app
curl https://api.epunch.app/api/v1/hello-world
curl https://merchant.epunch.app
curl https://admin.epunch.app
```

---

## Phase 7: Monitoring & Maintenance

### 7.1 View Logs
```bash
cd /root/epunch

# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### 7.2 Database Backups

Create `/root/epunch/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups/epunch"

mkdir -p $BACKUP_DIR

# Database backup
docker exec epunch-postgres pg_dump -U epunch epunch \
  > $BACKUP_DIR/db_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_$DATE.sql.gz"
```

Add to crontab:
```bash
chmod +x /root/epunch/backup.sh
crontab -e
# Add: 0 2 * * * /root/epunch/backup.sh
```

### 7.3 Container Management

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml up -d
```

---

## Troubleshooting

### Issue: Containers won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check docker daemon
systemctl status docker

# Restart docker
systemctl restart docker
```

### Issue: Database connection failed
```bash
# Check postgres is running
docker ps | grep postgres

# Check postgres logs
docker logs epunch-postgres

# Connect to postgres manually
docker exec -it epunch-postgres psql -U epunch epunch
```

### Issue: SSL certificate errors
```bash
# Check certificates exist
ls -la /etc/letsencrypt/live/epunch.app/

# Renew certificates
certbot renew

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx
```

### Issue: Port conflicts
```bash
# Check what's using ports
netstat -tulpn | grep 4000
netstat -tulpn | grep 3001

# Kill process if needed
kill -9 <PID>
```

---

## Security Checklist

- [ ] Strong passwords in `.env.production`
- [ ] JWT secret is random and 32+ characters
- [ ] Database port only exposed to localhost (127.0.0.1)
- [ ] Application ports only exposed to localhost
- [ ] SSL certificates configured for all domains
- [ ] Firewall configured (ufw or iptables)
- [ ] Regular backups scheduled
- [ ] Google OAuth production credentials configured
- [ ] File upload directory has correct permissions

---

## Cost Breakdown

### VPS Deployment (Production)
- VPS: $0 (shared with kiraistaken.lol)
- **Total: $0/month**

### AWS Alternative (for comparison)
If this were deployed on AWS instead:
- RDS PostgreSQL: ~$30-50/month
- App Runner: ~$20-30/month
- Amplify (3 apps): ~$15-30/month
- S3: ~$5/month
- ECR: ~$5/month
- Cognito: Free tier or ~$5/month
- **Total: ~$100-120/month**

---

## Next Steps After Deployment

1. **Monitor performance** for first 24-48 hours
2. **Test all features** in production
3. **Setup monitoring** (optional: Prometheus, Grafana)
4. **Configure alerts** for downtime
5. **Document any issues** encountered
6. **Setup regular backups** (see Phase 7.2)

---

## Support

For issues during deployment:
- Check logs: `docker-compose logs`
- Review nginx logs: `/var/log/nginx/error.log`
- Verify DNS: `dig epunch.app`
- Test local connectivity: `curl localhost:4000`
