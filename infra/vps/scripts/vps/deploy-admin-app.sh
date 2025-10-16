#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Deploy Admin App ==="
echo ""

cd "$DOCKER_DIR"

echo "Pulling latest admin-app image..."
docker-compose -f docker-compose.prod.yml pull admin-app

echo ""
echo "Stopping and removing admin-app container..."
docker-compose -f docker-compose.prod.yml rm -sf admin-app

echo ""
echo "Starting admin-app..."
docker-compose -f docker-compose.prod.yml up -d admin-app

echo ""
echo "✅ Admin App deployed!"
echo ""
echo "Check logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f admin-app"
