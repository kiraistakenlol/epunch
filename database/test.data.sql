-- Insert test user
INSERT INTO "user" (id, created_at)
VALUES (gen_random_uuid(), NOW());

-- Store the user ID in a variable for reference
DO $$
DECLARE
    test_user_id UUID := (SELECT id FROM "user" ORDER BY created_at DESC LIMIT 1);
    coffee_shop_id UUID;
    coffee_loyalty_id UUID;
BEGIN
    -- Insert a merchant (Coffee Shop)
    INSERT INTO merchant (id, name, address, created_at)
    VALUES (gen_random_uuid(), 'Coffee Delight', '123 Main Street', NOW())
    RETURNING id INTO coffee_shop_id;
    
    -- Insert a loyalty program (Buy 10 coffees, get 1 free)
    INSERT INTO loyalty_program (id, merchant_id, name, description, required_punches, reward_description, created_at)
    VALUES (
        gen_random_uuid(),
        coffee_shop_id,
        'Coffee Lovers',
        'Collect punches with every coffee purchase',
        10,
        'One free coffee of your choice',
        NOW()
    )
    RETURNING id INTO coffee_loyalty_id;
    
    -- Insert first punch card (5 punches collected)
    INSERT INTO punch_card (id, user_id, loyalty_program_id, current_punches, created_at)
    VALUES (
        gen_random_uuid(),
        test_user_id,
        coffee_loyalty_id,
        5,
        NOW()
    );
    
    -- Insert second punch card (2 punches collected)
    INSERT INTO punch_card (id, user_id, loyalty_program_id, current_punches, created_at)
    VALUES (
        gen_random_uuid(),
        test_user_id,
        coffee_loyalty_id,
        2,
        NOW()
    );
    
    -- Output the test user ID for reference
    RAISE NOTICE 'Created test user with ID: %', test_user_id;
END $$;