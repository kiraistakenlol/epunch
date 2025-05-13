#!/bin/bash

# Script to deploy E-PUNCH.io backend to Fly.io

echo "Deploying E-PUNCH.io backend to Fly.io..."
cd infra/backend/fly
./deploy.sh
cd ../../..
echo "Deployment process completed!" 