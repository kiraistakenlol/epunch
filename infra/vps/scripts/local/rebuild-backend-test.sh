#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

cd "$DOCKER_DIR"

echo "=== Rebuilding Backend Test Container ==="
echo ""
echo "This will rebuild backend from scratch and start it"
echo ""

docker-compose -f docker-compose.local-test.yml build --no-cache backend

echo ""
echo "Starting backend..."
docker-compose -f docker-compose.local-test.yml up -d backend

echo ""
echo "Waiting 5 seconds for backend to start..."
sleep 5

echo ""
echo "Testing backend endpoint..."
curl -f http://localhost:4000/api/v1/hello-world && echo " ✅ Backend OK" || echo " ❌ Backend FAILED"

echo ""
echo "To view logs:"
echo "  cd $DOCKER_DIR"
echo "  docker-compose -f docker-compose.local-test.yml logs -f backend"
