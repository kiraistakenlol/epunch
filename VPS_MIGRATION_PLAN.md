# VPS Migration Plan for epunch

## Current VPS Architecture Pattern

**From kiraistaken-infra & soul-mirror:**
- Single VPS with nginx routing requests based on domain/subdomain
- Each project in `/root/{projectname}` with docker-compose
- Nginx configs in `/root/kiraistaken-infra/nginx/sites/*.conf`
- SSL via Let's Encrypt (separate cert per domain/subdomain)
- Projects use separate services (postgres, backend, frontend) via docker-compose
- Frontend/backend on different ports, nginx proxies requests

**Example (soul-mirror):**
- `soulmirror.kiraistaken.lol` → port 3000 (frontend)
- `api.soulmirror.kiraistaken.lol` → port 8080 (backend API)
- Docker compose with postgres on 5433, backend on 8080, frontend on 3000

## epunch AWS Dependencies

**Current dependencies:**
1. **AWS Cognito** - User auth with Google OAuth (`aws-amplify` in frontend, `@aws-sdk/client-cognito-identity-provider` in backend)
2. **AWS S3** - File storage for merchant icons/images (`@aws-sdk/client-s3`)
3. **AWS RDS PostgreSQL** - Database (`epunch-dev-database.cajeg06ws3hx.us-east-1.rds.amazonaws.com`)
4. **AWS Amplify** - Frontend hosting (implied from aws-amplify package)

## Key Differences from SINGLE_DOCKER_DEPLOYMENT_PLAN.md

Your deployment plan suggests a single monolithic container, but your actual VPS pattern uses:
- **Separate services** via docker-compose (not one container with everything)
- **Host-level nginx** (not nginx inside container)
- **Standard docker networking** between services

## Domain Question: YES!

You can absolutely point `epunch.app` to the same VPS and route both domains via the same nginx:

```nginx
# In /etc/nginx/sites-available/
# Can handle both kiraistaken.lol and epunch.app
server {
    listen 443 ssl;
    server_name epunch.app www.epunch.app;
    # ... epunch routes
}

server {
    listen 443 ssl;
    server_name kiraistaken.lol;
    # ... kiraistaken routes
}
```

## Migration Architecture

### Directory Structure
```
/root/epunch/
├── docker-compose.yml
├── .env
└── (project files)

nginx routes:
- epunch.app → frontend (port 3001)
- api.epunch.app → backend (port 4000)
- Optional: merchant.epunch.app, admin.epunch.app
```

### Port Allocation (avoiding conflicts with soul-mirror)
- **Postgres**: 5434 (soul-mirror uses 5433)
- **Backend**: 4000
- **User App**: 3001
- **Merchant App**: 3002
- **Admin App**: 3003

## Phase 1: Code Changes - Remove AWS Dependencies

### 1. Remove AWS Cognito → Custom Google OAuth

**Backend Changes:**
- Remove `@aws-sdk/client-cognito-identity-provider` dependency
- Implement direct Google OAuth flow
- Generate custom JWT tokens
- Update auth middleware to validate custom JWT instead of Cognito tokens

**Frontend Changes:**
- Remove `aws-amplify` from user-app package.json
- Implement direct Google OAuth redirect flow
- Update auth slice to work with custom JWT

### 2. Remove AWS S3 → Local File Storage

**Backend Changes:**
- Replace `FileUploadService` to use local filesystem
- Store files in `/app/uploads` (will be mounted as docker volume)
- Return local URLs instead of S3 URLs

**API Changes:**
- Update file upload endpoints to handle direct uploads instead of presigned URLs

### 3. Database → PostgreSQL in Docker Compose

- Add postgres service to docker-compose.yml
- Update backend connection to use `postgres:5432` (docker network)
- Schema initialization via init script

### 4. Frontend Builds → Serve via Nginx

- All 3 React apps build to static files
- Each runs in separate docker container with simple HTTP server
- Host nginx proxies to each container

