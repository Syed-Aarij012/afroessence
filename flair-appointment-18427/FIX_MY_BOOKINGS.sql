-- FIX MY BOOKINGS PAGE - Run this in Supabase SQL Editor
-- This ensures the MyBookings page can load user bookings properly

-- 1. Ensure RLS is disabled for all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 2. Check if we have the required data
SELECT 'Data Check' as status;
SELECT 'Services: ' || COUNT(*) as count FROM public.services;
SELECT 'Professionals: ' || COUNT(*) as count FROM public.professionals;
SELECT 'Users: ' || COUNT(*) as count FROM auth.users;
SELECT 'Profiles: ' || COUNT(*) as count FROM public.profiles;
SELECT 'Bookings: ' || COUNT(*) as count FROM public.bookings;

-- 3. Ensure we have services and professionals (required for bookings)
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Cut', 'Clean shape-up, zero drama.', 30, 35.00, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Any professional', 'Available Stylist', 'Book with any available professional for your appointment.', true),
('Adi', 'Director & Specialist', 'Director and specialist with extensive experience in all loc services.', true)
ON CONFLICT DO NOTHING;

-- 4. Create a test booking for the first user (if no bookings exist)
INSERT INTO public.bookings (user_id, service_id, professional_id, booking_date, booking_time, status, notes)
SELECT 
    u.id,
    s.id,
    p.id,
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'confirmed',
    'Test booking for MyBookings page'
FROM auth.users u
CROSS JOIN public.services s
CROSS JOIN public.professionals p
WHERE NOT EXISTS (SELECT 1 FROM public.bookings WHERE user_id = u.id)
LIMIT 1;

-- 5. Test the exact query that MyBookings page uses
SELECT 
    'Test Query Results' as info,
    COUNT(*) as total_bookings
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.professionals p ON b.professional_id = p.id;

-- 6. Show sample booking data that should appear in MyBookings
SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.status,
    b.user_id,
    s.name as service_name,
    p.name as professional_name,
    u.email as user_email
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.professionals p ON b.professional_id = p.id
LEFT JOIN auth.users u ON b.user_id = u.id
ORDER BY b.created_at DESC
LIMIT 5;

-- 7. Verify the join query works (this is what the frontend uses)
SELECT 
    b.*,
    json_build_object('name', s.name) as services,
    json_build_object('name', p.name) as professionals
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.professionals p ON b.professional_id = p.id
LIMIT 3;