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

1. **Loyalty Program Management**
   - Create, edit, and manage loyalty programs
   - Track program performance and analytics
   - Configure punch requirements and rewards

2. **QR Code Scanner System**
   - Advanced camera-based QR code scanning
   - Automatic recognition of user QR codes vs. punch card QR codes
   - For user QR codes: Display active loyalty programs, select and punch
   - For punch card QR codes: Show program description with redeem button

3. **Customer Onboarding**
   - Generate QR codes linking to `https://app.com/?merchant=merchantSlug`
   - Automatic loyalty program enrollment for new users
   - Seamless onboarding without manual program search

4. **Design Customization**
   - Color theme editor with live preview
   - Logo and icon customization
   - Brand-specific punch card styling
   - File upload for custom graphics

5. **Role-Based Access Control**
   - Admin access: Full dashboard, analytics, program management
   - Staff access: Scanner functionality only
   - Secure authentication with JWT tokens

6. **Analytics Dashboard**
   - Real-time statistics and performance metrics
   - Customer engagement tracking
   - Program effectiveness analysis

#### Architecture & Tech Stack

**Modern Component Architecture**
- **shadcn/ui + Tailwind CSS**: Complete migration from Material-UI
- **Radix UI Primitives**: Accessible, unstyled components as foundation
- **React Hook Form + Zod**: Type-safe form handling with validation
- **TanStack React Table**: Advanced data table functionality
- **Redux Toolkit**: Predictable state management

**Design System**
- **Component Library**: 23+ shadcn/ui components in `/components/ui/`
- **Shared Components**: Reusable business logic in `/components/shared/`
- **CSS Variables**: Consistent theming with CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Dark/Light Themes**: Complete theme switching support

**Feature-Based Architecture**
```
src/
├── features/           # Feature-specific code
│   ├── auth/          # Authentication & login
│   ├── dashboard/     # Analytics & overview
│   ├── scanner/       # QR code scanning
│   ├── loyalty-programs/ # Program management
│   ├── design/        # Customization tools
│   └── onboarding/    # Merchant landing pages
├── components/
│   ├── ui/           # shadcn/ui components
│   └── shared/       # Reusable components
└── lib/              # Utilities & helpers
```

**Code Quality Standards**
- **TypeScript**: Full type safety across the application
- **Utility-First CSS**: Tailwind CSS with semantic class composition
- **Component Composition**: Prefer composition over inheritance
- **Accessibility**: WCAG compliant with Radix UI primitives
- **Performance**: Optimized builds with Vite and code splitting

### Admin App

#### Features

1. Merchant creation and management
2. System configuration and monitoring
3. Global analytics and reporting
4. User permission management
5. Section for quick merchant onboarding that creates merchant and default loyaolty programs (used for sales mostly)

## Live Applications

