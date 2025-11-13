-- Debug and Fix Script for User Profiles
-- Run this in Supabase SQL Editor

-- 1. Check if user_profiles table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. Check if user_role enum exists
SELECT enumlabel 
FROM pg_enum 
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
WHERE pg_type.typname = 'user_role';

-- 3. Check existing users in auth.users
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- 4. Check existing profiles
SELECT * FROM user_profiles;

-- 5. Check if trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 6. Check if function exists
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user';

-- If the above queries show missing components, run the sections below:

-- ===========================================
-- SETUP SECTION (Run if components are missing)
-- ===========================================

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'patient');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop and recreate user_profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow profile creation during signup" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create function to handle new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;

-- ===========================================
-- MANUAL ADMIN CREATION SECTION
-- ===========================================

-- Step 1: Find the admin user ID (look for admin@medifly.com)
-- You should see the user ID from the query above

-- Step 2: Manually create admin profile
-- Replace 'USER_ID_HERE' with the actual UUID from auth.users
/*
INSERT INTO user_profiles (id, email, full_name, role)
VALUES (
  'USER_ID_HERE',  -- Replace with actual user ID
  'admin@medifly.com',
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User';
*/

-- Alternative: Use this function to auto-find and create admin profile
CREATE OR REPLACE FUNCTION create_admin_profile()
RETURNS TEXT AS $$
DECLARE
  admin_user_id UUID;
  result_text TEXT;
BEGIN
  -- Find the admin user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@medifly.com';
  
  IF admin_user_id IS NULL THEN
    RETURN 'Admin user not found in auth.users. Please create the user first in Supabase Auth.';
  END IF;
  
  -- Create or update admin profile
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (admin_user_id, 'admin@medifly.com', 'Admin User', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Admin User',
    updated_at = NOW();
    
  RETURN 'Admin profile created successfully for user ID: ' || admin_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error creating admin profile: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run this to create the admin profile automatically
SELECT create_admin_profile();

-- Verify the admin profile was created
SELECT id, email, full_name, role, created_at 
FROM user_profiles 
WHERE email = 'admin@medifly.com';