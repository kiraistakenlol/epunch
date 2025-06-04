# E-PUNCH.io

A simple electronic punch card system.

Users have a personal QR code and digital punch cards for various businesses. Businesses scan the user's QR code to add punches. Accumulated punches lead to rewards.

## Application

### User App

#### Features

1. Personal QR code for quick punch collection
2. View and manage digital punch cards for multiple businesses
4. Track punch progress across different loyalty programs
5 Authentication is not required (user id is generated on the frontend and user is created on the first punch, later on sign up the external_id is linked to this user)
6. Authentication is available via google and email/password
7. Real-time updates via WebSocket connections when punch cards is complete or/and a new punch received
8. Animated punch card interactions and completion flows
9. Development page and api for testing and debugging (`/dev` route and `/api/v1/dev` endpoint) - **restricted to super admin users only** in user-app

#### User Basic Journey

**Visiting "Pottery Cafe"**

1. I walk into "Pottery Cafe" and scan their QR code (or open `epunch.io` manually).
2. I see my personal QR code on `epunch.io` and my list of punch cards.
   * If it's my first time at Pottery Cafe:
     * If I scanned their QR code: I might see a new "Pottery Punch Card" with 0/10 punches right away.
     * If I opened `epunch.io` manually: The "Pottery Punch Card" will appear in my list only *after* the manager scans my QR code for the first time (usually showing 1/10 punches).
   * If I've been here before, I see my existing "Pottery Punch Card" with its current punch count (e.g., n/10).
3. I buy a coffee and show my QR code to the manager.
4. The manager scans my QR code, selects 'Pottery Punch Card' loyalty program, presses "PUNCH".
5. I see my "Pottery Punch Card" on `epunch.io` update with +1 punch.
6. When my card shows 10/10 punches ("Reward Ready!"):
   * I press on the punch card, the QR code changes, now it's linked to the punch card
   * I show the merchant the QR code.
   * Merchant scans the QR code via merchant-app, and sees the REDEEM button and loyalty program description.
   * Merchant presses REDEEM
   * The punch card dissapears from my screen in user-app.
   * Merchant gives me a free coffee.
   * If the loyalty program is active, I automatically get a new punch card that belogs to the same loyalty program with 0/10 punches.

**Visiting a Different Cafe ("Cafe B")**

1. I visit "Cafe B" and scan their QR code (or open `epunch.io`).
2. After buying something and the manager scans my QR code for the first time:
   * I see a new "Cafe B Punch Card" appear in my list on `epunch.io`, starting with 1 punch (or 0).

### Merchant App

#### Features

1. Loyalty program management
2. QR code generation for user onboarding
3. Scanner page that scans a QR code and automatically recognizes if it's user's personal QR code or it belongs to the card that can be redeemed. If user's QR, list of active loyalty programs apperas, once selected i can PUNCH it. If punch card's QR, program's loyalty program's description is shown and a button REDEEEM
4. Merchants can  generate QR codes linking to `https://app.com/?merchant=merchantSlug`. When users scan these codes:
* The app automatically fetches the merchant's active loyalty programs
* Creates punch cards for all programs the user doesn't already have
* Adds new cards to the user's dashboard immediately
* Cleans the URL to show just the main app

This enables seamless onboarding without requiring users to manually search for or enroll in loyalty programs.

### Admin App

#### Features

1. Merchant creation and management
2. System configuration and monitoring
3. Global analytics and reporting
4. User permission management
5. Section for quick merchant onboarding that creates merchant and default loyaolty programs (used for sales mostly)

## Live Applications

