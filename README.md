# E-PUNCH.io

A simple electronic punch card system.

Users have a personal QR code and digital punch cards for various businesses. Businesses scan the user's QR code to add punches. Accumulated punches lead to rewards.

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

## Core Entities

1.  **User:** The customer.
2.  **Merchant:** The business offering loyalty programs.
3.  **Loyalty Program:** Defines the rules and reward for a specific merchant offer (e.g., "10 punches for a free coffee").
4.  **Punch Card:** Tracks a specific user's progress in a loyalty program.
5.  **Punch:** A single punch event.

## Technical Implementation

### Tech Stack
*   **Frontend:** React, TypeScript, Vite
*   **Backend:** NestJS (Node.js framework), TypeScript
*   **Database:** PostgreSQL

### Infrastructure & Deployment
*   **Frontend Hosting:** Vercel
*   **Backend Hosting:** Fly.io (Runs the backend NestJS application in a Docker container)
*   **Database Hosting:** AWS RDS for PostgreSQL.
*   **Authentication (Future):** AWS Cognito (For user/merchant logins)
*   **AWS Infrastructure Management:** Terraform (Code located in `infra/terraform`)

### Project Structure

The application code resides within the `application/` directory and is structured as a multi-module TypeScript project

```
application/
├── backend/     # NestJS backend code
├── frontend/    # React frontend code
└── common/      # Shared code (DTOs, constants, types, etc.)
```

*   The `common/` module contains code shared between the frontend and backend.
*   Both `backend/` and `frontend/` import modules from `common/`.

### Database Schema Management
*   The database schema (table definitions, relationships) will be managed using raw SQL DDL