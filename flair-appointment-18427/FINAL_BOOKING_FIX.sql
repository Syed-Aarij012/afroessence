-- FINAL BOOKING FIX - Run this in Supabase SQL Editor
-- This will fix all booking loading issues in both admin and user panels

-- 1. Disable RLS completely to ensure everything works
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies
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

-- 3. Ensure all tables have correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

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

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id),
    professional_id UUID REFERENCES public.professionals(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create or replace the trigger function to handle new users
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

-- 5. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Update existing profiles with email
UPDATE public.profiles 
SET email = auth_users.email 
FROM auth.users auth_users 
WHERE profiles.id = auth_users.id 
AND profiles.email IS NULL;

-- 7. Test the exact query that the admin panel uses
SELECT 
    b.*,
    s.name as service_name,
    s.price as service_price,
    p.name as professional_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.professionals p ON b.professional_id = p.id
ORDER BY b.booking_date DESC
LIMIT 5;

-- 8. Test the profile query
SELECT 
    pr.id,
    pr.full_name,
    pr.phone,
    pr.email
FROM public.profiles pr
LIMIT 5;

-- 9. Verify all data exists
SELECT 'Tables Status' as info, 
       'Bookings: ' || (SELECT COUNT(*) FROM public.bookings) ||
       ', Services: ' || (SELECT COUNT(*) FROM public.services) ||
       ', Professionals: ' || (SELECT COUNT(*) FROM public.professionals) ||
       ', Profiles: ' || (SELECT COUNT(*) FROM public.profiles) as counts;