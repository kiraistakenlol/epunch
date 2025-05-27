-- User table
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    external_id TEXT UNIQUE,
    external_provider TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Merchant table
CREATE TABLE merchant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Loyalty Program table
CREATE TABLE loyalty_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_punches INTEGER NOT NULL,
    reward_description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Punch Card table
CREATE TYPE punch_card_status AS ENUM ('ACTIVE', 'REWARD_READY', 'REWARD_REDEEMED');

CREATE TABLE punch_card (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    loyalty_program_id UUID NOT NULL REFERENCES loyalty_program(id) ON DELETE CASCADE,
    current_punches INTEGER NOT NULL DEFAULT 0 CHECK (current_punches >= 0),
    status punch_card_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE punch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    punch_card_id UUID NOT NULL REFERENCES punch_card(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
); 