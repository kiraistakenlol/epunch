# E-PUNCH.io

A comprehensive digital loyalty platform offering multiple product types for businesses and customers.

Users have a personal QR code to interact with various loyalty products at different businesses. The platform supports multiple loyalty mechanisms: **punch cards** for earn-and-redeem programs, **bundles** for pre-paid packages with quantity tracking, and **discount cards** for percentage-based savings (coming soon). Businesses can mix and match these products to create tailored loyalty experiences for their customers.

## Application

### User App

#### Features

1. **Personal QR Code**: Universal QR code for interacting with all loyalty products across businesses
2. **Multi-Product Loyalty Wallet**: View and manage various loyalty products from multiple businesses:
   - **Punch Cards**: Traditional earn-and-redeem loyalty programs with progress tracking
   - **Bundles**: Pre-purchased packages with quantity tracking and expiration management
   - **Discount Cards**: Percentage-based savings cards *(coming soon)*
3. **Flexible Authentication**: 
   - Basic punch card functionality works without authentication (user ID auto-generated)
   - Advanced features (bundles, discount cards) require authentication for security and account management
   - Google and email/password authentication available
4. **Real-time Updates**: Live updates via WebSocket for all loyalty product interactions and completions
5. **Rich Interactions**: Animated loyalty product interactions with completion flows and visual feedback
6. **Development Tools**: Testing and debugging interface (`/dev` route) - *restricted to super admin users only*

#### User Journey Examples

**Scenario 1: First-Time Visit to "Pottery Cafe"**

1. I walk into "Pottery Cafe" and scan their QR code (or open `epunch.io` manually).
2. I see my personal QR code and my loyalty wallet.
3. I buy a coffee and show my QR code to the manager.
4. Manager scans my QR code and sees available loyalty options for their business:
   - **Punch Card**: "Coffee Loyalty" (10 coffees = 1 free)
   - **Bundle**: "Coffee Bundle" (buy 5 coffees in advance for discount)
   - **Discount Card**: "VIP Discount" (15% off all items) *(coming soon)*
5. Manager selects "Coffee Loyalty" punch card and adds a punch.
6. I now see a "Coffee Loyalty" punch card in my wallet showing "1/10 punches".

**Scenario 2: Purchasing a Bundle at "FitGym"**

1. I visit "FitGym" wanting to commit to regular workouts.
2. Manager scans my user QR code and shows me loyalty options:
   - **Punch Card**: "Workout Rewards" (10 visits = 1 free personal training)
   - **Bundle**: "Monthly Pass" (20 visits, 30-day validity, bulk discount)
3. I choose the bundle for better value and convenience.
4. Manager processes the "Monthly Pass" bundle - I now see it in my wallet: "20 visits remaining, expires in 30 days".

**Scenario 3: Using Different Products at the Same Business**

1. I return to "FitGym" with both a punch card and an active bundle.
2. I tap my "Monthly Pass" bundle - my QR switches to bundle mode.
3. Manager scans my bundle QR and redeems 1 visit (now "19 remaining").
4. Next visit, I might choose to earn punches instead by using my punch card QR mode.

**Multi-Business Loyalty Management**

My loyalty wallet shows products from multiple businesses:
- **Pottery Cafe**: Coffee punch card (3/10), VIP discount card *(coming soon)*
- **FitGym**: Monthly bundle (15 remaining), Workout punch card (2/10) 
- **BookStore**: Reading rewards punch card (7/15), Book bundle (5 remaining)

### Merchant App

#### Features

1. **Multi-Product Loyalty Management**
   - **Punch Card Programs**: Create earn-and-redeem loyalty programs with configurable punch requirements and rewards
   - **Bundle Programs**: Design pre-paid packages with quantity presets, validity periods, and bulk pricing
   - **Discount Cards**: Set up percentage-based discount programs *(coming soon)*
   - Comprehensive analytics and performance tracking across all product types

2. **Advanced QR Code Scanner System**
   - Intelligent QR code recognition for all loyalty product types
   - **User QR Scanning**: View all available loyalty products, select and activate (punch, give bundle, apply discount)
   - **Product QR Scanning**: Handle punch card redemptions, bundle usage, and discount applications
   - Flexible quantity controls and transaction management

3. **Customer Relationship Management**
   - Unified customer profiles showing all loyalty products and history
   - Track customer engagement across different product types
   - Manage individual customer loyalty inventories (punch cards, bundles, discount cards)

4. **Customer Onboarding & Discovery**
   - Generate merchant-specific QR codes for automatic product enrollment
   - Seamless customer onboarding without manual product search
   - Customizable landing pages showcasing available loyalty products

