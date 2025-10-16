#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

cd "$DOCKER_DIR"

echo "=== Testing Docker Images Locally ==="
echo ""
echo "This will:"
echo "  1. Build all images locally"
echo "  2. Start services with docker-compose"
echo "  3. Test endpoints"
echo ""
echo "Services will be available at:"
echo "  - Backend:     http://localhost:4000/api/v1/hello-world"
echo "  - User App:    http://localhost:3001"
echo "  - Merchant:    http://localhost:3004"
echo "  - Admin:       http://localhost:3003"
echo "  - Postgres:    localhost:54321"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Building and starting services..."
docker-compose -f docker-compose.local-test.yml --env-file .env.local-test up --build -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "=== Testing Endpoints ==="
echo ""

echo "Testing backend health..."
curl -f http://localhost:4000/api/v1/hello-world && echo " ✅ Backend OK" || echo " ❌ Backend FAILED"

echo ""
echo "Testing user-app..."
curl -f http://localhost:3001 -o /dev/null -s && echo "✅ User App OK" || echo "❌ User App FAILED"

echo ""
echo "Testing merchant-app..."
curl -f http://localhost:3004 -o /dev/null -s && echo "✅ Merchant App OK" || echo "❌ Merchant App FAILED"

echo ""
echo "Testing admin-app..."
curl -f http://localhost:3003 -o /dev/null -s && echo "✅ Admin App OK" || echo "❌ Admin App FAILED"

echo ""
echo "=== All Tests Complete ==="
echo ""
echo "To view logs:"
echo "  cd $DOCKER_DIR"
echo "  docker-compose -f docker-compose.local-test.yml logs -f"
echo ""
echo "To stop:"
echo "  cd $DOCKER_DIR"
echo "  docker-compose -f docker-compose.local-test.yml down"
