-- Simple Schedule Table Creation
-- Copy and paste this entire script into Supabase SQL Editor and click RUN

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS public.weekly_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_open BOOLEAN DEFAULT true,
  opening_time TIME,
  closing_time TIME,
  slot_duration_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.weekly_schedule ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies (if any)
DROP POLICY IF EXISTS "Anyone can view schedule" ON public.weekly_schedule;
DROP POLICY IF EXISTS "Admins can manage schedule" ON public.weekly_schedule;
DROP POLICY IF EXISTS "Public read access" ON public.weekly_schedule;
DROP POLICY IF EXISTS "Admin full access" ON public.weekly_schedule;

-- Step 4: Create simple policies
-- Everyone can read the schedule
CREATE POLICY "Public read access"
  ON public.weekly_schedule
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert/update/delete (we'll refine this later)
CREATE POLICY "Admin full access"
  ON public.weekly_schedule
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 5: Insert default schedule
INSERT INTO public.weekly_schedule (day_of_week, is_open, opening_time, closing_time, slot_duration_minutes) 
VALUES
  (0, true, '14:00:00', '19:00:00', 15),
  (1, true, '09:00:00', '21:00:00', 15),
  (2, true, '09:00:00', '21:00:00', 15),
  (3, true, '09:00:00', '21:00:00', 15),
  (4, true, '09:00:00', '21:00:00', 15),
  (5, true, '09:00:00', '21:00:00', 15),
  (6, true, '09:00:00', '21:00:00', 15)
ON CONFLICT (day_of_week) DO NOTHING;

-- Step 6: Verify data was inserted
SELECT * FROM public.weekly_schedule ORDER BY day_of_week;
