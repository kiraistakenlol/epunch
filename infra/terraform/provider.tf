provider "aws" {
  region  = var.aws_region
  profile = "personal"
  
  default_tags {
    tags = {
      Project = "epunch"
    }
  }
} 