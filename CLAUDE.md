# CLAUDE.md

## v2 — What we're building

v1 failed because onboarding each business required too much manual effort. v2 makes it fully self-serve — a cafe owner signs up and has a working punch card system in minutes, zero involvement from us.

### Key decisions

- **Scope**: punch cards only. No bundles, benefit cards, animations, or unnecessary features
- **Customer accounts**: not required, guests can use the system
- **How punching works**:
  - Customer scans merchant's QR on the counter → gets an empty card
  - Merchant scans customer's QR → gives a punch (card created automatically)
- **Backend**: reuse v1 backend, audit and simplify, fix/remove Cognito auth
- **Frontend**: rebuild from scratch, separate customer and merchant apps, dead simple
- **30-day free trial** for new merchants

### Plan

1. Define the minimal MVP — all core scenarios for customers and merchants
2. Audit v1 backend — what to keep, simplify, or remove (especially auth)
3. Design the simplest merchant onboarding flow
4. Build real HTML pages for the UI (doubles as working code)
5. Take screenshots of pages for paper ads
6. Design and print paper ads with QR to landing/signup page
7. Walk into cafes, hand out ads, talk to owners

## Infrastructure

### VPS

- **IP**: 45.32.117.48
- **SSH**: `ssh root@45.32.117.48`
- **Domain**: epunch.app (Namecheap DNS)

### Domains & ports

| Domain | What | Port |
|--------|------|------|
| epunch.app | Landing page (static HTML) | — |
| api.epunch.app | Backend API | 4000 |
| merchant.epunch.app | Merchant app | 3004 |
| admin.epunch.app | Admin app | 3003 |

### Two repos manage infra

**This repo (epunch)** — project-specific deployment: Docker compose, env templates, build/deploy scripts. See `infra/README.md` for full details.

**vps-infra repo** (`/Users/kirillsobolev/Workspace/vps-infra`) — shared VPS infrastructure for all projects. Nginx configs, SSL, static files. Deployed to `/root/vps-infra` on VPS.

- Epunch nginx config: `vps-infra/projects/epunch/nginx.conf`
- Landing page source: `vps-infra/projects/epunch/landing-page.html`
- Landing page served from: `/var/www/epunch/` on VPS

### Deploying the landing page

1. Edit `vps-infra/projects/epunch/landing-page.html` (also keep `v2/designs/landing.html` in sync)
2. Commit and push vps-infra
3. On VPS: `cd /root/vps-infra && git pull && cp projects/epunch/landing-page.html /var/www/epunch/`

Or from local Mac in one shot:
```bash
cd /Users/kirillsobolev/Workspace/vps-infra
git add -A && git commit -m "update" && git push
ssh root@45.32.117.48 'cd /root/vps-infra && git pull && cp projects/epunch/landing-page.html /var/www/epunch/'
```

### Deploying nginx config changes

```bash
cd /Users/kirillsobolev/Workspace/vps-infra
# edit projects/epunch/nginx.conf
git add -A && git commit -m "update" && git push
ssh root@45.32.117.48 'cd /root/vps-infra && git pull && ./scripts/vps/apply-nginx-configs.sh'
```

### SSL

Certs already exist for epunch.app, api.epunch.app, merchant.epunch.app, admin.epunch.app. To regenerate or add new ones:
```bash
./scripts/local/setup-new-project-ssl.sh epunch.app api.epunch.app
```

## v1 reference (tagged `v1-final`)

### Development commands

- `./build-common.sh` - Build common-core and common-ui packages
- `./build-all.sh` - Build all packages
- `./run-backend.sh` - Start NestJS backend
- `./run-user-app.sh` - Start user app
- `./run-merchant-app.sh` - Start merchant app
- `./run-admin-app.sh` - Start admin app
- `./reinstall-all.sh` - Reinstall all dependencies

### Architecture

Monorepo: `application/backend`, `user-app`, `merchant-app`, `admin-app`, `common-core`, `common-ui`

- **Backend**: NestJS, PostgreSQL, WebSocket (Socket.io), JWT auth
- **Frontend**: React 18, TypeScript, Vite, Redux Toolkit
- **Database**: PostgreSQL, schema in `database/ddl/core-schema.sql`
- **Deployment**: Docker, GitHub Actions, Nginx reverse proxy

### Backend modules (`src/features/`)

auth, admin, merchant, loyalty, punch-cards, bundle-program, bundle, benefit-card, analytics, user, icons

### Code style

- No code comments
- Remove code instead of commenting out
- Concise and minimalistic
- TypeScript strict mode
- Feature-based organization
