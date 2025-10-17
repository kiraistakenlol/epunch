#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Restarting Admin App ==="

cd "$DOCKER_DIR"

docker-compose -f docker-compose.prod.yml restart admin-app

echo "✅ Admin App restarted"
