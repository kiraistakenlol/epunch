-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Merchants table
CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Loyalty Programs table
CREATE TABLE loyalty_programs (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_punches INTEGER NOT NULL CHECK (required_punches > 0),
    reward_description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Punch Cards table
CREATE TABLE punch_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    loyalty_program_id INTEGER NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    current_punches INTEGER NOT NULL DEFAULT 0 CHECK (current_punches >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Punches table (acts as a log of individual punch events)
CREATE TABLE punches (
    id SERIAL PRIMARY KEY,
    punch_card_id INTEGER NOT NULL REFERENCES punch_cards(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 