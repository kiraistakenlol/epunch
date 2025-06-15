#!/bin/bash

# Script to deploy E-PUNCH.io backend to ECR
# Usage: ./deploy-backend.sh [aws-profile] [dev|prod]

# Parameters
AWS_PROFILE=${1}
ENVIRONMENT=${2:-dev}

if [[ -z "$AWS_PROFILE" ]]; then
    echo "❌ AWS Profile not specified"
    echo "Usage: $0 [aws-profile] [dev|prod]"
    exit 1
fi

echo "Deploying E-PUNCH.io backend to ECR..."
./infra/backend/docker/build-and-push-ecr.sh "$AWS_PROFILE" "$ENVIRONMENT"
echo "Deployment process completed!" 