# App Runner backend service
resource "aws_apprunner_service" "backend" {
  service_name = "epunch-${var.environment}-backend"
  
  source_configuration {
    image_repository {
      image_configuration {
        port = "4000"
        runtime_environment_variables = {
          NODE_ENV                        = var.environment == "prod" ? "production" : "development"
          APP_PORT                        = "4000"
          APP_HOST                        = "0.0.0.0"
          
          # Database Configuration
          DB_HOST                         = aws_db_instance.main.address
          DB_PORT                         = aws_db_instance.main.port
          DB_USERNAME                     = var.db_username
          DB_PASSWORD                     = var.db_password
          DB_DATABASE                     = var.db_name
          
          # AWS Credentials
          AWS_ACCESS_KEY_ID               = var.aws_access_key_id
          AWS_SECRET_ACCESS_KEY           = var.aws_secret_access_key
          
          # AWS Configuration
          AWS_REGION                      = var.aws_region
          AWS_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.main.id
          
          # S3 Configuration
          S3_MERCHANT_FILES_BUCKET_NAME   = aws_s3_bucket.merchant_files.bucket
        }
      }
      image_identifier      = "${aws_ecr_repository.backend.repository_url}:latest"
      image_repository_type = "ECR"
    }
    
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_access.arn
    }
    
    auto_deployments_enabled = true
  }
  
  instance_configuration {
    cpu    = "0.25 vCPU"
    memory = "0.5 GB"
  }
  
  tags = {
    Name        = "epunch-${var.environment}-backend"
    Environment = var.environment
  }
}

# IAM Role for App Runner ECR access
resource "aws_iam_role" "apprunner_ecr_access" {
  name = "epunch-${var.environment}-apprunner-ecr-access"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })
}

# Attach ECR read-only policy to the role
resource "aws_iam_role_policy_attachment" "apprunner_ecr_access" {
  role       = aws_iam_role.apprunner_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# App Runner custom domain association
resource "aws_apprunner_custom_domain_association" "backend" {
  domain_name = local.api_domain
  service_arn = aws_apprunner_service.backend.arn
} 