## Phase 2: Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: epunch
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: epunch
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/ddl/core-schema.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5434:5432"
    restart: unless-stopped

  backend:
    build: ./application/backend
    ports:
      - "4000:4000"
    env_file:
      - .env
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
    depends_on:
      - postgres
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped

  user-app:
    build:
      context: ./application/user-app
      args:
        VITE_API_URL: https://api.epunch.app
    ports:
      - "3001:3000"
    restart: unless-stopped

  merchant-app:
    build:
      context: ./application/merchant-app
      args:
        VITE_API_URL: https://api.epunch.app
    ports:
      - "3002:3000"
    restart: unless-stopped

  admin-app:
    build:
      context: ./application/admin-app
      args:
        VITE_API_URL: https://api.epunch.app
    ports:
      - "3003:3000"
    restart: unless-stopped

volumes:
  postgres_data:
  uploads:
```

### Environment Variables

**.env for docker-compose:**
```env
# Database
DB_PASSWORD=secure_password_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://epunch.app/auth/callback

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars

# Application
NODE_ENV=production
APP_PORT=4000
APP_HOST=0.0.0.0
```

## Phase 3: Nginx Configuration

### /root/kiraistaken-infra/nginx/sites/epunch.conf
```nginx
# User app (main)
server {
    listen 80;
    server_name epunch.app www.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name epunch.app www.epunch.app;

    ssl_certificate /etc/letsencrypt/live/epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/epunch.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
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
    listen 443 ssl;
    server_name api.epunch.app;

    ssl_certificate /etc/letsencrypt/live/api.epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.epunch.app/privkey.pem;

    # API routes
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # File uploads
    location /uploads/ {
        alias /root/epunch/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Merchant app
server {
    listen 80;
    server_name merchant.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name merchant.epunch.app;

    ssl_certificate /etc/letsencrypt/live/merchant.epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/merchant.epunch.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin app
server {
    listen 80;
    server_name admin.epunch.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.epunch.app;

    ssl_certificate /etc/letsencrypt/live/admin.epunch.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.epunch.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Phase 4: DNS & SSL Setup

### DNS Configuration
Point these A records to VPS IP:
- `epunch.app` → VPS IP
- `*.epunch.app` → VPS IP

### SSL Certificates
```bash
certbot certonly --nginx --non-interactive --agree-tos --email your@email.com \
  -d epunch.app -d www.epunch.app \
  -d api.epunch.app \
  -d merchant.epunch.app \
  -d admin.epunch.app
```

## Phase 5: Deployment Process

### 1. Initial Setup on VPS
```bash
cd /root
git clone <epunch-repo> epunch
cd epunch
cp .env.example .env
# Edit .env with production values
```

### 2. Build and Start Services
```bash
docker-compose up -d --build
```

### 3. Deploy Nginx Configuration
```bash
cd /root/kiraistaken-infra
git pull
./scripts/update-nginx.sh
```

### 4. Data Migration (from AWS RDS)
```bash
# Export from AWS RDS
pg_dump -h epunch-dev-database.cajeg06ws3hx.us-east-1.rds.amazonaws.com \
  -U epunch_dev -d epunch_dev > backup.sql

# Import to new database
docker exec -i epunch_postgres_1 psql -U epunch epunch < backup.sql

# Migrate S3 files to local storage
aws s3 sync s3://epunch-dev-merchant-files /root/epunch/uploads/
```

## Timeline Estimate

### Week 1-2: Remove AWS Dependencies (Local Development)
- [ ] Remove AWS Cognito, implement custom Google OAuth
- [ ] Remove S3, implement local file storage
- [ ] Update database connection for local postgres
- [ ] Test all functionality locally

### Week 3: Docker Setup & Testing
- [ ] Create Dockerfiles for all services
- [ ] Create docker-compose.yml
- [ ] Test complete stack with docker-compose locally

### Week 4: VPS Deployment
- [ ] Setup DNS for epunch.app
- [ ] Deploy to VPS
- [ ] Get SSL certificates
- [ ] Migrate data from AWS
- [ ] Test production deployment

## Cost Comparison

- **Current AWS**: ~$100+/month (RDS, Amplify, S3, Cognito, App Runner, ECR)
- **VPS Addition**: $0 (using existing VPS)
- **Total Savings**: ~$100/month

## Benefits

1. **Cost Savings**: Eliminate all AWS charges
2. **Simplicity**: No vendor-specific services
3. **Control**: Full access to all services and data
4. **Portability**: Can move to any VPS provider
5. **Consistency**: Same deployment pattern as other projects
