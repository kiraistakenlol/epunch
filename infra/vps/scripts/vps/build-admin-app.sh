#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Building Admin App ==="

cd "$DOCKER_DIR"
docker-compose -f docker-compose.prod.yml build admin-app

echo "✅ Admin App built"
