-- Create sample customers and bookings for testing
-- Run this AFTER setting up the admin user

-- First, let's create some sample customer profiles manually
-- (These will be customers without auth accounts, just for display purposes)

-- Insert sample customer profiles
INSERT INTO public.profiles (id, full_name, email, phone, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John Smith', 'john.smith@email.com', '+44 20 7123 4567', NOW() - INTERVAL '30 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sarah Johnson', 'sarah.johnson@email.com', '+44 20 7234 5678', NOW() - INTERVAL '15 days'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Michael Brown', 'michael.brown@email.com', '+44 20 7345 6789', NOW() - INTERVAL '7 days'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Emma Wilson', 'emma.wilson@email.com', '+44 20 7456 7890', NOW() - INTERVAL '3 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'David Davis', 'david.davis@email.com', '+44 20 7567 8901', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Create sample bookings using the services and professionals we created
INSERT INTO public.bookings (user_id, service_id, professional_id, booking_date, booking_time, status, notes, created_at)
SELECT 
    customer_id,
    service.id,
    professional.id,
    booking_date,
    booking_time,
    status,
    notes,
    created_at
FROM (
    VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE + INTERVAL '2 days', '10:00:00'::TIME, 'confirmed', 'Regular customer, prefers morning appointments', NOW() - INTERVAL '1 day'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE + INTERVAL '3 days', '14:30:00'::TIME, 'pending', 'First time customer, needs consultation', NOW() - INTERVAL '2 hours'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE - INTERVAL '1 day', '16:00:00'::TIME, 'completed', 'Satisfied with service', NOW() - INTERVAL '2 days'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_DATE + INTERVAL '5 days', '11:30:00'::TIME, 'confirmed', 'Wants locs retwist', NOW() - INTERVAL '3 hours'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', CURRENT_DATE + INTERVAL '1 day', '15:00:00'::TIME, 'pending', 'New customer referral', NOW() - INTERVAL '30 minutes')
) AS sample_bookings(customer_id, booking_date, booking_time, status, notes, created_at)
CROSS JOIN (SELECT id FROM public.services ORDER BY RANDOM() LIMIT 1) service
CROSS JOIN (SELECT id FROM public.professionals ORDER BY RANDOM() LIMIT 1) professional
ON CONFLICT DO NOTHING;