-- Create missing profiles for users who have bookings but no profile

INSERT INTO profiles (id, full_name, phone, email, created_at, updated_at)
SELECT DISTINCT 
    b.user_id,
    'Customer ' || SUBSTRING(b.user_id::text, 1, 8) as full_name,
    '' as phone,
    COALESCE(au.email, '') as email,
    NOW() as created_at,
    NOW() as updated_at
FROM bookings b
LEFT JOIN profiles p ON b.user_id = p.id
LEFT JOIN auth.users au ON b.user_id = au.id
WHERE p.id IS NULL
AND b.user_id IS NOT NULL;