-- User table
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Merchant table
CREATE TABLE merchant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Loyalty Program table
CREATE TABLE loyalty_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_punches INTEGER NOT NULL CHECK (required_punches > 0),
    reward_description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Punch Card table
CREATE TABLE punch_card (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    loyalty_program_id UUID NOT NULL REFERENCES loyalty_program(id) ON DELETE CASCADE,
    current_punches INTEGER NOT NULL DEFAULT 0 CHECK (current_punches >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, loyalty_program_id) -- A user can only have one punch card per loyalty program
);

-- Punch table (acts as a log of individual punch events)
CREATE TABLE punch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    punch_card_id UUID NOT NULL REFERENCES punch_card(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Timestamp of when the punch was recorded
); 