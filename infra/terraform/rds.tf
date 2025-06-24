# RDS PostgreSQL instance
resource "aws_db_instance" "main" {
  identifier = "epunch-${var.environment}-database"
  
  engine         = "postgres"
  engine_version = "17.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 20
  storage_type          = "gp2"
  storage_encrypted     = false
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  publicly_accessible = true
  skip_final_snapshot = true
  
  vpc_security_group_ids = [aws_security_group.allow_all.id]
  
  tags = {
    Name        = "epunch-${var.environment}-database"
    Environment = var.environment
  }
} 