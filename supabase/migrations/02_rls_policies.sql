-- ==============================================================================
-- MASJIDSMART AI - ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 02_rls_policies.sql
-- Description: Enforces strict data access rules per role
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosque_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions to check role from auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'bendahara')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ------------------------------------------------------------------------------
-- 1. Profiles Table Policies
-- ------------------------------------------------------------------------------
-- Any authenticated user can read profiles (needed for showing creator names in dashboard)
CREATE POLICY "Allow authenticated read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Allow users to update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can update any profile (e.g. changing roles)
CREATE POLICY "Allow admins to manage profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. Mosque Settings Table Policies
-- ------------------------------------------------------------------------------
-- Public can read mosque settings
CREATE POLICY "Allow public read mosque settings"
ON public.mosque_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can update mosque settings
CREATE POLICY "Allow admins to update mosque settings"
ON public.mosque_settings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. Transaction Categories Policies
-- ------------------------------------------------------------------------------
-- Public can read categories marked is_public
CREATE POLICY "Allow public read public categories"
ON public.transaction_categories FOR SELECT
TO anon, authenticated
USING (is_public = true OR public.is_staff());

-- Staff (Admin & Bendahara) can manage categories
CREATE POLICY "Allow staff to insert categories"
ON public.transaction_categories FOR INSERT
TO authenticated
WITH CHECK (public.is_staff());

CREATE POLICY "Allow staff to update categories"
ON public.transaction_categories FOR UPDATE
TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "Allow staff to delete categories"
ON public.transaction_categories FOR DELETE
TO authenticated
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. Transactions Table Policies
-- ------------------------------------------------------------------------------
-- Public can only see APPROVED and PUBLIC transactions
CREATE POLICY "Allow public read approved public transactions"
ON public.transactions FOR SELECT
TO anon, authenticated
USING (
  (status = 'approved' AND is_public = true)
  OR public.is_staff()
);

-- Staff (Admin & Bendahara) can insert transactions
CREATE POLICY "Allow staff to insert transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (public.is_staff());

-- Staff can update transactions
CREATE POLICY "Allow staff to update transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- Only admin can delete transactions (prefer status='cancelled' for audit trail)
CREATE POLICY "Allow admin to delete transactions"
ON public.transactions FOR DELETE
TO authenticated
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. Activities Policies
-- ------------------------------------------------------------------------------
-- Public can read all non-cancelled activities
CREATE POLICY "Allow public read activities"
ON public.activities FOR SELECT
TO anon, authenticated
USING (status != 'cancelled' OR public.is_staff());

-- Staff can insert and update activities
CREATE POLICY "Allow staff to manage activities"
ON public.activities FOR ALL
TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ------------------------------------------------------------------------------
-- 6. Announcements Policies
-- ------------------------------------------------------------------------------
-- Public can read published announcements
CREATE POLICY "Allow public read published announcements"
ON public.announcements FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_staff());

-- Staff can manage announcements
CREATE POLICY "Allow staff to manage announcements"
ON public.announcements FOR ALL
TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ------------------------------------------------------------------------------
-- 7. Audit Logs Policies
-- ------------------------------------------------------------------------------
-- Only admins can read audit logs
CREATE POLICY "Allow admins to read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin());

-- Staff can insert audit logs
CREATE POLICY "Allow staff to insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (public.is_staff());