1. **User App:** [https://narrow-ai-epunch.vercel.app](https://narrow-ai-epunch.vercel.app)
2. **Merchant App:** [https://narrow-ai-epunch-merchant.vercel.app](https://narrow-ai-epunch-merchant.vercel.app)
3. **Admin App:** [https://narrow-ai-epunch-admin.vercel.app](https://narrow-ai-epunch-admin.vercel.app)

## Core Entities

1.  **User:** The customer. Can optionally be a super admin with access to development tools.
2.  **Admin User:** System administrators with varying permission levels (staff, manager, super admin).
3.  **Merchant:** The business offering loyalty programs.
4.  **Loyalty Program:** Defines the rules and reward for a specific merchant offer (e.g., "10 punches for a free coffee").
5.  **Punch Card:** Tracks a specific user's progress in a loyalty program.
6.  **Punch:** A single punch event.

## Technical Implementation

### Tech Stack
* **User App (Frontend):** React, TypeScript, Vite, Redux
* **Merchant App (Frontend):** React, TypeScript, Vite, Redux, Material UI
* **Admin App (Frontend):** React, TypeScript, Vite, Redux, Material UI
* **Backend:** NestJS (Node.js framework), TypeScript, PostgreSQL client (pg)
* **Database:** PostgreSQL (via Supabase as database host)
* **Real-time Communication:** WebSocket (Socket.io) for live updates
* **Package Manager:** Yarn
* **UI Framework:** Bootstrap 5 with React Bootstrap components and Bootstrap Icons (bundled in common-ui package)

### Infrastructure & Deployment
* **Frontend Hosting:** Vercel (for User, Merchant, and Admin apps)
* **Backend Hosting:** Fly.io (Dockerized NestJS app)
* **Database:** Supabase (PostgreSQL hosting only)
* **Authentication:** AWS Cognito User Pool (deployed via Terraform)
* **Configuration:** All config (including API endpoints, host, port) is centralized and managed via environment variables and `.env` files
* **Secrets:** Store all secrets in `.env` in the corresponding app directory (user-app, merchant-app ...)
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

##2 Development

### Development Scripts

The project includes several convenience scripts for development:

* `./run-user-app.sh` - Builds common packages and starts user app development server
* `./run-merchant-app.sh` - Builds common packages and starts merchant app development server
* `./run-admin-app.sh` - Builds common packages and starts admin app development server
* `./run-backend.sh` - Starts backend development server
* `./build-common.sh` - Builds common-core and common-ui packages
* `./build-all.sh` - Builds all packages in the workspace
* `./reinstall-all.sh` - Reinstalls all dependencies across the workspace
* `./deploy-backend.sh` - Deploys backend to Fly.io
* `./backend-logs.sh` - Views backend logs from Fly.io

### Project Structure

```
# Root Level
├── application/              # Main application code
├── infra/                   # Infrastructure and deployment configurations
│   ├── backend/            # Backend infrastructure
│   │   ├── docker/        # Docker configurations
│   │   │   ├── Dockerfile     # Backend Docker image definition
│   │   │   └── run-docker-local.sh # Script to run locally with Docker
│   │   └── fly/           # Fly.io deployment configurations
│   │       ├── fly.toml     # Fly.io configuration
│   │       ├── .env.dev     # Environment variables for deployment
│   │       ├── deploy.sh    # One-step deployment script
│   │       └── set-fly-secrets.sh # Script for setting Fly.io secrets
│   ├── frontend/          # Frontend infrastructure
│   │   └── vercel/       # Vercel deployment configurations
│   └── terraform/         # Terraform IaC configurations
│       └── env/
│           └── dev/        # Development environment
│               ├── main.tf  # Cognito User Pool configuration
│               ├── variables.tf # Input variables
│               ├── outputs.tf # Output values for frontend
│               ├── deploy.sh # Automated deployment script
│               └── README.md # Deployment instructions
├── database/                # Database schema and local development setup
│   ├── ddl/               # Database schema definitions
│   │   └── initial_ddl.sql   # Initial database schema
│   └── docker-compose.yml    # Local PostgreSQL development setup
├── docs/                    # Additional documentation
│   └── pitch.md             # Project pitch documentation
├── ANIMATION_FLOW.md        # Animation system documentation
├── progress-log.md          # Development progress tracking
├── run-user-app.sh          # User app development script
├── run-merchant-app.sh      # Merchant app development script
├── run-admin-app.sh         # Admin app development script
├── run-backend.sh           # Backend development script
├── build-common.sh          # Common packages build script
├── build-all.sh             # Build all packages script
├── reinstall-all.sh         # Reinstall all dependencies script
├── deploy-backend.sh        # Backend deployment script
└── backend-logs.sh          # Backend logs viewing script

The application code resides within the `application/` directory and is structured as a multi-module TypeScript project:

application/
├── backend/                 # NestJS backend code
├── user-app/               # React user-app code
│   ├── src/
│   │   ├── features/       # Feature-based modules
│   │   │   ├── dashboard/  # Main dashboard functionality
│   │   │   │   ├── overlay/
│   │   │   │   │   ├── CompletionOverlay.tsx
│   │   │   │   │   ├── CompletionOverlay.module.css
│   │   │   │   │   └── completionOverlaySlice.ts
│   │   │   │   ├── punch-cards/
│   │   │   │   │   ├── punch-card/
│   │   │   │   │   │   ├── front/
│   │   │   │   │   │   │   ├── header/
│   │   │   │   │   │   │   │   ├── PunchCardFrontHeader.tsx
│   │   │   │   │   │   │   │   └── PunchCardFrontHeader.module.css
│   │   │   │   │   │   │   ├── body/
│   │   │   │   │   │   │   │   ├── PunchCardFrontBody.tsx
│   │   │   │   │   │   │   │   ├── PunchCardFrontBody.module.css
│   │   │   │   │   │   │   │   ├── PunchCardFrontBodyPunchesSection.tsx
│   │   │   │   │   │   │   │   └── PunchCardFrontBodyPunchesSection.module.css
│   │   │   │   │   │   │   ├── footer/
│   │   │   │   │   │   │   │   ├── PunchCardFrontFooter.tsx
│   │   │   │   │   │   │   │   └── PunchCardFrontFooter.module.css
│   │   │   │   │   │   │   ├── PunchCardFront.tsx
│   │   │   │   │   │   │   └── PunchCardFront.module.css
│   │   │   │   │   │   ├── back/
│   │   │   │   │   │   │   ├── PunchCardBack.tsx
│   │   │   │   │   │   │   └── PunchCardBack.module.css
│   │   │   │   │   │   ├── PunchCardItem.tsx
│   │   │   │   │   │   ├── PunchCardItem.module.css
│   │   │   │   │   │   ├── PunchCardOverlay.tsx
│   │   │   │   │   │   └── PunchCardOverlay.module.css
│   │   │   │   │   ├── PunchCards.tsx
│   │   │   │   │   └── PunchCards.module.css
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   └── DashboardPage.module.css
│   │   │   ├── animations/  # Animation system
│   │   │   │   ├── animationSteps.ts
│   │   │   │   ├── animationSlice.ts
│   │   │   │   └── useAnimationExecutor.ts
│   │   │   ├── auth/        # Authentication features
│   │   │   │   ├── AuthContainer.tsx
│   │   │   │   ├── AuthButtons.tsx
│   │   │   │   ├── AuthModal.tsx
│   │   │   │   ├── EmailAuthForm.tsx
│   │   │   │   └── authSlice.ts
│   │   │   ├── alert/       # Global alert system
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── Alert.module.css
│   │   │   │   └── alertSlice.ts
│   │   │   ├── qrCode/      # QR code display
│   │   │   │   └── QRCode.tsx
│   │   │   ├── loyaltyPrograms/ # Loyalty program management
│   │   │   ├── punchCards/  # Punch card functionality
│   │   │   ├── signOut/     # Sign out functionality
│   │   │   └── dev/         # Development utilities
│   │   ├── components/     # Shared components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AppHeader.tsx
│   │   │   ├── SignOutModal.tsx
│   │   │   └── EPunchModal.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useMerchantOnboarding.ts
│   │   │   ├── useWebSocketEventHandler.ts
│   │   │   ├── useConsoleCapture.ts
│   │   │   └── useWebSocket.ts
│   │   ├── store/          # Redux store configuration
│   │   │   ├── store.ts
│   │   │   ├── rootReducer.ts
│   │   │   └── hooks.ts
│   │   ├── config/         # App configuration
│   │   │   ├── amplify.ts
│   │   │   └── env.ts
│   │   ├── api/            # API clients
│   │   │   └── websocketClient.ts
│   │   ├── styles/         # Global styles
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── global.d.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.mts
│   ├── vercel.json
│   └── index.html
├── merchant-app/           # React merchant-app code
├── admin-app/              # React admin-app code
├── common-core/            # Shared core types, DTOs, constants (no React dependencies)
└── common-ui/              # Shared API client and styles (no UI components)
```

* `common-core/` contains shared TypeScript types, DTOs, and constants used by all applications.
* `common-ui/` contains shared API client and bundled CSS (Bootstrap + Bootstrap Icons + mobile-first base styles).