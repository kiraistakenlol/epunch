#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Deploy Merchant App ==="
echo ""

cd "$DOCKER_DIR"

echo "Pulling latest merchant-app image..."
docker-compose -f docker-compose.prod.yml pull merchant-app

echo ""
echo "Stopping and removing merchant-app container..."
docker-compose -f docker-compose.prod.yml rm -sf merchant-app

echo ""
echo "Starting merchant-app..."
docker-compose -f docker-compose.prod.yml up -d merchant-app

echo ""
echo "✅ Merchant App deployed!"
echo ""
echo "Check logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f merchant-app"
