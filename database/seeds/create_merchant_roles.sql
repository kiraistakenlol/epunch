-- Seed merchant roles
-- This should be run first before creating merchant users

INSERT INTO merchant_role (name) VALUES 
  ('admin'),
  ('staff')
ON CONFLICT (name) DO NOTHING; 