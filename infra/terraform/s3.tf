# S3 Bucket for merchant files
resource "aws_s3_bucket" "merchant_files" {
  bucket = "epunch-${var.environment}-merchant-files"
  tags = {
    Name        = "epunch-${var.environment}-merchant-files"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "merchant_files" {
  bucket = aws_s3_bucket.merchant_files.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "merchant_files" {
  bucket = aws_s3_bucket.merchant_files.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "merchant_files" {
  depends_on = [
    aws_s3_bucket_ownership_controls.merchant_files,
    aws_s3_bucket_public_access_block.merchant_files,
  ]

  bucket = aws_s3_bucket.merchant_files.id
  acl    = "public-read"
}

resource "aws_s3_bucket_cors_configuration" "merchant_files" {
  bucket = aws_s3_bucket.merchant_files.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "merchant_files_public_read" {
  bucket = aws_s3_bucket.merchant_files.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.merchant_files.arn}/*"
      }
    ]
  })
} 