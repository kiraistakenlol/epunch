-- Script to create staff users for all existing merchants
-- Credentials: login=staff, password=staff
-- Date: 2024-12-29

DO $$
DECLARE
    merchant_record RECORD;
    staff_role_id UUID;
    staff_password_hash TEXT := '$2a$12$OwkYZLJvq4ikQMdeauD1auZERIhCwQBi5cl0dgbqGGM3jGDhXreqq'; -- bcrypt hash for "password"
BEGIN
    -- Get the staff role ID
    SELECT id INTO staff_role_id FROM merchant_role WHERE name = 'staff';
    
    IF staff_role_id IS NULL THEN
        RAISE EXCEPTION 'Staff role not found. Please ensure merchant_role table is seeded.';
    END IF;
    
    -- Loop through all merchants and create staff users
    FOR merchant_record IN 
        SELECT id, name, slug FROM merchant 
    LOOP
        -- Check if staff user already exists for this merchant
        IF NOT EXISTS (
            SELECT 1 FROM merchant_user 
            WHERE merchant_id = merchant_record.id AND login = 'staff'
        ) THEN
            -- Create staff user for this merchant
            INSERT INTO merchant_user (
                merchant_id, 
                login, 
                password_hash, 
                role_id, 
                is_active
            ) VALUES (
                merchant_record.id,
                'staff',
                staff_password_hash,
                staff_role_id,
                true
            );
            
            RAISE NOTICE 'Created staff user for merchant: % (slug: %)', merchant_record.name, merchant_record.slug;
        ELSE
            RAISE NOTICE 'Staff user already exists for merchant: % (slug: %)', merchant_record.name, merchant_record.slug;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Staff user creation complete.';
END $$; 