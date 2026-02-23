# epunch Infrastructure

VPS deployment infrastructure for epunch.app

## Multi-Project VPS Setup

**Important:** This project is deployed to a shared VPS that hosts multiple projects. The infrastructure is split across two repositories:

### 1. This Repository (epunch)
Contains project-specific deployment scripts and configurations:
- Docker compose files
- Environment configuration templates
- Build and deployment scripts

### 2. vps-infra Repository (separate)
**Repository:** `vps-infra` (separate git project)
**Local path:** `/Users/kirillsobolev/Workspace/vps-infra`
**VPS path:** `/root/vps-infra`

Contains shared infrastructure for ALL projects on the VPS:
- **Nginx configurations** for all projects (epunch, soulmirror, xchange, etc.)
- **SSL certificate management** scripts
- **Shared deployment utilities**

**Why separate?** Nginx and SSL management are shared across all projects on the VPS, so they're maintained in a central infrastructure repository.

## Directory Structure

```
infra/
└── vps/
    ├── env/                          # Runtime environment files (gitignored)
    │   ├── backend.env.example       # Backend runtime config
    │   └── postgres.env.example      # PostgreSQL runtime config
    ├── docker/
    │   ├── .env                      # Build-time variables (gitignored)
    │   ├── .env.example              # Build-time variables template
    │   └── docker-compose.prod.yml   # Production docker-compose
    ├── scripts/
    │   ├── local/                    # Run FROM your Mac (SSH to VPS)
    │   │   ├── sync-env.sh           # Copy env files to VPS
    │   │   └── initial-setup.sh      # One-time VPS setup
    │   └── vps/                      # Run ON VPS
    │       ├── initial-setup.sh      # One-time setup (dirs, check env)
    │       ├── build-backend.sh      # Build backend only
    │       ├── build-user-app.sh     # Build user-app only
    │       ├── build-merchant-app.sh # Build merchant-app only
    │       ├── build-admin-app.sh    # Build admin-app only
    │       ├── build-all.sh          # Build all services
    │       ├── restart-backend.sh    # Restart backend only
    │       ├── restart-user-app.sh   # Restart user-app only
    │       ├── restart-merchant-app.sh
    │       ├── restart-admin-app.sh
    │       ├── restart-all.sh        # Restart all services
    │       ├── rebuild-backend.sh    # Build + restart backend
    │       ├── rebuild-user-app.sh   # Build + restart user-app
    │       ├── rebuild-merchant-app.sh
    │       ├── rebuild-admin-app.sh
    │       ├── start-all.sh          # Start all services
    │       ├── stop-all.sh           # Stop all services
    │       └── deploy.sh             # git pull + build + restart
    └── nginx/                        # NOTE: Nginx configs are in vps-infra repo
```

## Initial Setup (One Time)

### 1. Configure Environment Files

There are two types of environment files:

**Runtime environment files** (in `infra/vps/env/`)
- Used by containers at runtime
- Backend and PostgreSQL read these when they start

**Build-time environment files** (in `infra/vps/docker/`)
- Used by Docker Compose when building frontend containers
- Vite embeds these values into the JavaScript bundle

Copy and customize:

```bash
# Runtime config (backend, postgres)
cd infra/vps/env
cp backend.env.example backend.env
cp postgres.env.example postgres.env
nano backend.env      # Update Google OAuth, JWT secret, DB password
nano postgres.env     # Set secure database password (must match backend.env)

# Build-time config (frontend builds)
cd ../docker
cp .env.example .env
nano .env             # Update GOOGLE_CLIENT_ID (must match backend.env)
```

**Important:** `GOOGLE_CLIENT_ID` must be the same in both `env/backend.env` and `docker/.env`

### 2. Clone Repository on VPS

```bash
ssh root@45.32.117.48
cd /root
git clone <your-repo-url> epunch
```

### 3. Copy Environment Files to VPS

From your Mac:
```bash
# Copy runtime configs
scp infra/vps/env/backend.env root@45.32.117.48:/root/epunch/infra/vps/env/
scp infra/vps/env/postgres.env root@45.32.117.48:/root/epunch/infra/vps/env/

# Copy build-time config
scp infra/vps/docker/.env root@45.32.117.48:/root/epunch/infra/vps/docker/
```

Or use the sync script:
```bash
cd infra/vps/scripts/local
./sync-env.sh
```

### 4. Run Initial Setup on VPS

```bash
# Still on VPS
cd /root/epunch/infra/vps/scripts/vps
./initial-setup.sh    # Creates directories, checks env files
./build-all.sh        # Build all containers
./start-all.sh        # Start all services
```

## Daily Workflow

### Typical Workflow: Update Code and Deploy

**On VPS:**
```bash
ssh root@45.32.117.48
cd /root/epunch
git pull
cd infra/vps/scripts/vps
./deploy.sh
```

The `deploy.sh` script will:
1. Pull latest code
2. Build all services
3. Restart all services

### Update Single Service

**Example: Backend only**
```bash
ssh root@45.32.117.48
cd /root/epunch
git pull
cd infra/vps/scripts/vps
./rebuild-backend.sh
```

