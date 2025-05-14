-- Function to execute test data script
CREATE OR REPLACE FUNCTION execute_test_data_script()
RETURNS void AS $$
BEGIN
  -- Insert test user with specific ID
  INSERT INTO "user" (id, created_at)
  VALUES ('412dbe6d-e933-464e-87e2-31fe9c9ee6ac', NOW())
  ON CONFLICT (id) DO NOTHING;
    
  -- Get the user ID reference
  DECLARE
    test_user_id UUID := '412dbe6d-e933-464e-87e2-31fe9c9ee6ac';
    coffee_shop_id UUID;
    coffee_loyalty_id UUID;
    loyalty_required_punches INTEGER := 10; -- Match the loyalty program
  BEGIN
    -- Insert a merchant (Coffee Shop)
    INSERT INTO merchant (id, name, address, created_at)
    VALUES (gen_random_uuid(), 'Coffee Delight', '123 Main Street', NOW())
    RETURNING id INTO coffee_shop_id;
      
    -- Insert a loyalty program (Buy 10 coffees, get 1 free)
    INSERT INTO loyalty_program (id, merchant_id, name, description, required_punches, reward_description, created_at)
    VALUES (
      gen_random_uuid(), -- Use gen_random_uuid() for ID to ensure it can be re-run if IDs are not hardcoded elsewhere
      coffee_shop_id,
      'Coffee Lovers',
      'Collect punches with every coffee purchase',
      loyalty_required_punches,
      'One free coffee of your choice',
      NOW()
    )
    RETURNING id INTO coffee_loyalty_id;
      
    -- Insert first punch card (5 punches collected, ACTIVE)
    INSERT INTO punch_card (id, user_id, loyalty_program_id, current_punches, status, created_at)
    VALUES (
      gen_random_uuid(),
      test_user_id,
      coffee_loyalty_id,
      5,
      'ACTIVE', -- Explicitly set status
      NOW()
    );
      
    -- Insert second punch card (10 punches collected, REWARD_READY)
    INSERT INTO punch_card (id, user_id, loyalty_program_id, current_punches, status, created_at)
    VALUES (
      gen_random_uuid(),
      test_user_id,
      coffee_loyalty_id,
      loyalty_required_punches, -- Set to required punches for REWARD_READY
      'REWARD_READY', -- Explicitly set status
      NOW()
    );

    -- Optional: Insert a third punch card that is REWARD_REDEEMED
    INSERT INTO punch_card (id, user_id, loyalty_program_id, current_punches, status, created_at)
    VALUES (
      gen_random_uuid(),
      test_user_id,
      coffee_loyalty_id,
      loyalty_required_punches, -- Could be 0 or required_punches, depending on reset logic
      'REWARD_REDEEMED', -- Explicitly set status
      NOW()
    );
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to reset test data
CREATE OR REPLACE FUNCTION reset_test_data()
RETURNS void AS $$
BEGIN
  -- Delete all punch cards for the test user
  DELETE FROM punch_card
  WHERE user_id = '412dbe6d-e933-464e-87e2-31fe9c9ee6ac';
  
  -- Delete all loyalty programs for merchants created by test script
  DELETE FROM loyalty_program
  WHERE merchant_id IN (
    SELECT id FROM merchant
    WHERE name = 'Coffee Delight' AND address = '123 Main Street'
  );
  
  -- Delete the test merchants
  DELETE FROM merchant
  WHERE name = 'Coffee Delight' AND address = '123 Main Street';
  
  -- Note: We're not deleting the test user itself to preserve the ID
END;
$$ LANGUAGE plpgsql; 