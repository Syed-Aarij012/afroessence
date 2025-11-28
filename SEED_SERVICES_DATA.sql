-- Sample data based on the Treatwell structure
-- This is a subset - you can add all services following this pattern

-- 1. Insert Service Categories
INSERT INTO service_categories (name, description, display_order) VALUES
('Ladies - Hair Treatments', 'Professional hair treatments for ladies', 1),
('Ladies - Haircuts & Hairdressing', 'Haircuts and styling services', 2),
('Ladies - Braids, Cornrows & Twists', 'Braiding and twisting services', 3),
('Men - Braids, Cornrows & Twists', 'Braiding services for men', 4),
('Eyebrows & Eyelashes', 'Brow and lash services', 5),
('Classic Massages', 'Relaxing massage treatments', 6),
('Children - Haircuts & Hairdressing', 'Hair services for children', 7),
('Children - Braids, Cornrows & Twists', 'Braiding services for children', 8),
('Ladies - Weaves & Wigs', 'Weave and wig installation', 9),
('Patch Test', 'Required patch test', 10);

-- 2. Insert Primary Services (Examples)
-- Category 1: Ladies - Hair Treatments
INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Ladies - Afro Relaxer', 'Afro relaxer treatments', 1
FROM service_categories WHERE name = 'Ladies - Hair Treatments';

INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Ladies - Hair Conditioning & Scalp Treatment', 'Deep conditioning and scalp care', 2
FROM service_categories WHERE name = 'Ladies - Hair Treatments';

-- Category 3: Ladies - Braids, Cornrows & Twists
INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Ladies - Cornrows', 'Cornrow braiding styles', 1
FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Ladies - Box Braids', 'Box braid styles', 2
FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Ladies - Twists', 'Twist styles', 3
FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Ladies - Afro Braids', 'African braiding styles', 4
FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

-- 3. Insert Sub-Services (Bookable items with price and duration)
-- Afro Relaxer sub-services
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro Retouch (Relaxer inclusive)', 90, 100.00, 1
FROM primary_services WHERE name = 'Ladies - Afro Relaxer';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro retouch, treat and trim', 150, 135.00, 2
FROM primary_services WHERE name = 'Ladies - Afro Relaxer';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro Retouch and set', 180, 150.00, 3
FROM primary_services WHERE name = 'Ladies - Afro Relaxer';

-- Hair Conditioning sub-service
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Hair Conditioning & Scalp Treatment', 120, 67.50, 1
FROM primary_services WHERE name = 'Ladies - Hair Conditioning & Scalp Treatment';

-- Cornrows sub-services
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '4/8 cornrows (Plain)', 120, 35.00, 1
FROM primary_services WHERE name = 'Ladies - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '10+ Cornrows (plain)', 120, 50.00, 2
FROM primary_services WHERE name = 'Ladies - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Corn Row + extension', 90, 55.00, 3
FROM primary_services WHERE name = 'Ladies - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'CornRow with Design + extensions', 120, 80.00, 4
FROM primary_services WHERE name = 'Ladies - Cornrows';

-- Box Braids sub-services
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Box Braids (B) + extensions', 360, 105.00, 1
FROM primary_services WHERE name = 'Ladies - Box Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Jumbo box Braids + extensions', 180, 105.00, 2
FROM primary_services WHERE name = 'Ladies - Box Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Box Braid (S/M) + extensions', 600, 200.00, 3
FROM primary_services WHERE name = 'Ladies - Box Braids';

-- Twists sub-services
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Natural hair Twist', 240, 100.00, 1
FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Twist + extension', 360, 145.00, 2
FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro/Marley Twist + extension', 360, 155.00, 3
FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Mini twist with extension', 480, 170.00, 4
FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Micro Twist + extension', 600, 300.00, 5
FROM primary_services WHERE name = 'Ladies - Twists';

-- Afro Braids sub-services (showing a few examples)
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ghana weave Allback (B)', 240, 85.00, 1
FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ghana weave Shuku (B)', 240, 85.00, 2
FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Crochet Braids', 180, 100.00, 3
FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Knotless Braids (B) + extension', 360, 140.00, 4
FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Goddess/Boho Braids (B) + extension/human hair bulk', 600, 232.00, 5
FROM primary_services WHERE name = 'Ladies - Afro Braids';

-- Add more services following the same pattern...
