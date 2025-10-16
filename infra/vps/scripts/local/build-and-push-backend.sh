#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../../../.."
APP_DIR="$PROJECT_ROOT/application"
DOCKER_DIR="$PROJECT_ROOT/infra/vps/docker"

GITHUB_USER="kiraistakenlol"
PLATFORM="linux/amd64"
IMAGE_NAME="ghcr.io/$GITHUB_USER/epunch-backend:latest"

echo "=== Building and Pushing Backend ==="
echo "Platform: $PLATFORM"
echo "Image: $IMAGE_NAME"
echo ""

docker build \
    --platform "$PLATFORM" \
    -t "$IMAGE_NAME" \
    -f "$APP_DIR/backend/Dockerfile" \
    "$APP_DIR"

echo "✅ Built $IMAGE_NAME"
echo ""
echo "=== Pushing Backend ==="

docker push "$IMAGE_NAME"

echo "✅ Pushed $IMAGE_NAME"
