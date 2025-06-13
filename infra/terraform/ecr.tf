# ECR Repository for backend images
resource "aws_ecr_repository" "backend" {
  name                 = "epunch-${var.environment}-backend"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = false
  }
  
  tags = {
    Name        = "epunch-${var.environment}-backend-repo"
    Environment = var.environment
  }
}

# ECR Repository Policy
resource "aws_ecr_repository_policy" "backend" {
  repository = aws_ecr_repository.backend.name
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAppRunnerPull"
        Effect = "Allow"
        Principal = {
          Service = "apprunner.amazonaws.com"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
      }
    ]
  })
} 