**Example: User app only**
```bash
ssh root@45.32.117.48
cd /root/epunch
git pull
cd infra/vps/scripts/vps
./rebuild-user-app.sh
```

### Update Environment Variables

**Runtime variables (backend, postgres):**
```bash
# From your Mac:
# 1. Edit env files locally
nano infra/vps/env/backend.env

# 2. Sync to VPS
cd infra/vps/scripts/local
./sync-env.sh

# 3. Restart services on VPS
ssh root@45.32.117.48 'cd /root/epunch/infra/vps/scripts/vps && ./restart-all.sh'
```

**Build-time variables (frontend apps):**
```bash
# From your Mac:
# 1. Edit build config
nano infra/vps/docker/.env

# 2. Sync to VPS
scp infra/vps/docker/.env root@45.32.117.48:/root/epunch/infra/vps/docker/

# 3. Rebuild affected frontends on VPS
ssh root@45.32.117.48 'cd /root/epunch/infra/vps/scripts/vps && ./rebuild-user-app.sh'
```

**Note:** Changing build-time variables requires rebuilding the frontend containers.

## Script Reference

### Local Scripts (Run from Mac)

| Script | Purpose |
|--------|---------|
| `sync-env.sh` | Copy environment files to VPS |

### VPS Scripts (Run on VPS)

#### Build Scripts
| Script | Purpose |
|--------|---------|
| `build-backend.sh` | Build backend container |
| `build-user-app.sh` | Build user-app container |
| `build-merchant-app.sh` | Build merchant-app container |
| `build-admin-app.sh` | Build admin-app container |
| `build-all.sh` | Build all containers (calls individual build scripts) |

#### Restart Scripts
| Script | Purpose |
|--------|---------|
| `restart-backend.sh` | Restart backend container |
| `restart-user-app.sh` | Restart user-app container |
| `restart-merchant-app.sh` | Restart merchant-app container |
| `restart-admin-app.sh` | Restart admin-app container |
| `restart-all.sh` | Restart all containers |

#### Rebuild Scripts (Build + Restart)
| Script | Purpose |
|--------|---------|
| `rebuild-backend.sh` | Build and restart backend |
| `rebuild-user-app.sh` | Build and restart user-app |
| `rebuild-merchant-app.sh` | Build and restart merchant-app |
| `rebuild-admin-app.sh` | Build and restart admin-app |

#### Lifecycle Scripts
| Script | Purpose |
|--------|---------|
| `initial-setup.sh` | One-time setup: create directories, check env files |
| `start-all.sh` | Start all services |
| `stop-all.sh` | Stop all services |
| `deploy.sh` | Full deployment: git pull + build all + restart all |

## Common Commands

### View Logs
```bash
ssh root@45.32.117.48
cd /root/epunch/infra/vps/docker
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f user-app
```

### Check Service Status
```bash
ssh root@45.32.117.48
cd /root/epunch/infra/vps/docker
docker-compose -f docker-compose.prod.yml ps
```

### Access PostgreSQL
```bash
ssh root@45.32.117.48
docker exec -it epunch-postgres psql -U epunch epunch
```

## VPS Details

- **Host**: `root@45.32.117.48`
- **Project Directory**: `/root/epunch`
- **Nginx Configs**: `/root/vps-infra/nginx/sites/epunch.conf` (in separate repo)
- **Domains & Port Mapping**:
  - epunch.app → port 3001 (user-app)
  - api.epunch.app → port 4000 (backend API)
  - merchant.epunch.app → port 3002 (merchant-app)
  - admin.epunch.app → port 3003 (admin-app)
  - PostgreSQL: port 54320 (host) → 5432 (container)

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

## Google OAuth Setup

For production deployment, configure Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://epunch.app/auth/callback`
   - `https://merchant.epunch.app/auth/callback` (if needed)
   - `https://admin.epunch.app/auth/callback` (if needed)
5. Update environment files with production Client ID and Secret

## Nginx Configuration

Nginx configs are managed in the **separate vps-infra repository**:
- **Location**: `/root/vps-infra/nginx/sites/epunch.conf` (on VPS)
- **SSL Setup**: Run `/root/vps-infra/scripts/setup-ssl.sh` to get certificates
- **Deploy Config**: Run `/root/vps-infra/scripts/update-nginx.sh` to apply changes

## Troubleshooting

### Container Issues
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Database Issues
```bash
# Check postgres is running
docker ps | grep postgres

# View postgres logs
docker logs epunch-postgres

# Connect to database
docker exec -it epunch-postgres psql -U epunch epunch
```

### SSL/Nginx Issues
```bash
# Check SSL certificates (on VPS)
ssh root@45.32.117.48 'ls -la /etc/letsencrypt/live/epunch.app/'

# Test nginx config
ssh root@45.32.117.48 'nginx -t'

# Reload nginx
ssh root@45.32.117.48 'systemctl reload nginx'
```

### Port Conflicts
```bash
# Check what's using a port
ssh root@45.32.117.48 'netstat -tulpn | grep 4000'
```
