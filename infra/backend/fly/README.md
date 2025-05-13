# E-PUNCH.io Fly.io Deployment

This directory contains configuration files for deploying the E-PUNCH.io backend to Fly.io.

## Files

- `fly.toml` - The main Fly.io configuration file
- `.env.dev` - Environment variables to set as secrets on Fly.io
- `set-fly-secrets.sh` - Script to set all secrets from `.env.dev`
- `deploy.sh` - Complete deployment script (create app, set secrets, deploy)

## Deployment

### One-Step Deployment

For a complete deployment process (create app, set secrets, deploy), run:

```bash
./deploy.sh
```

This script will:
1. Check if the app exists in Fly.io
2. Create it if it doesn't exist
3. Prompt to set secrets from `.env.dev`
4. Deploy the application

### Manual Deployment Steps

If you prefer to deploy manually:

1. Create the app (first time only):
```bash
# From the infra/backend/fly directory:
fly launch --name e-punch-backend --dockerfile ../docker/Dockerfile --config fly.toml
```

2. Set secrets from `.env.dev`:
```bash
# From the infra/backend/fly directory:
./set-fly-secrets.sh
```

3. Deploy the application:
```bash
# From the project root:
fly deploy -c infra/backend/fly/fly.toml
```

## Environment Configuration

To add or update secrets, edit the `.env.dev` file using the standard format:

```
KEY1=value1
KEY2=value2
```

Then run `./set-fly-secrets.sh` to update the secrets on Fly.io.

## Monitoring & Logs

View application logs using the following commands:

### View Recent Logs

```bash
fly logs -a e-punch-backend
```

### Real-time Log Streaming

```bash
fly logs -a e-punch-backend -f
```

### View Limited Number of Log Lines

```bash
fly logs -a e-punch-backend --lines 100
```

### Filter Logs by Instance

```bash
fly logs -a e-punch-backend --instance <instance-id>
``` 