-- DEBUG DATABASE - Run this in Supabase SQL Editor to check what's wrong

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'professionals', 'profiles', 'user_roles', 'bookings');

-- 2. Check if services data exists
SELECT COUNT(*) as total_services FROM public.services;
SELECT * FROM public.services LIMIT 5;

-- 3. Check if professionals data exists  
SELECT COUNT(*) as total_professionals FROM public.professionals;
SELECT * FROM public.professionals LIMIT 5;

-- 4. Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('services', 'professionals');

-- 5. Check current policies
SELECT tablename, policyname, cmd, permissive, roles, qual
FROM pg_policies 
WHERE tablename IN ('services', 'professionals');

-- 6. Test if we can select services (this should work)
SELECT id, name, price, is_active FROM public.services;

-- 7. Test if we can select professionals (this should work)
SELECT id, name, title, is_active FROM public.professionals;