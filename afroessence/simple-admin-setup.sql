-- Simple Admin Setup - Run this in Supabase SQL Editor
-- This will work with any user you sign up normally

-- 1. Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Update the trigger function to store email
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

-- 3. Update existing profiles with email
UPDATE public.profiles 
SET email = auth_users.email 
FROM auth.users auth_users 
WHERE profiles.id = auth_users.id 
AND profiles.email IS NULL;

-- 4. Create sample services
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Beard Trim', 'Professional beard trimming and styling', 30, 15.00, true),
('Haircut & Style', 'Complete haircut and styling service', 60, 25.00, true),
('Locs Wash & Style', 'Deep cleansing wash and styling for locs', 75, 35.00, true)
ON CONFLICT DO NOTHING;

-- 5. Create sample professionals
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Adisco Johnson', 'Master Locs Stylist', 'Over 10 years of experience in locs maintenance and styling. Specializes in all types of locs care.', true),
('Marcus Williams', 'Senior Barber', 'Expert barber with 8 years of experience. Specializes in modern cuts and beard styling.', true),
('Keisha Brown', 'Locs Specialist', 'Passionate about natural hair care with 6 years of experience in locs styling and maintenance.', true)
ON CONFLICT DO NOTHING;

-- 6. AFTER you sign up with any email, run this to make that user an admin:
-- Replace 'your-email@example.com' with the email you used to sign up
-- INSERT INTO public.user_roles (user_id, role) 
-- SELECT id, 'admin'::app_role 
-- FROM auth.users 
-- WHERE email = 'your-email@example.com';

-- Example: If you sign up with test@admin.com, then run:
-- INSERT INTO public.user_roles (user_id, role) 
-- SELECT id, 'admin'::app_role 
-- FROM auth.users 
-- WHERE email = 'test@admin.com';