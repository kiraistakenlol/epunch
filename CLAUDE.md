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
