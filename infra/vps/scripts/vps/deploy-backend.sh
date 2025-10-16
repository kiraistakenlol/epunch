#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Deploy Backend ==="
echo ""

cd "$DOCKER_DIR"

echo "Pulling latest backend image..."
docker-compose -f docker-compose.prod.yml pull backend

echo ""
echo "Restarting backend..."
docker-compose -f docker-compose.prod.yml up -d backend

echo ""
echo "✅ Backend deployed!"
echo ""
echo "Check logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f backend"
