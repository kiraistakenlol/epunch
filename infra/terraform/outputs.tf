# Route 53 outputs
output "route53_nameservers" {
  description = "Nameservers for the Route 53 hosted zone"
  value       = var.environment == "prod" ? aws_route53_zone.main[0].name_servers : null
}

output "route53_zone_id" {
  description = "Zone ID for the Route 53 hosted zone"
  value       = local.zone_id
}

# ECR outputs
output "ecr_repository_url" {
  description = "ECR repository URL for backend images"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = aws_ecr_repository.backend.name
}

# RDS outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
}

output "rds_connection_string" {
  description = "PostgreSQL connection string"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}"
  sensitive   = true
}

# Cognito outputs
output "cognito_user_pool_id" {
  description = "Cognito user pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "Cognito user pool client ID"
  value       = aws_cognito_user_pool_client.main.id
}

output "cognito_domain" {
  description = "Cognito domain URL"
  value       = "https://${local.cognito_custom_domain}"
}

# S3 outputs
output "s3_bucket_name" {
  description = "S3 bucket name for merchant files"
  value       = aws_s3_bucket.merchant_files.id
}

output "s3_bucket_url" {
  description = "S3 bucket URL"
  value       = "https://${aws_s3_bucket.merchant_files.bucket_regional_domain_name}"
}

# Amplify outputs
output "user_app_url" {
  description = "URL of the Amplify user app"
  value       = aws_amplify_app.apps["user"].default_domain
}

output "merchant_app_url" {
  description = "URL of the Amplify merchant app"
  value       = aws_amplify_app.apps["merchant"].default_domain
}

output "admin_app_url" {
  description = "URL of the Amplify admin app"
  value       = aws_amplify_app.apps["admin"].default_domain
}

# Custom domain outputs
output "custom_domains" {
  description = "Custom domain URLs"
  value = {
    user_app     = var.environment == "prod" ? "epunch.app" : "dev.epunch.app"
    merchant_app = var.environment == "prod" ? "merchant.epunch.app" : "dev-merchant.epunch.app"
    admin_app    = var.environment == "prod" ? "admin.epunch.app" : "dev-admin.epunch.app"
    api          = local.api_domain
    auth         = local.cognito_custom_domain
  }
}

# App Runner outputs
output "backend_url" {
  description = "URL of the App Runner backend service"
  value       = "https://${aws_apprunner_service.backend.service_url}"
}

# Environment configuration for frontend apps
output "environment_variables" {
  description = "Environment variables for frontend .env file"
  value = {
    VITE_API_URL                     = "https://${local.api_domain}"
    VITE_AWS_REGION                  = var.aws_region
    VITE_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.main.id
    VITE_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.main.id
    VITE_COGNITO_DOMAIN              = "https://${local.cognito_custom_domain}"
    VITE_S3_BUCKET_NAME              = aws_s3_bucket.merchant_files.id
  }
} 