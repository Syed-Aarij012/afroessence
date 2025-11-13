-- Update schema to store email in profiles table for admin access
-- Run this in your Supabase SQL editor

-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the trigger function to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Update existing profiles with email (run this once)
-- This will populate email for existing users
UPDATE public.profiles 
SET email = auth_users.email 
FROM auth.users auth_users 
WHERE profiles.id = auth_users.id 
AND profiles.email IS NULL;

-- Create sample admin user manually (since we can't use admin functions from client)
-- You'll need to sign up through the app first, then run these queries:

-- 1. First sign up with email: admin@adiscolocs.com and password: AdminLocs2024!
-- 2. Then find the user ID and add admin role:

-- Find the admin user ID (run after signup):
-- SELECT id, email FROM auth.users WHERE email = 'admin@adiscolocs.com';

-- Add admin role (replace USER_ID with actual UUID from above query):
-- INSERT INTO public.user_roles (user_id, role) VALUES ('USER_ID_HERE', 'admin');

-- Sample services (if not already created)
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Beard Trim', 'Professional beard trimming and styling', 30, 15.00, true),
('Haircut & Style', 'Complete haircut and styling service', 60, 25.00, true),
('Locs Wash & Style', 'Deep cleansing wash and styling for locs', 75, 35.00, true)
ON CONFLICT DO NOTHING;

-- Sample professionals (if not already created)
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Adisco Johnson', 'Master Locs Stylist', 'Over 10 years of experience in locs maintenance and styling. Specializes in all types of locs care.', true),
('Marcus Williams', 'Senior Barber', 'Expert barber with 8 years of experience. Specializes in modern cuts and beard styling.', true),
('Keisha Brown', 'Locs Specialist', 'Passionate about natural hair care with 6 years of experience in locs styling and maintenance.', true)
ON CONFLICT DO NOTHING;