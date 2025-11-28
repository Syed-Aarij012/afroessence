-- Hierarchical Service Structure for AfroEssence
-- 3-Level Structure: Categories -> Primary Services -> Sub-Services

-- 1. Service Categories (Main level)
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Primary Services (Second level)
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

-- 3. Sub-Services (Third level - bookable items)
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

-- Update bookings table to reference sub_services
ALTER TABLE bookings 
DROP COLUMN IF EXISTS service_id,
ADD COLUMN IF NOT EXISTS sub_service_id UUID REFERENCES sub_services(id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_primary_services_category ON primary_services(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_services_primary ON sub_services(primary_service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_sub_service ON bookings(sub_service_id);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE primary_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read, admin write)
CREATE POLICY "Public can view active categories" ON service_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active primary services" ON primary_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active sub-services" ON sub_services
  FOR SELECT USING (is_active = true);

-- Admin policies (you'll need to adjust based on your auth setup)
CREATE POLICY "Admins can manage categories" ON service_categories
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@afroessence.com');

CREATE POLICY "Admins can manage primary services" ON primary_services
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@afroessence.com');

CREATE POLICY "Admins can manage sub-services" ON sub_services
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@afroessence.com');
