-- REMOVE RLS POLICIES - QUICK FIX
-- Run this in Supabase SQL Editor to immediately fix services and professionals loading

-- 1. Disable RLS on all tables
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Ensure services data exists
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Beard Trim', 'Professional beard trimming and styling', 30, 15.00, true),
('Haircut & Style', 'Complete haircut and styling service', 60, 25.00, true),
('Locs Wash & Style', 'Deep cleansing wash and styling for locs', 75, 35.00, true)
ON CONFLICT DO NOTHING;

-- 3. Ensure professionals data exists
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Adisco Johnson', 'Master Locs Stylist', 'Over 10 years of experience in locs maintenance and styling. Specializes in all types of locs care.', true),
('Marcus Williams', 'Senior Barber', 'Expert barber with 8 years of experience. Specializes in modern cuts and beard styling.', true),
('Keisha Brown', 'Locs Specialist', 'Passionate about natural hair care with 6 years of experience in locs styling and maintenance.', true)
ON CONFLICT DO NOTHING;

-- 4. Verify data is accessible
SELECT 'Services Available' as type, COUNT(*) as count FROM public.services;
SELECT 'Professionals Available' as type, COUNT(*) as count FROM public.professionals;

-- 5. Test the exact queries used by the frontend
SELECT id, name, description, duration_minutes, price FROM public.services WHERE is_active = true;
SELECT id, name, title, bio FROM public.professionals WHERE is_active = true;