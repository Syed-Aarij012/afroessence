-- Setup script for admin account and sample data
-- Run this in your Supabase SQL editor

-- First, let's insert some sample services
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
('Locs Maintenance', 'Professional locs maintenance and styling', 90, 45.00, true),
('Locs Retwist', 'Complete locs retwist service', 120, 60.00, true),
('Beard Trim', 'Professional beard trimming and styling', 30, 15.00, true),
('Haircut & Style', 'Complete haircut and styling service', 60, 25.00, true),
('Locs Wash & Style', 'Deep cleansing wash and styling for locs', 75, 35.00, true);

-- Insert sample professionals
INSERT INTO public.professionals (name, title, bio, is_active) VALUES
('Adisco Johnson', 'Master Locs Stylist', 'Over 10 years of experience in locs maintenance and styling. Specializes in all types of locs care.', true),
('Marcus Williams', 'Senior Barber', 'Expert barber with 8 years of experience. Specializes in modern cuts and beard styling.', true),
('Keisha Brown', 'Locs Specialist', 'Passionate about natural hair care with 6 years of experience in locs styling and maintenance.', true);

-- Note: To create the admin user, you need to:
-- 1. Sign up normally through the app with email: admin@adiscolocs.com and password: AdminLocs2024!
-- 2. Then run this query to give admin role (replace USER_ID with the actual user ID from auth.users):

-- First, find the user ID after signup:
-- SELECT id, email FROM auth.users WHERE email = 'admin@adiscolocs.com';

-- Then insert the admin role (replace 'USER_ID_HERE' with actual UUID):
-- INSERT INTO public.user_roles (user_id, role) VALUES ('USER_ID_HERE', 'admin');

-- Example (you'll need to replace with actual UUID):
-- INSERT INTO public.user_roles (user_id, role) VALUES ('12345678-1234-1234-1234-123456789012', 'admin');

-- You can also create a regular test user and some sample bookings for testing