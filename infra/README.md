# E-PUNCH.io Infrastructure

This directory contains all infrastructure-related configurations for the E-PUNCH.io application.

## Directory Structure

```
infra/
├── backend/             # Backend infrastructure
│   ├── docker/          # Docker configurations
│   │   ├── Dockerfile   # Backend Dockerfile
│   │   ├── .dockerignore # Files to ignore in Docker build
│   │   ├── docker-compose.yml # Local development docker-compose config
│   │   └── run-docker-local.sh # Script to run backend locally with Docker
│   └── fly/             # Fly.io deployment configurations
│       └── fly.toml     # Fly.io deployment manifest
│
├── frontend/            # Frontend infrastructure
│   └── vercel/          # Vercel deployment configuration (planned)
│
└── terraform/           # Terraform IaC (if needed)
```

## Environment Setup

The application requires a `.env` file in the `application/backend/` directory with the following variables:

```
# Database connection (from Supabase Project Settings > Database)
DB_HOST=db.your-project-id.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-database-password

# Application settings
APP_HOST=localhost
APP_PORT=3001
NODE_ENV=development
```

## Local Development with Docker

To run the backend locally using Docker:

```bash
# From the project root:
./infra/backend/docker/run-docker-local.sh
```

This will build and start the backend container, exposing it on port 3001.

## Deployment to Fly.io

To deploy the backend to Fly.io:

### Automated Deployment

The simplest approach is to use the provided deployment script:

```bash
# From the infra/backend/fly directory:
./deploy.sh
```

This script handles:
1. Creating the app if it doesn't exist
2. Setting secrets from the `.env.dev` file
3. Deploying the application

### Manual Deployment

If you prefer manual steps:

1. Install the Fly CLI:
```bash
# On macOS
brew install flyctl
```

2. Log in to Fly.io:
```bash
fly auth login
```

3. Create a `.env.dev` file in the `infra/backend/fly` directory with your secrets:
```
# Database connection (from Supabase Project Settings > Database)
DB_HOST=db.your-project-id.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-database-password
```

4. Set the secrets:
```bash
# From the infra/backend/fly directory:
./set-fly-secrets.sh
```

5. Deploy the application:
```bash
# From the infra/backend/fly directory:
fly deploy -c fly.toml
``` 