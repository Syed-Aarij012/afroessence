-- SIMPLE FIX - Run this in Supabase SQL Editor
-- This ensures regular users can see services and professionals for booking

-- Temporarily disable RLS to fix the issue
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies
CREATE POLICY "Allow all authenticated users to view services" ON public.services
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all authenticated users to view professionals" ON public.professionals
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admins to manage services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admins to manage professionals" ON public.professionals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Verify services exist
SELECT COUNT(*) as service_count FROM public.services;

-- Verify professionals exist  
SELECT COUNT(*) as professional_count FROM public.professionals;

-- Test query that regular users should be able to run
SELECT id, name, price FROM public.services WHERE is_active = true;