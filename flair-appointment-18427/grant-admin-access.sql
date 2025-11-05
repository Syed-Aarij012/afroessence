-- Quick Admin Access Grant
-- Run this in Supabase SQL Editor AFTER signing up with admin@adiscolocs.com

-- This will automatically find the admin user and grant admin role
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@adiscolocs.com'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.users.id AND role = 'admin'
);

-- Verify the admin role was granted
SELECT 
    u.email,
    ur.role,
    ur.user_id
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@adiscolocs.com';