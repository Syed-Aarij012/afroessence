-- TEST ADMIN SETUP - Complete test script
-- Run this ENTIRE script in Supabase SQL Editor to test admin functionality

-- 1. First, run the complete database setup (if not done already)
-- Copy and paste the COMPLETE_DATABASE_SETUP.sql content here first

-- 2. Create a test admin user (you can skip this if you already signed up)
-- Go to http://localhost:8082/auth and sign up with:
-- Email: admin@test.com
-- Password: password123
-- Full Name: Test Admin

-- 3. Grant admin role to the test user
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@test.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Create some test customers for the admin to manage
-- First, let's insert some test profiles manually
INSERT INTO public.profiles (id, full_name, email, phone, created_at) VALUES
(gen_random_uuid(), 'John Smith', 'john@example.com', '+1234567890', NOW() - INTERVAL '30 days'),
(gen_random_uuid(), 'Sarah Johnson', 'sarah@example.com', '+1234567891', NOW() - INTERVAL '25 days'),
(gen_random_uuid(), 'Mike Brown', 'mike@example.com', '+1234567892', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'Lisa Davis', 'lisa@example.com', '+1234567893', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'Tom Wilson', 'tom@example.com', '+1234567894', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- 5. Create some test bookings for these customers
WITH customer_ids AS (
  SELECT id, full_name FROM public.profiles 
  WHERE email IN ('john@example.com', 'sarah@example.com', 'mike@example.com', 'lisa@example.com', 'tom@example.com')
),
service_ids AS (
  SELECT id, name FROM public.services LIMIT 5
),
professional_ids AS (
  SELECT id, name FROM public.professionals LIMIT 3
)
INSERT INTO public.bookings (user_id, service_id, professional_id, booking_date, booking_time, status, notes, created_at)
SELECT 
  c.id,
  s.id,
  p.id,
  CURRENT_DATE + (RANDOM() * 30)::INTEGER,
  ('09:00:00'::TIME + (RANDOM() * INTERVAL '8 hours')),
  CASE 
    WHEN RANDOM() < 0.3 THEN 'pending'
    WHEN RANDOM() < 0.6 THEN 'confirmed'
    WHEN RANDOM() < 0.8 THEN 'completed'
    ELSE 'cancelled'
  END,
  'Test booking for ' || c.full_name,
  NOW() - (RANDOM() * INTERVAL '20 days')
FROM customer_ids c
CROSS JOIN service_ids s
CROSS JOIN professional_ids p
WHERE RANDOM() < 0.3  -- Only create some bookings, not all combinations
LIMIT 15;

-- 6. Verify the setup
SELECT 'Admin Users' as check_type, COUNT(*) as count 
FROM public.user_roles ur 
JOIN auth.users u ON ur.user_id = u.id 
WHERE ur.role = 'admin'

UNION ALL

SELECT 'Total Customers' as check_type, COUNT(*) as count 
FROM public.profiles

UNION ALL

SELECT 'Total Bookings' as check_type, COUNT(*) as count 
FROM public.bookings

UNION ALL

SELECT 'Pending Bookings' as check_type, COUNT(*) as count 
FROM public.bookings 
WHERE status = 'pending'

UNION ALL

SELECT 'Services Available' as check_type, COUNT(*) as count 
FROM public.services 
WHERE is_active = true

UNION ALL

SELECT 'Active Professionals' as check_type, COUNT(*) as count 
FROM public.professionals 
WHERE is_active = true;

-- 7. Test admin access query
SELECT 
  'Admin Access Test' as test_name,
  u.email,
  ur.role,
  'SUCCESS' as status
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
AND u.email = 'admin@test.com';

-- 8. Show sample data for admin panel testing
SELECT 
  'Sample Customer Data' as data_type,
  p.full_name,
  p.email,
  p.phone,
  COUNT(b.id) as total_bookings,
  COALESCE(SUM(s.price), 0) as total_spent
FROM public.profiles p
LEFT JOIN public.bookings b ON p.id = b.user_id AND b.status != 'cancelled'
LEFT JOIN public.services s ON b.service_id = s.id
GROUP BY p.id, p.full_name, p.email, p.phone
ORDER BY total_spent DESC
LIMIT 5;