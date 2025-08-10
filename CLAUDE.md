# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Package Building
- `./build-common.sh` - Build common-core and common-ui packages (required before starting any app)
- `./build-all.sh` - Build all packages in the workspace

### Application Development
- `./run-backend.sh` - Start NestJS backend development server
- `./run-user-app.sh` - Build common packages and start user app (React + Vite)
- `./run-merchant-app.sh` - Build common packages and start merchant app (React + Vite)
- `./run-admin-app.sh` - Build common packages and start admin app (React + Vite)

### Package Management
- `./reinstall-all.sh` - Reinstall all dependencies across the workspace
- Individual app builds: `npm run build` (backend), `npm run dev` (frontend apps)

### Testing & Quality
- Backend: `npm run start:dev` for development with hot reload
- Frontend: `npm run dev` for development server, `npm run build` for production builds

## Architecture Overview

This is a multi-app TypeScript monorepo implementing a digital loyalty platform with punch cards, bundles, and benefit cards.

### Core Structure
```
application/
├── backend/           # NestJS API server
├── user-app/          # Customer-facing React app  
├── merchant-app/      # Business dashboard (shadcn/ui + Tailwind)
├── admin-app/         # System admin interface (Material-UI)
├── common-core/       # Shared DTOs and types
└── common-ui/         # Shared API client and Bootstrap styles
```

### Technology Stack
- **Backend**: NestJS (Node.js), PostgreSQL, WebSocket (Socket.io), JWT auth
- **Frontend**: React 18, TypeScript, Vite, Redux Toolkit
- **UI Libraries**: 
  - merchant-app: shadcn/ui + Tailwind CSS + Radix UI primitives
  - admin-app: Material-UI
  - user-app: Custom CSS with Bootstrap base
- **Package Manager**: Yarn (workspace-enabled)
- **Database**: PostgreSQL via Supabase

### Feature-Based Backend Architecture
Backend uses feature-based modules in `src/features/`:
- `auth/` - End user authentication (Cognito)
- `admin/` - Super admin authentication  
- `merchant/` - Merchant management and auth
- `loyalty/` - Punch card loyalty programs
- `punch-cards/` - Individual punch card instances
- `bundle-program/` - Bundle program templates
- `bundle/` - Individual bundle instances
- `benefit-card/` - Benefit card programs (upcoming)
- `analytics/` - Reporting and metrics
- `user/` - End user management
- `icons/` - Icon management system

### Authentication System
Three distinct user types with unified middleware:
1. **End Users**: Cognito JWT tokens (`POST /auth`)
2. **Merchant Users**: Backend JWT with roles (`POST /merchants/auth`) 
3. **Super Admin**: Hardcoded credentials (`POST /admin/auth`)

Uses security decorators: `@RequireEndUser()`, `@RequireMerchantUser(['admin'])`, `@RequireAnyAuth()`

### Data Flow & Real-time Updates
- WebSocket connections for live updates across all apps
- Redux state management in frontend apps
- Feature-based slicing (authSlice, loyaltyProgramsSlice, etc.)
- Real-time synchronization of punch/bundle operations

### Key Business Entities
- **User**: Customer with universal QR code
- **Merchant**: Business offering loyalty products
- **Loyalty Program**: Punch card template (e.g., "10 coffees = 1 free")
- **Punch Card**: User's individual progress tracker
- **Bundle Program**: Pre-paid package template 
- **Bundle**: User's bundle instance with quantity/expiration
- **Benefit Card**: Discount/benefit programs (upcoming)

### Code Style Guidelines
- No code comments (per .cursor/rules/general-rules.mdc)
- Remove code instead of commenting out
- Concise and minimalistic approach
- TypeScript strict mode throughout
- Feature-based organization over technical grouping

### Common Development Patterns
- **Shared Types**: Import from `e-punch-common-core` package
- **API Client**: Use `apiClient` from `e-punch-common-ui`
- **State Management**: Redux Toolkit with typed hooks
- **Component Structure**: Feature-based folders with co-located components
- **Error Handling**: Standardized error responses via `ApiResponse<T>` DTO

### Database Schema
- Schema managed via `database/ddl/core-schema.sql`
- No migrations in development - direct DDL updates
- Multi-tenant design with merchant-scoped data
- RBAC via `merchant_user` and `merchant_role` tables

### Deployment & Infrastructure  
- AWS infrastructure (see `infra/README_INFRA.md`)
- Docker containerization for backend
- Amplify hosting for frontends
- Environment-based configuration (dev/prod URLs in README.md)