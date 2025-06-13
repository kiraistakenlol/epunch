# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "epunch-${var.environment}-rds-sg"
  description = "Allow all inbound traffic to PostgreSQL"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "epunch-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

# Security Group for general access
resource "aws_security_group" "allow_all" {
  name        = "epunch-${var.environment}-allow-all-sg"
  description = "Allow all traffic"

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "epunch-${var.environment}-allow-all-sg"
    Environment = var.environment
  }
} 