#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Starting All Services ==="

cd "$DOCKER_DIR"
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ All services started"
echo ""
echo "Check status:"
echo "  docker-compose -f docker-compose.prod.yml ps"
