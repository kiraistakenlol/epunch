output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.epunch_dev.id
}

output "user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.epunch_dev_client.id
}

output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}

output "environment_variables" {
  description = "Environment variables for frontend .env file"
  value = {
    VITE_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.epunch_dev.id
    VITE_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.epunch_dev_client.id
    VITE_AWS_REGION                  = var.aws_region
  }
} 