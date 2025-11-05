-- FIX RLS POLICIES - Run this in Supabase SQL Editor
-- This fixes the issue where regular users can't see services and professionals

-- 1. Drop existing restrictive policies for services
DROP POLICY IF EXISTS "Everyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

-- 2. Create new policies for services that allow everyone to view active services
CREATE POLICY "Anyone can view active services" ON public.services
    FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Drop existing restrictive policies for professionals
DROP POLICY IF EXISTS "Everyone can view active professionals" ON public.professionals;
DROP POLICY IF EXISTS "Admins can manage professionals" ON public.professionals;

-- 4. Create new policies for professionals that allow everyone to view active professionals
CREATE POLICY "Anyone can view active professionals" ON public.professionals
    FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all professionals" ON public.professionals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Also ensure authenticated users can view all services and professionals (not just active ones)
CREATE POLICY "Authenticated users can view all services" ON public.services
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view all professionals" ON public.professionals
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- 6. Verify the policies are working
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('services', 'professionals')
ORDER BY tablename, policyname;