-- TEST BOOKINGS DATA - Run this in Supabase SQL Editor
-- This will check if bookings exist and create test data if needed

-- 1. Check current data
SELECT 'Current Data Status' as info;
SELECT 'Bookings' as table_name, COUNT(*) as count FROM public.bookings;
SELECT 'Services' as table_name, COUNT(*) as count FROM public.services;
SELECT 'Professionals' as table_name, COUNT(*) as count FROM public.professionals;
SELECT 'Profiles' as table_name, COUNT(*) as count FROM public.profiles;

-- 2. Show existing bookings with details
SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.status,
    b.user_id,
    s.name as service_name,
    p.name as professional_name,
    pr.full_name as customer_name,
    pr.email as customer_email
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.professionals p ON b.professional_id = p.id
LEFT JOIN public.profiles pr ON b.user_id = pr.id
ORDER BY b.created_at DESC;

-- 3. Show all users who could have bookings
SELECT 
    u.id,
    u.email,
    pr.full_name,
    pr.phone
FROM auth.users u
LEFT JOIN public.profiles pr ON u.id = pr.id
ORDER BY u.created_at DESC;

-- 4. If no bookings exist, create some test bookings
-- First, get a user ID (replace with actual user ID from above query)
-- INSERT INTO public.bookings (user_id, service_id, professional_id, booking_date, booking_time, status, notes)
-- SELECT 
--     (SELECT id FROM auth.users LIMIT 1),
--     (SELECT id FROM public.services LIMIT 1),
--     (SELECT id FROM public.professionals LIMIT 1),
--     CURRENT_DATE + INTERVAL '1 day',
--     '10:00:00',
--     'confirmed',
--     'Test booking created for testing'
-- WHERE NOT EXISTS (SELECT 1 FROM public.bookings);

-- 5. Test the exact query used by MyBookings page
-- Replace USER_ID_HERE with actual user ID
-- SELECT 
--     b.*,
--     s.name as service_name,
--     p.name as professional_name
-- FROM public.bookings b
-- LEFT JOIN public.services s ON b.service_id = s.id
-- LEFT JOIN public.professionals p ON b.professional_id = p.id
-- WHERE b.user_id = 'USER_ID_HERE'
-- ORDER BY b.booking_date DESC;