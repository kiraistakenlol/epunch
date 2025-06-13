# Route 53 hosted zone - only create in prod, reference in dev
resource "aws_route53_zone" "main" {
  count = var.environment == "prod" ? 1 : 0
  name  = "epunch.app"

  tags = {
    Name        = "epunch-prod-zone"
    Environment = "shared"
  }
}

# Data source to reference existing hosted zone (for dev)
data "aws_route53_zone" "main" {
  count = var.environment == "dev" ? 1 : 0
  name  = "epunch.app"
}

# Local to get the correct zone ID based on environment
locals {
  zone_id = var.environment == "prod" ? aws_route53_zone.main[0].zone_id : data.aws_route53_zone.main[0].zone_id
}

# API domain in Route 53 - Certificate validation records for App Runner custom domain
resource "aws_route53_record" "api_validation" {
  for_each = {
    for record in aws_apprunner_custom_domain_association.backend.certificate_validation_records : record.name => record
  }
  
  zone_id = local.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.value]
  ttl     = 300
}

# API domain CNAME record - points to App Runner after validation
resource "aws_route53_record" "api" {
  depends_on = [aws_route53_record.api_validation]
  
  zone_id = local.zone_id
  name    = local.api_domain
  type    = "CNAME"
  ttl     = 300
  records = [aws_apprunner_custom_domain_association.backend.dns_target]
} 