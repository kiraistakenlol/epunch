#!/bin/bash

# Build and push Docker image to ECR
# Usage: ./build-and-push-ecr.sh [aws-profile] [dev|prod]

set -e  # Exit on any error

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../" && pwd)"

# Parameters
AWS_PROFILE=${1}
ENVIRONMENT=${2:-dev}

if [[ -z "$AWS_PROFILE" ]]; then
    echo "❌ AWS Profile not specified"
    echo "Usage: $0 [aws-profile] [dev|prod]"
    exit 1
fi

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ Invalid environment. Use 'dev' or 'prod'"
    echo "Usage: $0 [aws-profile] [dev|prod]"
    exit 1
fi

echo "🚀 Building and pushing to ECR for environment: $ENVIRONMENT"
echo "🔄 Using AWS Profile: $AWS_PROFILE"

# Change to terraform directory to get outputs
cd "$PROJECT_ROOT/infra/terraform"

# Ensure we're in the correct terraform workspace
echo "📡 Switching to $ENVIRONMENT terraform workspace..."
AWS_PROFILE=$AWS_PROFILE terraform workspace select "$ENVIRONMENT" 2>/dev/null || {
    echo "❌ Terraform workspace '$ENVIRONMENT' not found. Please create it first:"
    echo "  AWS_PROFILE=$AWS_PROFILE terraform workspace new $ENVIRONMENT"
    exit 1
}

# Get ECR repository URL from terraform output
echo "📡 Getting ECR repository URL from Terraform..."
ECR_REPO_URL=$(AWS_PROFILE=$AWS_PROFILE terraform output -raw ecr_repository_url 2>/dev/null)

if [ -z "$ECR_REPO_URL" ]; then
    echo "❌ Could not get ECR repository URL from terraform output"
    echo "Make sure you've deployed the infrastructure first:"
    echo "  AWS_PROFILE=$AWS_PROFILE terraform apply -var-file=\"env/${ENVIRONMENT}.tfvars\""
    exit 1
fi

echo "✅ ECR Repository: $ECR_REPO_URL"

# Extract AWS region and account ID from ECR URL
AWS_REGION=$(echo "$ECR_REPO_URL" | cut -d'.' -f4)
AWS_ACCOUNT_ID=$(echo "$ECR_REPO_URL" | cut -d'.' -f1)

echo "🔐 Logging into ECR..."
AWS_PROFILE=$AWS_PROFILE aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

if [ $? -ne 0 ]; then
    echo "❌ ECR login failed. Make sure AWS CLI is configured with proper credentials."
    exit 1
fi

# Build Docker image
echo "🔨 Building Docker image for linux/amd64 platform..."
cd "$PROJECT_ROOT"
docker buildx build --platform linux/amd64 -f infra/backend/docker/Dockerfile -t "epunch-$ENVIRONMENT-backend" .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Tag for ECR
echo "🏷️  Tagging image for ECR..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag "epunch-$ENVIRONMENT-backend:latest" "$ECR_REPO_URL:latest"
docker tag "epunch-$ENVIRONMENT-backend:latest" "$ECR_REPO_URL:$TIMESTAMP"

# Push to ECR
echo "📤 Pushing to ECR..."
docker push "$ECR_REPO_URL:latest"
docker push "$ECR_REPO_URL:$TIMESTAMP"

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed"
    exit 1
fi

echo "✅ Successfully pushed Docker image to ECR!"
echo "📋 Image tags pushed:"
echo "   - $ECR_REPO_URL:latest"
echo "   - $ECR_REPO_URL:$TIMESTAMP"
echo ""
echo "🚀 App Runner will automatically deploy the new image."
echo "   Monitor deployment at: https://console.aws.amazon.com/apprunner" 