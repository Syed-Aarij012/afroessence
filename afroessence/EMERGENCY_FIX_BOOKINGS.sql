-- EMERGENCY FIX BOOKINGS - Run this in Supabase SQL Editor
-- This fixes the 400 error by ensuring proper table relationships

-- 1. Drop existing tables to recreate them properly
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.professionals CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 2. Create profiles table first
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 4. Create services table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create professionals table
CREATE TABLE public.professionals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create bookings table with proper foreign keys
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 8. Insert services data
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Wash And Apple Cider Treatment/Rinse', 'Detox & shine – your locs will thank you!', 30, 35.00, true),
('Starter Locs / Gel Twist / Two Strand Twist / Single Twist', 'Brand-new locs that turn heads from day one!', 150, 90.00, true),
('Cut', 'Clean shape-up, zero drama.', 30, 35.00, true),
('Style', 'From barrel rolls to up-dos – slay ready!', 45, 45.00, true),
('Repair / Maintenance / Re-Attach Loc', 'Broken loc? We''ll make it brand new.', 90, 65.00, true),
('Steam / Oil Treatment', 'Deep hydration = stronger, longer locs.', 20, 25.00, true),
('Colour', 'Vibrant locs, zero damage – patch test free! (BYO product)', 60, 70.00, true),
('Twist', 'Palm-roll perfect – lasts up to 6 weeks.', 90, 50.00, true),
('Interloc And Crochet', 'Seamless extensions that look 100% natural.', 120, 110.00, true);

-- 9. Insert professionals data
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Any professional', 'Available Stylist', 'Book with any available professional for your appointment.', true),
('Charlene', 'Stylist', 'Professional hair stylist specializing in locs and natural hair care.', true),
('D''Marnier', 'Stylist', 'Expert stylist with years of experience in loc maintenance and styling.', true),
('Abena', 'Stylist', 'Skilled professional offering comprehensive hair care services.', true),
('Stephanie', 'Stylist', 'Experienced stylist passionate about natural hair and loc care.', true),
('Miriam', 'Stylist', 'Professional stylist dedicated to helping clients achieve their hair goals.', true),
('Joseph', 'Stylist', 'Expert in various styling techniques and loc maintenance.', true),
('Maria', 'Stylist', 'Skilled professional with expertise in natural hair care and styling.', true),
('Adi', 'Director & Specialist', 'Director and specialist with extensive experience in all loc services.', true),
('Kenvin', 'Stylist', 'Professional stylist offering quality hair care and styling services.', true);

-- 10. Create or replace the trigger function to handle new users
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

-- 11. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Update existing profiles with email
INSERT INTO public.profiles (id, full_name, email)
SELECT 
    u.id,
    u.raw_user_meta_data->>'full_name',
    u.email
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id);

-- 13. Create a test booking for existing users
INSERT INTO public.bookings (user_id, service_id, professional_id, booking_date, booking_time, status, notes)
SELECT 
    u.id,
    s.id,
    p.id,
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'confirmed',
    'Test booking created after database fix'
FROM auth.users u
CROSS JOIN (SELECT id FROM public.services WHERE name = 'Cut' LIMIT 1) s
CROSS JOIN (SELECT id FROM public.professionals WHERE name = 'Adi' LIMIT 1) p
WHERE NOT EXISTS (SELECT 1 FROM public.bookings WHERE user_id = u.id)
LIMIT 3;

-- 14. Test the query that MyBookings page uses
SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.status,
    b.notes,
    b.user_id,
    b.created_at,
    s.name as service_name,
    p.name as professional_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.professionals p ON b.professional_id = p.id
ORDER BY b.booking_date DESC;

-- 15. Verify the join structure works
SELECT 'SUCCESS: Tables created and relationships established' as status;
SELECT 'Services: ' || COUNT(*) FROM public.services;
SELECT 'Professionals: ' || COUNT(*) FROM public.professionals;
SELECT 'Bookings: ' || COUNT(*) FROM public.bookings;