#!/bin/bash

cd "$(dirname "$0")"
SCRIPT_DIR="$(pwd)"
PROJECT_ROOT="$(cd ../../../ && pwd)"

APP_NAME=$(grep "app =" fly.toml | cut -d'"' -f2)

if [ -z "$APP_NAME" ]; then
  echo "Error: Could not determine app name from fly.toml"
  exit 1
fi

echo "Deploying app: $APP_NAME"

# Check if app exists
if fly status -a "$APP_NAME" &> /dev/null; then
  echo "App $APP_NAME exists, proceeding with deployment..."
else
  echo "App $APP_NAME does not exist yet. Creating app..."
  cd "$PROJECT_ROOT"  # Move to project root
  fly launch --name "$APP_NAME" --no-deploy --dockerfile "$PROJECT_ROOT/infra/backend/docker/Dockerfile" --config "$SCRIPT_DIR/fly.toml"
  cd "$SCRIPT_DIR"  # Move back to script directory
  
  # Ask if we should set secrets
  echo
  read -p "Would you like to set secrets from .env.dev before deploying? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./set-fly-secrets.sh
  fi
fi

# Deploy the app
echo "Deploying to Fly.io..."
cd "$PROJECT_ROOT"  # Move to project root for deployment
fly deploy -c "$SCRIPT_DIR/fly.toml"
cd "$SCRIPT_DIR"  # Move back to script directory

# Show deployment info
echo "Deployment complete!"
echo "App URL: https://$APP_NAME.fly.dev" 