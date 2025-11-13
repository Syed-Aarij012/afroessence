-- REAL DATA SETUP - Your Actual Services and Professionals
-- Run this in Supabase SQL Editor to add your real business data

-- 1. First disable RLS to ensure everything works
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Clear existing data
DELETE FROM public.services;
DELETE FROM public.professionals;

-- 3. Insert your actual services
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

-- 4. Insert your actual professionals
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

-- 5. Verify all data was inserted correctly
SELECT 'SERVICES ADDED' as status, COUNT(*) as count FROM public.services;
SELECT 'PROFESSIONALS ADDED' as status, COUNT(*) as count FROM public.professionals;

-- 6. Show all services with pricing
SELECT 
    name as service_name,
    duration_minutes as duration_min,
    price as price_gbp,
    description
FROM public.services 
ORDER BY price;

-- 7. Show all professionals
SELECT 
    name as professional_name,
    title,
    bio
FROM public.professionals 
ORDER BY 
    CASE 
        WHEN name = 'Adi' THEN 1 
        WHEN name = 'Any professional' THEN 2
        ELSE 3 
    END,
    name;

-- 8. Test the frontend queries
SELECT id, name, description, duration_minutes, price FROM public.services WHERE is_active = true;
SELECT id, name, title, bio FROM public.professionals WHERE is_active = true;