-- RBAC Foundation: Simple role-based access control

CREATE TABLE merchant_role (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE merchant_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
  login TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES merchant_role(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_login_per_merchant UNIQUE(merchant_id, login)
);

-- Indexes
CREATE INDEX idx_merchant_user_merchant_login ON merchant_user(merchant_id, login);
CREATE INDEX idx_merchant_user_merchant_id ON merchant_user(merchant_id);

-- Seed base roles 
INSERT INTO merchant_role (name) VALUES 
  ('admin'),
  ('staff'); 