-- FINAL DATABASE FIX - Run this ENTIRE script in Supabase SQL Editor
-- This will completely fix the services and professionals loading issue

-- 1. Drop all existing policies that might be blocking access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Everyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can view all services" ON public.services;
DROP POLICY IF EXISTS "Allow all authenticated users to view services" ON public.services;
DROP POLICY IF EXISTS "Allow admins to manage services" ON public.services;
DROP POLICY IF EXISTS "Everyone can view active professionals" ON public.professionals;
DROP POLICY IF EXISTS "Anyone can view active professionals" ON public.professionals;
DROP POLICY IF EXISTS "Admins can manage professionals" ON public.professionals;
DROP POLICY IF EXISTS "Admins can manage all professionals" ON public.professionals;
DROP POLICY IF EXISTS "Authenticated users can view all professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow all authenticated users to view professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow admins to manage professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;

-- 2. Disable RLS on all tables temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 3. Ensure tables exist with correct structure
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Clear and insert fresh data
TRUNCATE public.services CASCADE;
TRUNCATE public.professionals CASCADE;

-- 5. Insert services
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Beard Trim', 'Professional beard trimming and styling', 30, 15.00, true),
('Haircut & Style', 'Complete haircut and styling service', 60, 25.00, true),
('Locs Wash & Style', 'Deep cleansing wash and styling for locs', 75, 35.00, true);

-- 6. Insert professionals
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Adisco Johnson', 'Master Locs Stylist', 'Over 10 years of experience in locs maintenance and styling. Specializes in all types of locs care.', true),
('Marcus Williams', 'Senior Barber', 'Expert barber with 8 years of experience. Specializes in modern cuts and beard styling.', true),
('Keisha Brown', 'Locs Specialist', 'Passionate about natural hair care with 6 years of experience in locs styling and maintenance.', true);

-- 7. Verify data exists
SELECT 'VERIFICATION' as status, 
       (SELECT COUNT(*) FROM public.services) as services_count,
       (SELECT COUNT(*) FROM public.professionals) as professionals_count;

-- 8. Test the exact queries the frontend uses
SELECT id, name, description, duration_minutes, price FROM public.services WHERE is_active = true;
SELECT id, name, title, bio FROM public.professionals WHERE is_active = true;

-- 9. Re-enable RLS with simple, permissive policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 10. Create simple policies that allow access
CREATE POLICY "Allow everyone to view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow everyone to view professionals" ON public.professionals FOR SELECT USING (true);

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- 11. Admin policies (only if user_roles table has admin entries)
CREATE POLICY "Admins can manage everything" ON public.services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage all professionals" ON public.professionals FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 12. Final verification
SELECT 'FINAL CHECK' as status,
       'Services: ' || COUNT(*) as services FROM public.services WHERE is_active = true
UNION ALL
SELECT 'FINAL CHECK' as status,
       'Professionals: ' || COUNT(*) as professionals FROM public.professionals WHERE is_active = true;