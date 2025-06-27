# App configurations
locals {
  apps = {
    user = {
      name = "user-app"
      build_directory = "user-app"
      environment_variables = {
        VITE_API_URL                     = "https://${local.api_domain}/api/v1"
        VITE_AWS_REGION                  = var.aws_region
        VITE_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.main.id
        VITE_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.main.id
        VITE_COGNITO_DOMAIN              = "${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
      }
      custom_domain_prefix = var.environment == "prod" ? "" : "dev"
    }
    merchant = {
      name = "merchant-app"
      build_directory = "merchant-app"
      environment_variables = {
        VITE_API_URL      = "https://${local.api_domain}/api/v1"
        VITE_AWS_REGION   = var.aws_region
        VITE_USER_APP_URL = var.user_app_url
      }
      custom_domain_prefix = var.environment == "prod" ? "merchant" : "dev-merchant"
    }
    admin = {
      name = "admin-app"
      build_directory = "admin-app"
      environment_variables = {
        VITE_API_URL = "https://${local.api_domain}/api/v1"
      }
      custom_domain_prefix = var.environment == "prod" ? "admin" : "dev-admin"
    }
  }
}

# Amplify Apps
resource "aws_amplify_app" "apps" {
  for_each = local.apps
  
  name       = "epunch-${var.environment}-${each.value.name}"
  repository = "https://github.com/kiraistakenlol/narrow-ai-epunch"
  
  access_token = var.github_token
  
  build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - yarn install
                - yarn workspace e-punch-common-core build
                - yarn workspace e-punch-common-ui build
            build:
              commands:
                - cd ${each.value.build_directory}
                - yarn build
          artifacts:
            baseDirectory: ${each.value.build_directory}/dist
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
              - ${each.value.build_directory}/node_modules/**/*
        appRoot: application
  EOT
  
  # SPA routing configuration
  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json|mp4|mov|webm|avi)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }
  
  environment_variables = each.value.environment_variables
  
  tags = {
    Name        = "epunch-${var.environment}-${each.value.name}"
    Environment = var.environment
  }
}

# Amplify Branches
resource "aws_amplify_branch" "main" {
  for_each = local.apps
  
  app_id      = aws_amplify_app.apps[each.key].id
  branch_name = var.environment == "prod" ? "master" : "dev"
  
  framework = "React"
  stage     = var.environment == "prod" ? "PRODUCTION" : "DEVELOPMENT"
}

# Custom Domain Associations
resource "aws_amplify_domain_association" "apps" {
  for_each = local.apps
  
  app_id      = aws_amplify_app.apps[each.key].id
  domain_name = "epunch.app"

  sub_domain {
    branch_name = aws_amplify_branch.main[each.key].branch_name
    prefix      = each.value.custom_domain_prefix
  }
} 