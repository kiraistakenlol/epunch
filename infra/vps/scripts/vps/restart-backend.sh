#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Restarting Backend ==="

cd "$DOCKER_DIR"

docker-compose -f docker-compose.prod.yml restart backend

echo "✅ Backend restarted"
