-- Add Weekly Schedule Management Table
-- Run this in your Supabase SQL Editor

-- First, ensure the has_role function exists
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create schedule table
CREATE TABLE IF NOT EXISTS public.weekly_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  is_open BOOLEAN DEFAULT true,
  opening_time TIME,
  closing_time TIME,
  slot_duration_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- Enable RLS
ALTER TABLE public.weekly_schedule ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view schedule" ON public.weekly_schedule;
DROP POLICY IF EXISTS "Admins can manage schedule" ON public.weekly_schedule;

-- Anyone can view the schedule
CREATE POLICY "Anyone can view schedule"
  ON public.weekly_schedule FOR SELECT
  USING (true);

-- Only admins can manage schedule
CREATE POLICY "Admins can manage schedule"
  ON public.weekly_schedule FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert default schedule (Monday-Saturday: 09:00-21:00, Sunday: 14:00-20:00)
INSERT INTO public.weekly_schedule (day_of_week, is_open, opening_time, closing_time, slot_duration_minutes) VALUES
(0, true, '14:00:00', '20:00:00', 15), -- Sunday
(1, true, '09:00:00', '21:00:00', 15), -- Monday
(2, true, '09:00:00', '21:00:00', 15), -- Tuesday
(3, true, '09:00:00', '21:00:00', 15), -- Wednesday
(4, true, '09:00:00', '21:00:00', 15), -- Thursday
(5, true, '09:00:00', '21:00:00', 15), -- Friday
(6, true, '09:00:00', '21:00:00', 15)  -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_weekly_schedule_updated_at ON public.weekly_schedule;
CREATE TRIGGER update_weekly_schedule_updated_at
    BEFORE UPDATE ON public.weekly_schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

SELECT 'Weekly schedule table created successfully!' as message;
