#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Stopping All Services ==="

cd "$DOCKER_DIR"

docker-compose -f docker-compose.prod.yml down

echo "✅ All services stopped"
