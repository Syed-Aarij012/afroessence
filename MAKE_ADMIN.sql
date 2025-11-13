-- Make a user an admin
-- Replace 'YOUR_EMAIL_HERE' with the email you'll use to sign up

-- Step 1: First, sign up on your website with your email
-- Step 2: Then run this query, replacing the email with yours:

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify admin was created:
SELECT u.email, ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
