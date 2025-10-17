#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Deploy User App ==="
echo ""

cd "$DOCKER_DIR"

echo "Pulling latest user-app image..."
docker-compose -f docker-compose.prod.yml pull user-app

echo ""
echo "Stopping and removing user-app container..."
docker-compose -f docker-compose.prod.yml rm -sf user-app

echo ""
echo "Starting user-app..."
docker-compose -f docker-compose.prod.yml up -d user-app

echo ""
echo "✅ User App deployed!"
echo ""
echo "Check logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f user-app"
