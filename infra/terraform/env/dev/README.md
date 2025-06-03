# E-Punch Dev Environment - Terraform

Minimalistic Terraform configuration for AWS resources including Cognito User Pool for email authentication and S3 bucket for merchant logos.

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Terraform installed** (>= 1.0)

## Quick Start

1. **Configure variables:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Deploy:**
   ```bash
   ./deploy.sh
   ```

3. **Get environment variables:**
   ```bash
   terraform output -json environment_variables
   ```

## What Gets Created

- **Cognito User Pool** with email authentication and Google OAuth
- **User Pool Client** for the frontend app
- **S3 Bucket** for merchant logos with public read access

## Configuration

- `aws_region`: AWS region (default: us-east-1)
- `s3_bucket_name`: Globally unique S3 bucket name for merchant logos
- `cognito_domain_prefix`: Globally unique Cognito domain prefix
- `google_client_id`: Google OAuth client ID
- `google_client_secret`: Google OAuth client secret
- `callback_urls`: OAuth callback URLs
- `logout_urls`: OAuth logout URLs

## Outputs

- User Pool ID
- User Pool Client ID
- Cognito Domain
- AWS Region
- S3 Bucket Name
- S3 Bucket URL
- Environment variables for `.env` file

## Cleanup

```bash
terraform destroy
``` 