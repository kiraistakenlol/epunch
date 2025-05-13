#!/bin/bash

cd "$(dirname "$0")"

echo "Starting E-PUNCH.io backend in Docker..."

docker-compose up --build 