output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.epunch_dev.id
}

output "user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.epunch_dev_client.id
}

output "cognito_domain" {
  description = "Cognito Domain"
  value       = aws_cognito_user_pool_domain.epunch_dev_domain.domain
}

output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}

output "s3_bucket_name" {
  description = "S3 bucket name for merchant files"
  value       = aws_s3_bucket.merchant_files.bucket
}



output "environment_variables" {
  description = "Environment variables for frontend .env file"
  value = {
    VITE_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.epunch_dev.id
    VITE_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.epunch_dev_client.id
    VITE_AWS_REGION                  = var.aws_region
    VITE_COGNITO_DOMAIN              = "${aws_cognito_user_pool_domain.epunch_dev_domain.domain}.auth.${var.aws_region}.amazoncognito.com"
    VITE_S3_BUCKET_NAME              = aws_s3_bucket.merchant_files.bucket
  }
} 