**🚀 Production:**
1. **User App:** [https://epunch.app](https://epunch.app)
2. **Merchant App:** [https://merchant.epunch.app](https://merchant.epunch.app)
3. **Admin App:** [https://admin.epunch.app](https://admin.epunch.app)
4. **Backend API:** [https://api.epunch.app](https://api.epunch.app)

**🔧 Development:**
1. **User App:** [https://dev.epunch.app](https://dev.epunch.app)
2. **Merchant App:** [https://dev-merchant.epunch.app](https://dev-merchant.epunch.app)
3. **Admin App:** [https://dev-admin.epunch.app](https://dev-admin.epunch.app)
4. **Backend API:** [https://dev-api.epunch.app](https://dev-api.epunch.app)



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
* **Merchant App (Frontend):** React, TypeScript, Vite, Redux, shadcn/ui + Tailwind CSS, Radix UI
* **Admin App (Frontend):** React, TypeScript, Vite, Redux, Material UI
* **Backend:** NestJS (Node.js framework), TypeScript, PostgreSQL client (pg)
* **Database:** PostgreSQL (via Supabase as database host)
* **Real-time Communication:** WebSocket (Socket.io) for live updates
* **Package Manager:** Yarn
* **UI Framework:** Bootstrap 5 with React Bootstrap components and Bootstrap Icons (bundled in common-ui package)

### Infrastructure & Deployment
* **AWS** See [infra/README_INFRA.md](infra/README_INFRA.md) for detailed setup and deployment instructions

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

## Development

### Development Scripts

The project includes several convenience scripts for development:

* `./run-user-app.sh` - Builds common packages and starts user app development server
* `./run-merchant-app.sh` - Builds common packages and starts merchant app development server
* `./run-admin-app.sh` - Builds common packages and starts admin app development server
* `./run-backend.sh` - Starts backend development server
* `./build-common.sh` - Builds common-core and common-ui packages
* `./build-all.sh` - Builds all packages in the workspace
* `./reinstall-all.sh` - Reinstalls all dependencies across the workspace

### Database Schema

Database schema is managed via `initial_ddl.sql`. The project is currently in development stage and migrations are not used.

### Project Structure

```
# Root Level
├── application/              # Main application code
├── infra/                   # Infrastructure and deployment configurations (see README_INFRA.md)
├── database/                # Database schema and local development setup
├── docs/                    # Additional documentation
├── ANIMATION_FLOW.md        # Animation system documentation
├── progress-log.md          # Development progress tracking
├── run-*.sh                 # Development convenience scripts
├── build-*.sh               # Build scripts
└── reinstall-all.sh         # Dependency management script
```

The application code resides within the `application/` directory and is structured as a multi-module TypeScript project:

```
application/
├── backend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── merchant/
│   │   │   ├── loyalty/
│   │   │   ├── punch-cards/
│   │   │   ├── punches/
│   │   │   ├── punch-card-style/
│   │   │   ├── icons/
│   │   │   └── dev/
│   │   ├── core/
│   │   │   ├── middleware/
│   │   │   ├── decorators/
│   │   │   ├── interceptors/
│   │   │   └── types/
│   │   ├── database/
│   │   ├── config/
│   │   ├── websocket/
│   │   ├── events/
│   │   ├── supabase/
│   │   └── mappers/
├── user-app/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── punchCards/
│   │   │   ├── loyaltyPrograms/
│   │   │   ├── qrCode/
│   │   │   ├── animations/
│   │   │   ├── alert/
│   │   │   ├── signOut/
│   │   │   └── dev/
│   │   ├── components/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── api/
│   │   └── config/
├── merchant-app/
│   ├── src/
│   │   ├── app/                # Main application setup
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── routes.ts
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui components (29 components)
│   │   │   └── shared/        # Reusable business components
│   │   │       ├── layout/    # App layout components
│   │   │       ├── data-display/ # Tables, cards, stats
│   │   │       └── hooks/     # Custom hooks
│   │   ├── features/          # Feature-based organization
│   │   │   ├── auth/         # Authentication & login
│   │   │   ├── dashboard/    # Analytics & overview
│   │   │   ├── scanner/      # QR code scanning
│   │   │   ├── loyalty-programs/ # Program management
│   │   │   ├── design/       # Customization tools
│   │   │   └── onboarding/   # Merchant landing pages
│   │   ├── lib/              # Utilities (cn.ts for class merging)
│   │   ├── services/         # Business logic services
│   │   ├── store/            # Redux store & slices
│   │   ├── styles/           # Global styles & themes
│   │   └── hooks/            # Global custom hooks
├── admin-app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Merchants.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── MerchantView.tsx
│   │   │   ├── UserView.tsx
│   │   │   ├── MerchantCreate.tsx
│   │   │   ├── MerchantEdit.tsx
│   │   │   ├── MerchantDemoSetup.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── components/
│   │   │   ├── Table.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
├── common-core/
│   ├── src/
│   │   ├── dto/
│   │   │   ├── auth.dto.ts
│   │   │   ├── user.dto.ts
│   │   │   ├── merchant.dto.ts
│   │   │   ├── loyalty-program.dto.ts
│   │   │   ├── punch-card.dto.ts
│   │   │   ├── punch-card-style.dto.ts
│   │   │   ├── qr-value.dto.ts
│   │   │   ├── events.dto.ts
│   │   │   └── api-response.dto.ts
│   │   └── constants/
└── common-ui/
    ├── src/
    │   ├── components/
    │   ├── styles/
    │   └── apiClient.ts
```

* `common-core/` contains shared TypeScript types, DTOs, and constants used by all applications.
* `common-ui/` contains shared API client and bundled CSS (Bootstrap + Bootstrap Icons + mobile-first base styles).****