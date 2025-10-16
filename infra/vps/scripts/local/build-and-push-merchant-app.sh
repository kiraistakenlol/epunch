#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../../../.."
APP_DIR="$PROJECT_ROOT/application"
DOCKER_DIR="$PROJECT_ROOT/infra/vps/docker"

GITHUB_USER="kiraistakenlol"
PLATFORM="linux/amd64"
IMAGE_NAME="ghcr.io/$GITHUB_USER/epunch-merchant-app:latest"

cd "$DOCKER_DIR"
source .env

echo "=== Building and Pushing Merchant App ==="
echo "Platform: $PLATFORM"
echo "Image: $IMAGE_NAME"
echo ""
echo "Build args:"
echo "  VITE_API_URL=$VITE_API_URL"
echo "  VITE_USER_APP_URL=$VITE_USER_APP_URL"
echo ""

docker build \
    --no-cache \
    --platform "$PLATFORM" \
    --build-arg VITE_API_URL="$VITE_API_URL" \
    --build-arg VITE_USER_APP_URL="$VITE_USER_APP_URL" \
    -t "$IMAGE_NAME" \
    -f "$APP_DIR/merchant-app/Dockerfile" \
    "$APP_DIR"

echo "✅ Built $IMAGE_NAME"
echo ""
echo "=== Pushing Merchant App ==="

docker push "$IMAGE_NAME"

echo "✅ Pushed $IMAGE_NAME"