5. **Brand Customization**
   - Universal design system for all loyalty product types
   - Color theme editor with live preview across products
   - Logo and icon customization for consistent branding
   - Custom graphics and styling for enhanced brand identity

6. **Role-Based Access Control**
   - Admin access: Full dashboard, analytics, program management
   - Staff access: Scanner functionality only
   - Secure authentication with JWT tokens

7. **Analytics Dashboard**
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
│   ├── scanner/       # QR code scanning for all product types
│   ├── loyalty-programs/ # Punch card program management
│   ├── bundle-programs/  # Bundle program management
│   ├── discount-programs/ # Discount program management (coming soon)
│   ├── customers/     # Unified customer management across all products
│   ├── analytics/     # Advanced analytics for all product types
│   ├── design/        # Universal customization tools
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

### User Management
1.  **User:** The customer with a universal QR code for all loyalty interactions. Can optionally be a super admin with access to development tools.
2.  **Admin User:** System administrators with varying permission levels (staff, manager, super admin).
3.  **Merchant:** The business offering multiple loyalty product types to customers.

### Loyalty Product Templates (Created by Merchants)
4.  **Loyalty Program:** Defines punch card rules and rewards (e.g., "10 punches for a free coffee").
5.  **Bundle Program:** Template for pre-sellable packages with quantity presets and validity periods (e.g., "10 Gym Visits" bundle).
6.  **Discount Program:** Template for percentage-based savings programs *(coming soon)*.

### User Loyalty Product Instances
7.  **Punch Card:** Individual user's progress tracker for a specific loyalty program.
8.  **Bundle:** Individual user's bundle instance with remaining quantity, expiration date, and usage tracking.
9.  **Discount Card:** Individual user's discount card with usage limits and validity *(coming soon)*.

### Activity Tracking
10. **Punch:** Records a single punch event with timestamp and location.
11. **Bundle Usage:** Records each bundle redemption event with quantity used and timestamp.
12. **Discount Usage:** Records discount applications with amount saved and timestamp *(coming soon)*.

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

The application uses WebSocket connections for real-time updates across all loyalty product types:

* **Live Activity Updates:** Users see all loyalty interactions immediately without page refresh
  - Punch additions and card completions
  - Bundle creation, usage, and quantity changes
  - Discount applications and savings tracking *(coming soon)*
* **Instant Notifications:** Real-time alerts for all product milestones and redemptions
* **Animation System:** Coordinated animations for all loyalty product interactions and completions
* **Multi-Product Sync:** Changes to any loyalty product instantly sync across user and merchant apps

### Animation System

The application includes a sophisticated animation system for enhanced user experience across all loyalty products:

* **Universal Product Animations:** Consistent animation patterns for punch cards, bundles, and discount cards
* **Sequence-based flows:** Complex animation flows defined as step sequences for product interactions
* **Event-driven progression:** Animations can wait for user interactions and respond to real-time updates
* **Global components:** Alerts and overlays work across the entire application for all product types
* **State management:** Separate Redux slices for animation execution and UI state management

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
│   │   │   ├── punch-card-style/
│   │   │   ├── bundle-program/     # Bundle program management
│   │   │   ├── bundle/            # Individual bundle operations
│   │   │   ├── analytics/
│   │   │   ├── icons/
│   │   │   ├── admin/
│   │   │   ├── merchant-user/
│   │   │   └── dev/
│   │   ├── core/
│   │   │   ├── middleware/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── database/
│   │   ├── config/
│   │   ├── websocket/
│   │   ├── events/
│   │   ├── supabase/
│   │   └── mappers/               # Includes bundle and bundle-program mappers
├── user-app/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/           # Includes bundle card components
│   │   │   │   └── loyalty-cards/
│   │   │   │       ├── bundle-card/ # Bundle card UI components
│   │   │   │       └── punch-card/  # Punch card UI components
│   │   │   ├── bundles/            # Bundle state management
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
│   │   │   ├── scanner/      # QR code scanning with bundle support
│   │   │   ├── loyalty-programs/ # Program management
│   │   │   ├── bundle-programs/  # Bundle program management
│   │   │   ├── customers/    # Customer management with bundles and punch cards
│   │   │   ├── analytics/    # Advanced analytics
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
│   │   │   ├── bundle.dto.ts       # Bundle-related DTOs
│   │   │   ├── qr-value.dto.ts     # Includes bundle_id QR type
│   │   │   ├── events.dto.ts       # Includes bundle events
│   │   │   ├── analytics.dto.ts
│   │   │   ├── admin.dto.ts
│   │   │   ├── merchant-user.dto.ts
│   │   │   ├── icon.dto.ts
│   │   │   ├── jwt.dto.ts
│   │   │   ├── create-punch.dto.ts
│   │   │   ├── punch-operation-result.dto.ts
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