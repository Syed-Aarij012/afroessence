-- Debug queries to check database state

-- 1. Check if profiles table exists and has data
SELECT COUNT(*) as profile_count FROM profiles;
SELECT * FROM profiles LIMIT 5;

-- 2. Check bookings table
SELECT COUNT(*) as booking_count FROM bookings;
SELECT id, user_id, sub_service_id, service_id, booking_date, status FROM bookings LIMIT 5;

-- 3. Check if user_ids in bookings match profiles
SELECT 
  b.id as booking_id,
  b.user_id,
  p.full_name,
  p.email
FROM bookings b
LEFT JOIN profiles p ON b.user_id = p.id
LIMIT 10;

-- 4. Check today's bookings
SELECT COUNT(*) as todays_bookings 
FROM bookings 
WHERE booking_date = CURRENT_DATE;

-- 5. Check completed bookings for revenue
SELECT 
  b.id,
  b.status,
  b.sub_service_id,
  b.service_id,
  b.total_price,
  s.price as sub_service_price
FROM bookings b
LEFT JOIN sub_services s ON b.sub_service_id = s.id
WHERE b.status = 'completed';