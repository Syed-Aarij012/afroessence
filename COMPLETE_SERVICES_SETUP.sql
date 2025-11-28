-- COMPLETE SERVICE SETUP FOR AFROESSENCE
-- Run this entire file in Supabase SQL Editor

-- Step 1: Create Tables
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS primary_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sub_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_service_id UUID REFERENCES primary_services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sub_service_id to bookings if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sub_service_id UUID REFERENCES sub_services(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price DECIMAL(10, 2);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_primary_services_category ON primary_services(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_services_primary ON sub_services(primary_service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_sub_service ON bookings(sub_service_id);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE primary_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public can view active categories" ON service_categories;
DROP POLICY IF EXISTS "Public can view active primary services" ON primary_services;
DROP POLICY IF EXISTS "Public can view active sub-services" ON sub_services;

CREATE POLICY "Public can view active categories" ON service_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active primary services" ON primary_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active sub-services" ON sub_services
  FOR SELECT USING (is_active = true);

-- Step 2: Insert Categories
INSERT INTO service_categories (name, description, display_order) VALUES
('Ladies - Hair Treatments', 'Professional hair treatments', 1),
('Ladies - Haircuts & Hairdressing', 'Haircuts and styling', 2),
('Ladies - Braids, Cornrows & Twists', 'Braiding and twisting', 3),
('Men - Braids, Cornrows & Twists', 'Braiding for men', 4),
('Eyebrows & Eyelashes', 'Brow and lash services', 5),
('Classic Massages', 'Massage treatments', 6),
('Children - Haircuts & Hairdressing', 'Hair services for children', 7),
('Children - Braids, Cornrows & Twists', 'Braiding for children', 8),
('Ladies - Weaves & Wigs', 'Weave and wig installation', 9),
('Patch Test', 'Required patch test', 10)
ON CONFLICT DO NOTHING;

-- Step 3: Insert Primary Services

-- Category 1: Ladies - Hair Treatments
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Afro Relaxer', 1 FROM service_categories WHERE name = 'Ladies - Hair Treatments';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Hair Conditioning & Scalp Treatment', 2 FROM service_categories WHERE name = 'Ladies - Hair Treatments';

-- Category 2: Ladies - Haircuts & Hairdressing
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Wash & Blow Dry', 1 FROM service_categories WHERE name = 'Ladies - Haircuts & Hairdressing';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Wash & Blow Dry (Afro Hair)', 2 FROM service_categories WHERE name = 'Ladies - Haircuts & Hairdressing';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Shampoo & Set', 3 FROM service_categories WHERE name = 'Ladies - Haircuts & Hairdressing';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Wash, Haircut & Blow Dry (Afro Hair)', 4 FROM service_categories WHERE name = 'Ladies - Haircuts & Hairdressing';

-- Category 3: Ladies - Braids, Cornrows & Twists
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Cornrows', 1 FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Box Braids', 2 FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Twists', 3 FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Afro Braids', 4 FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Afro Braids Undo', 5 FROM service_categories WHERE name = 'Ladies - Braids, Cornrows & Twists';

-- Category 4: Men - Braids, Cornrows & Twists
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Men - Twists', 1 FROM service_categories WHERE name = 'Men - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Men - Afro Braids', 2 FROM service_categories WHERE name = 'Men - Braids, Cornrows & Twists';

-- Category 5: Eyebrows & Eyelashes
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Eyebrow Shape/lift/tint', 1 FROM service_categories WHERE name = 'Eyebrows & Eyelashes';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Eyebrow Wax & Tint', 2 FROM service_categories WHERE name = 'Eyebrows & Eyelashes';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Brow Lamination', 3 FROM service_categories WHERE name = 'Eyebrows & Eyelashes';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Brow Lamination & Tint', 4 FROM service_categories WHERE name = 'Eyebrows & Eyelashes';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Henna Brows', 5 FROM service_categories WHERE name = 'Eyebrows & Eyelashes';

-- Category 6: Classic Massages
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Back, Neck & Shoulders Massage', 1 FROM service_categories WHERE name = 'Classic Massages';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Head Massage', 2 FROM service_categories WHERE name = 'Classic Massages';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Foot Massage', 3 FROM service_categories WHERE name = 'Classic Massages';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Hand Massage', 4 FROM service_categories WHERE name = 'Classic Massages';

-- Category 7: Children - Haircuts & Hairdressing
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Girls - Wash & Blow Dry', 1 FROM service_categories WHERE name = 'Children - Haircuts & Hairdressing';

-- Category 8: Children - Braids, Cornrows & Twists
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Children - Afro Braids', 1 FROM service_categories WHERE name = 'Children - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Children - Cornrows', 2 FROM service_categories WHERE name = 'Children - Braids, Cornrows & Twists';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Children - Twists', 3 FROM service_categories WHERE name = 'Children - Braids, Cornrows & Twists';

-- Category 9: Ladies - Weaves & Wigs
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Full Head Weave', 1 FROM service_categories WHERE name = 'Ladies - Weaves & Wigs';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Frontal installation/styling', 2 FROM service_categories WHERE name = 'Ladies - Weaves & Wigs';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Closure wig install', 3 FROM service_categories WHERE name = 'Ladies - Weaves & Wigs';

INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Ladies - Half braids/sew in', 4 FROM service_categories WHERE name = 'Ladies - Weaves & Wigs';

-- Category 10: Patch Test
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Patch Test', 1 FROM service_categories WHERE name = 'Patch Test';

-- Step 4: Insert Sub-Services (Bookable Items)

-- 1. Ladies - Afro Relaxer
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro Retouch (Relaxer inclusive)', 90, 100.00, 1 FROM primary_services WHERE name = 'Ladies - Afro Relaxer';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro retouch, treat and trim', 150, 135.00, 2 FROM primary_services WHERE name = 'Ladies - Afro Relaxer';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro Retouch and set', 180, 150.00, 3 FROM primary_services WHERE name = 'Ladies - Afro Relaxer';

-- 2. Ladies - Hair Conditioning & Scalp Treatment
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Hair Conditioning & Scalp Treatment', 120, 67.50, 1 FROM primary_services WHERE name = 'Ladies - Hair Conditioning & Scalp Treatment';

-- 3. Ladies - Wash & Blow Dry
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Wash & Blow Dry', 60, 47.00, 1 FROM primary_services WHERE name = 'Ladies - Wash & Blow Dry';

-- 4. Ladies - Wash & Blow Dry (Afro Hair)
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Wash & Blow Dry (Afro Hair)', 60, 47.00, 1 FROM primary_services WHERE name = 'Ladies - Wash & Blow Dry (Afro Hair)';

-- 5. Ladies - Shampoo & Set
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Shampoo & Set', 120, 130.00, 1 FROM primary_services WHERE name = 'Ladies - Shampoo & Set';

-- 6. Ladies - Wash, Haircut & Blow Dry (Afro Hair)
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Wash, trim and blow dry', 60, 52.99, 1 FROM primary_services WHERE name = 'Ladies - Wash, Haircut & Blow Dry (Afro Hair)';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Hair straightening (silk press)', 150, 58.75, 2 FROM primary_services WHERE name = 'Ladies - Wash, Haircut & Blow Dry (Afro Hair)';

-- 7. Ladies - Cornrows
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '4/8 cornrows (Plain)', 120, 35.00, 1 FROM primary_services WHERE name = 'Ladies - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '10+ Cornrows (plain)', 120, 50.00, 2 FROM primary_services WHERE name = 'Ladies - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Corn Row + extension', 90, 55.00, 3 FROM primary_services WHERE name = 'Ladies - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'CornRow with Design + extensions', 120, 80.00, 4 FROM primary_services WHERE name = 'Ladies - Cornrows';

-- 8. Ladies - Box Braids
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Box Braids (B) + extensions', 360, 105.00, 1 FROM primary_services WHERE name = 'Ladies - Box Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Jumbo box Braids + extensions', 180, 105.00, 2 FROM primary_services WHERE name = 'Ladies - Box Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Box Braid (S/M) + extensions', 600, 200.00, 3 FROM primary_services WHERE name = 'Ladies - Box Braids';

-- 9. Ladies - Twists
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Natural hair Twist', 240, 100.00, 1 FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Twist + extension', 360, 145.00, 2 FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro/Marley Twist + extension', 360, 155.00, 3 FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Mini twist with extension', 480, 170.00, 4 FROM primary_services WHERE name = 'Ladies - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Micro Twist + extension', 600, 300.00, 5 FROM primary_services WHERE name = 'Ladies - Twists';

-- 10. Ladies - Afro Braids
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ghana weave Allback (B)', 240, 85.00, 1 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ghana weave Shuku (B)', 240, 85.00, 2 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Crochet Braids', 180, 100.00, 3 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Single plait', 240, 100.00, 4 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Half cornrow/Braids + extension', 420, 130.00, 5 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ghana weave Allback (S/M) + extension', 360, 140.00, 6 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ghana weave shuku (S/M) + extension', 360, 140.00, 7 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Knotless Braids (B) + extension', 360, 140.00, 8 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Styled Cornrow/Braids + extension', 420, 140.00, 9 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Knotless with curls + extensions', 480, 190.00, 10 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'French curls + extensions', 600, 200.00, 11 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Knotless Braids (S/M) + extensions', 600, 200.00, 12 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Loose Box/knotless braids (B)', 600, 220.00, 13 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Goddess/Boho Braids (B) + extension/human hair bulk', 600, 232.00, 14 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Loose Box/knotless braids', 600, 235.00, 15 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'French curl Boho + bone straight braiding extensions', 600, 256.00, 16 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Goddess/Boho Braids (S/M) + extensions/human hair bulk', 600, 300.00, 17 FROM primary_services WHERE name = 'Ladies - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Bora Bora + extensions/human hair bulk', 600, 385.00, 18 FROM primary_services WHERE name = 'Ladies - Afro Braids';

-- 11. Ladies - Afro Braids Undo
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro Braids Undo', 300, 50.00, 1 FROM primary_services WHERE name = 'Ladies - Afro Braids Undo';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Afro braids undo, wash/blow dry', 300, 90.00, 2 FROM primary_services WHERE name = 'Ladies - Afro Braids Undo';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Mini/Micro braids undo', 300, 100.00, 3 FROM primary_services WHERE name = 'Ladies - Afro Braids Undo';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Mini/Micro braids undo, wash and blowdry', 300, 135.00, 4 FROM primary_services WHERE name = 'Ladies - Afro Braids Undo';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Natural Boho Braids (B)', 300, 160.00, 5 FROM primary_services WHERE name = 'Ladies - Afro Braids Undo';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Natural Boho Braids (S/M)', 300, 180.00, 6 FROM primary_services WHERE name = 'Ladies - Afro Braids Undo';

-- 12. Men - Twists
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '2 strand Twist', 180, 100.00, 1 FROM primary_services WHERE name = 'Men - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Double strand Twist', 180, 120.00, 2 FROM primary_services WHERE name = 'Men - Twists';

-- 13. Men - Afro Braids
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Hair Detangling', 180, 35.00, 1 FROM primary_services WHERE name = 'Men - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Single plaits', 180, 100.00, 2 FROM primary_services WHERE name = 'Men - Afro Braids';

-- 14. Eyebrow Shape/lift/tint
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow shape', 10, 10.00, 1 FROM primary_services WHERE name = 'Eyebrow Shape/lift/tint';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow shape & lift', 20, 13.50, 2 FROM primary_services WHERE name = 'Eyebrow Shape/lift/tint';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow shape & Tint', 30, 30.00, 3 FROM primary_services WHERE name = 'Eyebrow Shape/lift/tint';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow shaping/lift & Tint', 45, 35.00, 4 FROM primary_services WHERE name = 'Eyebrow Shape/lift/tint';

-- 15. Eyebrow Wax & Tint
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow wax', 30, 7.00, 1 FROM primary_services WHERE name = 'Eyebrow Wax & Tint';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow wax & tint', 30, 30.00, 2 FROM primary_services WHERE name = 'Eyebrow Wax & Tint';

-- 16. Brow Lamination
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow Lamination', 45, 30.00, 1 FROM primary_services WHERE name = 'Brow Lamination';

-- 17. Brow Lamination & Tint
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Brow Lamination & Tint', 60, 45.00, 1 FROM primary_services WHERE name = 'Brow Lamination & Tint';

-- 18. Henna Brows
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Henna Brows', 20, 25.00, 1 FROM primary_services WHERE name = 'Henna Brows';

-- 19. Back, Neck & Shoulders Massage
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '30 minutes', 30, 33.00, 1 FROM primary_services WHERE name = 'Back, Neck & Shoulders Massage';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '1 hour', 60, 65.00, 2 FROM primary_services WHERE name = 'Back, Neck & Shoulders Massage';

-- 20. Head Massage
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '30 minutes', 30, 25.00, 1 FROM primary_services WHERE name = 'Head Massage';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '1 hour', 60, 45.00, 2 FROM primary_services WHERE name = 'Head Massage';

-- 21. Foot Massage
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '15 minutes', 15, 20.00, 1 FROM primary_services WHERE name = 'Foot Massage';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, '30 minutes', 30, 35.00, 2 FROM primary_services WHERE name = 'Foot Massage';

-- 22. Hand Massage
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Hand Massage (15-30 mins)', 22, 20.00, 1 FROM primary_services WHERE name = 'Hand Massage';

-- 23. Girls - Wash & Blow Dry
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Girls - Wash & Blow Dry', 30, 35.00, 1 FROM primary_services WHERE name = 'Girls - Wash & Blow Dry';

-- 24. Children - Afro Braids
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Single/braids (no extensions)', 360, 75.00, 1 FROM primary_services WHERE name = 'Children - Afro Braids';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Single/braids (extensions)', 360, 85.00, 2 FROM primary_services WHERE name = 'Children - Afro Braids';

-- 25. Children - Cornrows
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Cornrows (Afro hair)', 90, 35.00, 1 FROM primary_services WHERE name = 'Children - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Cornrows (other hair type)', 90, 45.00, 2 FROM primary_services WHERE name = 'Children - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Cornrows with extension (extension not included)', 90, 45.00, 3 FROM primary_services WHERE name = 'Children - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Design Cornrows', 90, 65.00, 4 FROM primary_services WHERE name = 'Children - Cornrows';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Design cornrows with extensions (extension not included)', 90, 75.00, 5 FROM primary_services WHERE name = 'Children - Cornrows';

-- 26. Children - Twists
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Twist (no extensions)', 360, 70.00, 1 FROM primary_services WHERE name = 'Children - Twists';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Twist (extension)', 360, 90.00, 2 FROM primary_services WHERE name = 'Children - Twists';

-- 27. Ladies - Full Head Weave
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Crochet install', 180, 100.00, 1 FROM primary_services WHERE name = 'Ladies - Full Head Weave';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Closure sew in', 180, 150.00, 2 FROM primary_services WHERE name = 'Ladies - Full Head Weave';

INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Frontal sew in', 180, 185.00, 3 FROM primary_services WHERE name = 'Ladies - Full Head Weave';

-- 28. Frontal installation/styling
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Frontal installation/styling', 120, 120.00, 1 FROM primary_services WHERE name = 'Frontal installation/styling';

-- 29. Closure wig install
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Closure wig install', 120, 100.00, 1 FROM primary_services WHERE name = 'Closure wig install';

-- 30. Ladies - Half braids/sew in
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Ladies - Half braids/sew in', 360, 130.00, 1 FROM primary_services WHERE name = 'Ladies - Half braids/sew in';

-- 31. Patch Test
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Patch Test', 5, 0.00, 1 FROM primary_services WHERE name = 'Patch Test';
