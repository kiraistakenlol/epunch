# GitHub Actions Setup

## Required Repository Variables

Go to `Settings` → `Secrets and variables` → `Actions` → `Variables` tab:

1. **VITE_API_URL**: `https://api.epunch.app/v1`
2. **VITE_USER_APP_URL**: `https://epunch.app`
3. **VITE_GOOGLE_REDIRECT_URI**: `https://epunch.app/auth/callback`
4. **GOOGLE_CLIENT_ID**: `319076167447-pohdeflv2v07jca8dbtgut9m2uena0ma.apps.googleusercontent.com`

## How It Works

- **Triggers**: Automatically on push to `master` or `dev`, or manually via workflow dispatch
- **Jobs**:
  - `build-backend`: Builds backend image
  - `build-frontend`: Builds user-app, merchant-app, admin-app in parallel (matrix strategy)
- **Registry**: Pushes to `ghcr.io/kiraistakenlol/epunch-*:latest`
- **Authentication**: Uses `GITHUB_TOKEN` (automatically available)
- **Caching**: Uses GitHub Actions cache for faster builds

## Manual Trigger

1. Go to `Actions` tab
2. Select `Build and Push Docker Images`
3. Click `Run workflow`
4. Select branch (master/dev)
5. Click `Run workflow`

## After Images Are Built

Deploy on VPS:
```bash
ssh root@45.32.117.48 'cd /root/epunch && git pull && ./infra/vps/scripts/vps/deploy.sh'
```
