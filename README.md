# E-PUNCH.io

## Live Applications

* **User App:** [https://narrow-ai-epunch.vercel.app](https://narrow-ai-epunch.vercel.app)
* **Merchant App:** [https://narrow-ai-epunch-merchant.vercel.app](https://narrow-ai-epunch-merchant.vercel.app)
* **Admin App:** [https://narrow-ai-epunch-admin.vercel.app](https://narrow-ai-epunch-admin.vercel.app)

A simple electronic punch card system.

Users have a personal QR code and digital punch cards for various businesses. Businesses scan the user's QR code to add punches. Accumulated punches lead to rewards.

<img src="image.png" alt="E-PUNCH.io System Overview" width="400" />

## Features

* View and manage digital punch cards for multiple businesses
* Use without authentication (with a warning about potential data loss)
* Personal QR code for quick punch collection
* Track punch progress across different loyalty programs
* Automatic reward notifications when punch cards are complete
* Real-time updates via WebSocket connections
* Animated punch card interactions and completion flows
* Development mode for testing and debugging (`/dev` route and `/api/v1/dev` endpoint) - **restricted to super admin users only**

## Planning

See the detailed project planning document: [Planning Doc](https://docs.google.com/document/d/1aP9CDDbN2PSN6AypOyp7pGCODV2ZQdApm9iQcMuSTGI/edit?tab=t.0#heading=h.bmch098gxbif)

## Development

### Development Scripts

The project includes several convenience scripts for development:

* `./run-user-app.sh` - Builds common packages and starts user app development server
* `./run-merchant-app.sh` - Builds common packages and starts merchant app development server  
* `./run-backend.sh` - Starts backend development server
* `./build-common.sh` - Builds common-core and common-ui packages
* `./build-all.sh` - Builds all packages in the workspace
* `./reinstall-all.sh` - Reinstalls all dependencies across the workspace
* `./deploy-backend.sh` - Deploys backend to Fly.io
* `./backend-logs.sh` - Views backend logs from Fly.io

## User Journey

### Visiting "Pottery Cafe"

1.  I walk into "Pottery Cafe" and scan their QR code (or open `epunch.io` manually).
2.  I see my personal QR code on `epunch.io` and my list of punch cards.
    *   If it's my first time at Pottery Cafe:
        *   If I scanned their QR code: I might see a new "Pottery Punch Card" with 0/10 punches right away.
        *   If I opened `epunch.io` manually: The "Pottery Punch Card" will appear in my list only *after* the manager scans my QR code for the first time (usually showing 1/10 punches).
    *   If I've been here before, I see my existing "Pottery Punch Card" with its current punch count (e.g., n/10).
3.  I buy a coffee and show my QR code to the manager.
4.  The manager scans my QR code.
5.  I see my "Pottery Punch Card" on `epunch.io` update with +1 punch.
6.  When my card shows 10/10 punches ("Reward Ready!"):
    *   I tell the manager I want my free coffee and show my QR code.
    *   The manager scans it.
    *   I get my free coffee.
    *   I see my "Pottery Punch Card" reset to 0/10 punches on `epunch.io`.
    *   I see a note like "1 free coffee redeemed" for Pottery Cafe.

### Visiting a Different Cafe ("Cafe B")

1.  I visit "Cafe B" and scan their QR code (or open `epunch.io`).
2.  After buying something and the manager scans my QR code for the first time:
    *   I see a new "Cafe B Punch Card" appear in my list on `epunch.io`, starting with 1 punch (or 0).

### QR Code Onboarding

Merchants can generate QR codes linking to `https://app.com/?merchant=merchantSlug`. When users scan these codes:

1. The app automatically fetches the merchant's active loyalty programs
2. Creates punch cards for all programs the user doesn't already have
3. Adds new cards to the user's dashboard immediately
4. Cleans the URL to show just the main app

This enables seamless onboarding without requiring users to manually search for or enroll in loyalty programs.

## Merchant Journey

TODO

## Core Entities

1.  **User:** The customer. Can optionally be a super admin with access to development tools.
2.  **Merchant:** The business offering loyalty programs.
3.  **Loyalty Program:** Defines the rules and reward for a specific merchant offer (e.g., "10 punches for a free coffee").
4.  **Punch Card:** Tracks a specific user's progress in a loyalty program.
5.  **Punch:** A single punch event.

## Technical Implementation

### Tech Stack
* **User App (Frontend):** React, TypeScript, Vite, Redux (for state management)
* **Merchant App (Frontend):** React, TypeScript, Vite, Redux (for state management), Material UI (for components)
* **Backend:** NestJS (Node.js framework), TypeScript, PostgreSQL client (pg)
* **Database:** PostgreSQL (via Supabase as database host)
* **Real-time Communication:** WebSocket (Socket.io) for live updates
* **Package Manager:** Yarn (all shared dev dependencies, e.g., typescript, are kept in the root package.json for the workspace)
* **UI Framework:** Bootstrap 5 with React Bootstrap components and Bootstrap Icons (bundled in common-ui package)

**Note:** This project uses Yarn as the package manager, not npm. Always use `yarn add` instead of `npm install` when adding dependencies.

### Infrastructure & Deployment
* **Frontend Hosting:** Vercel (for both User and Merchant apps)
* **Backend Hosting:** Fly.io (Dockerized NestJS app)
* **Database:** Supabase (PostgreSQL hosting only)
* **Authentication:** AWS Cognito User Pool (deployed via Terraform)
* **Configuration:** All config (including API endpoints, host, port) is centralized and managed via environment variables and `.env` files
* **Secrets:** Store all secrets in `.env`
* **Infrastructure Files:** All infrastructure configurations are stored in the `infra/` directory:
  * `infra/backend/` - Backend deployment configurations (Docker, Fly.io)
  * `infra/frontend/` - Frontend deployment configurations (Vercel)
  * `infra/terraform/` - Terraform configurations for AWS Cognito

### Real-time Features

The application uses WebSocket connections for real-time updates:

* **Live punch updates:** Users see punch additions immediately without page refresh
* **Card completion notifications:** Real-time alerts when cards are completed
* **Reward redemption updates:** Instant feedback when rewards are claimed
* **Animation system:** Coordinated animations for punch additions and card completions

### Animation System

The application includes a sophisticated animation system for enhanced user experience:

* **Sequence-based animations:** Complex animation flows defined as step sequences
* **Event-driven progression:** Animations can wait for user interactions
* **Global components:** Alerts and overlays work across the entire application
* **State management:** Separate Redux slices for animation execution and UI state

See `ANIMATION_FLOW.md` for detailed documentation of the animation architecture.

### Development Mode

The application includes a development mode accessible at `/dev` route and `/api/v1/dev` endpoint. This mode provides development utilities for:

* Testing database connections
* Generating test data
* Viewing system state
* Debugging features

**Access Control:** Development mode is restricted to authenticated users with super admin privileges. The dev link only appears in the app header for super admin users.

Development application is available at: https://narrow-ai-epunch.vercel.app/dev

This mode is disabled in production environments through environment configuration.

### Super Admin System

The application includes a super admin role for privileged users:

**Database Schema:**
- `super_admin` boolean column in the user table (default: false)

**Features:**
- Access to development mode (`/dev` route)
- Enhanced debugging capabilities
- Admin-only features in the user interface

**Implementation:**
- Backend tracks super admin status in user entity
- Frontend Redux state manages super admin flag
- UI components conditionally render based on super admin status

### Deployment Scripts

The project includes several scripts to simplify deployment:

#### Backend Local Development with Docker

To run the backend locally using Docker:
```bash
./infra/backend/docker/run-docker-local.sh
```

#### Backend Deployment to Fly.io

The backend includes automated deployment scripts:

1. **One-Step Deployment** (`deploy.sh`):
   ```bash
   cd infra/backend/fly
   ./deploy.sh
   ```
   This script handles creating the app, setting secrets, and deploying in one command.

2. **Setting Environment Secrets** (`set-fly-secrets.sh`):
   ```bash
   cd infra/backend/fly
   ./set-fly-secrets.sh
   ```
   This reads environment variables from `.env.dev` and sets them as Fly.io secrets.

3. **Manual Deployment**:
   ```bash
   cd infra/backend/fly
   fly deploy -c fly.toml
   ```

4. **Viewing Logs**:
   ```bash
   # View recent logs
   fly logs -a e-punch-backend
   
   # Stream logs in real-time
   fly logs -a e-punch-backend -f
   
   # View limited number of log lines
   fly logs -a e-punch-backend --lines 100
   ```

#### AWS Cognito Deployment (Authentication)

Minimalistic Terraform setup for AWS Cognito User Pool with email authentication:

1. **Deploy Cognito User Pool:**
   ```bash
   cd terraform/env/dev
   ./deploy.sh
   ```

2. **Configure environment variables:**
   ```bash
   # Get the output values and copy to frontend .env
   terraform output -json environment_variables
   ```

### Project Structure

The application code resides within the `application/` directory and is structured as a multi-module TypeScript project:

```
# Root Level
├── application/              # Main application code
├── infra/                   # Infrastructure and deployment configurations
├── database/                # Database schema and local development setup
├── docs/                    # Additional documentation
├── ANIMATION_FLOW.md        # Animation system documentation
├── progress-log.md          # Development progress tracking
├── run-user-app.sh          # User app development script
├── run-merchant-app.sh      # Merchant app development script
├── run-backend.sh           # Backend development script
├── build-common.sh          # Common packages build script
├── build-all.sh             # Build all packages script
├── reinstall-all.sh         # Reinstall all dependencies script
├── deploy-backend.sh        # Backend deployment script
└── backend-logs.sh          # Backend logs viewing script

application/
├── backend/                 # NestJS backend code
├── user-app/               # React user-app code
├── merchant-app/           # React merchant-app code
├── common-core/            # Shared core types, DTOs, constants (no React dependencies)
└── common-ui/              # Shared API client and styles (no UI components)

infra/
├── backend/                # Backend infrastructure
│   ├── docker/            # Docker configurations
│   │   ├── Dockerfile     # Backend Docker image definition
│   │   └── run-docker-local.sh # Script to run locally with Docker
│   └── fly/               # Fly.io deployment configurations
│       ├── fly.toml       # Fly.io configuration
│       ├── .env.dev       # Environment variables for deployment
│       ├── deploy.sh      # One-step deployment script
│       └── set-fly-secrets.sh # Script for setting Fly.io secrets
├── frontend/              # Frontend infrastructure
│   └── vercel/           # Vercel deployment configurations
└── terraform/            # Terraform IaC configurations
    └── env/
        └── dev/          # Development environment
            ├── main.tf   # Cognito User Pool configuration
            ├── variables.tf # Input variables
            ├── outputs.tf # Output values for frontend
            ├── deploy.sh # Automated deployment script
            └── README.md # Deployment instructions

database/
├── ddl/                  # Database schema definitions
│   └── initial_ddl.sql   # Initial database schema
└── docker-compose.yml    # Local PostgreSQL development setup

docs/
└── pitch.md             # Project pitch documentation
```

* `common-core/` contains shared TypeScript types, DTOs, and constants used by all applications.
* `common-ui/` contains shared API client and bundled CSS (Bootstrap + Bootstrap Icons + mobile-first base styles). UI components have been moved to app-specific locations.
* `backend/`