-- Complete setup with default admin user and sample data
-- This will create everything needed for the admin panel

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

-- 3. Create default admin user (using auth.users directly)
-- Note: This creates a user with a known UUID for consistency
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@salon.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- 4. Create profile for admin user
INSERT INTO public.profiles (id, full_name, email, phone, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Admin User',
  'admin@salon.com',
  '+44 20 1234 5678',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Grant admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Create sample services
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Beard Trim', 'Professional beard trimming and styling', 30, 15.00, true),
('Haircut & Style', 'Complete haircut and styling service', 60, 25.00, true),
('Locs Wash & Style', 'Deep cleansing wash and styling for locs', 75, 35.00, true)
ON CONFLICT DO NOTHING;

-- 7. Create sample professionals
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Adisco Johnson', 'Master Locs Stylist', 'Over 10 years of experience in locs maintenance and styling. Specializes in all types of locs care.', true),
('Marcus Williams', 'Senior Barber', 'Expert barber with 8 years of experience. Specializes in modern cuts and beard styling.', true),
('Keisha Brown', 'Locs Specialist', 'Passionate about natural hair care with 6 years of experience in locs styling and maintenance.', true)
ON CONFLICT DO NOTHING;

-- 8. Create some sample customers for testing
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'john.doe@email.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "John Doe"}',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'sarah.wilson@email.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sarah Wilson"}',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-4444-444444444444',
  'authenticated',
  'authenticated',
  'mike.brown@email.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Mike Brown"}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 9. Create profiles for sample customers
INSERT INTO public.profiles (id, full_name, email, phone, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'John Doe', 'john.doe@email.com', '+44 20 7123 4567', NOW() - INTERVAL '30 days'),
('33333333-3333-3333-3333-333333333333', 'Sarah Wilson', 'sarah.wilson@email.com', '+44 20 7234 5678', NOW() - INTERVAL '15 days'),
('44444444-4444-4444-4444-444444444444', 'Mike Brown', 'mike.brown@email.com', '+44 20 7345 6789', NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- 10. Create sample bookings
INSERT INTO public.bookings (user_id, service_id, professional_id, booking_date, booking_time, status, notes, created_at)
SELECT 
  customer.id,
  service.id,
  professional.id,
  CURRENT_DATE + (CASE 
    WHEN customer.email = 'john.doe@email.com' THEN INTERVAL '2 days'
    WHEN customer.email = 'sarah.wilson@email.com' THEN INTERVAL '5 days'
    ELSE INTERVAL '7 days'
  END),
  (CASE 
    WHEN customer.email = 'john.doe@email.com' THEN '10:00:00'
    WHEN customer.email = 'sarah.wilson@email.com' THEN '14:30:00'
    ELSE '16:00:00'
  END)::TIME,
  (CASE 
    WHEN customer.email = 'john.doe@email.com' THEN 'confirmed'
    WHEN customer.email = 'sarah.wilson@email.com' THEN 'pending'
    ELSE 'completed'
  END),
  (CASE 
    WHEN customer.email = 'john.doe@email.com' THEN 'Regular customer, prefers morning appointments'
    WHEN customer.email = 'sarah.wilson@email.com' THEN 'First time customer'
    ELSE 'Completed last week'
  END),
  NOW() - (CASE 
    WHEN customer.email = 'john.doe@email.com' THEN INTERVAL '1 day'
    WHEN customer.email = 'sarah.wilson@email.com' THEN INTERVAL '2 hours'
    ELSE INTERVAL '7 days'
  END)
FROM 
  (SELECT id, email FROM auth.users WHERE email IN ('john.doe@email.com', 'sarah.wilson@email.com', 'mike.brown@email.com')) customer,
  (SELECT id FROM public.services LIMIT 1) service,
  (SELECT id FROM public.professionals LIMIT 1) professional
ON CONFLICT DO NOTHING;