terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "epunch-terraform-state"
    key            = "epunch/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "epunch-terraform-state-lock"
    encrypt        = true
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}