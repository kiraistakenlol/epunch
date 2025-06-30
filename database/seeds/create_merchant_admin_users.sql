-- Script to create admin users for all existing merchants
-- Credentials: login=admin, password=admin
-- Date: 2024-12-29

DO $$
DECLARE
    merchant_record RECORD;
    admin_role_id UUID;
    admin_password_hash TEXT := '$2a$12$bYjR.kyyArOAQAT5sRZVU.8gvspYk416PATR.dewrW2p430ukt/Ja'; -- bcrypt hash for "admin"
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM merchant_role WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found. Please ensure merchant_role table is seeded.';
    END IF;
    
    -- Loop through all merchants and create admin users
    FOR merchant_record IN 
        SELECT id, name, slug FROM merchant 
    LOOP
        -- Check if admin user already exists for this merchant
        IF NOT EXISTS (
            SELECT 1 FROM merchant_user 
            WHERE merchant_id = merchant_record.id AND login = 'admin'
        ) THEN
            -- Create admin user for this merchant
            INSERT INTO merchant_user (
                merchant_id, 
                login, 
                password_hash, 
                role_id, 
                is_active
            ) VALUES (
                merchant_record.id,
                'admin',
                admin_password_hash,
                admin_role_id,
                true
            );
            
            RAISE NOTICE 'Created admin user for merchant: % (slug: %)', merchant_record.name, merchant_record.slug;
        ELSE
            RAISE NOTICE 'Admin user already exists for merchant: % (slug: %)', merchant_record.name, merchant_record.slug;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Admin user creation complete.';
END $$; 