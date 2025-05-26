terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_cognito_user_pool" "epunch_dev" {
  name = "epunch-dev"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 8
  }

  tags = {
    Environment = "dev"
  }
}

resource "aws_cognito_user_pool_client" "epunch_dev_client" {
  name         = "epunch-dev-client"
  user_pool_id = aws_cognito_user_pool.epunch_dev.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
} 