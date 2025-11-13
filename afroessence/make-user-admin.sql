-- Make any user an admin
-- Replace 'YOUR_EMAIL_HERE' with the email you signed up with

INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.users.id AND role = 'admin'
);

-- Verify the admin role was granted
SELECT 
    u.email,
    ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'YOUR_EMAIL_HERE';