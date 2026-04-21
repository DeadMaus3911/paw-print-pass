-- overdracht_items
DROP POLICY IF EXISTS "Anyone can read overdracht_items" ON public.overdracht_items;
DROP POLICY IF EXISTS "Anyone can insert overdracht_items" ON public.overdracht_items;
DROP POLICY IF EXISTS "Anyone can update overdracht_items" ON public.overdracht_items;

CREATE POLICY "Authenticated can select items" ON public.overdracht_items
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert items" ON public.overdracht_items
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update items" ON public.overdracht_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete items" ON public.overdracht_items
  FOR DELETE TO authenticated USING (true);

-- overdracht_contacten
DROP POLICY IF EXISTS "Anyone can read contacts" ON public.overdracht_contacten;
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.overdracht_contacten;
DROP POLICY IF EXISTS "Anyone can update contacts" ON public.overdracht_contacten;
DROP POLICY IF EXISTS "Anyone can delete contacts" ON public.overdracht_contacten;

CREATE POLICY "Authenticated can select contacts" ON public.overdracht_contacten
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert contacts" ON public.overdracht_contacten
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update contacts" ON public.overdracht_contacten
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete contacts" ON public.overdracht_contacten
  FOR DELETE TO authenticated USING (true);

-- overdracht_skills
DROP POLICY IF EXISTS "Anyone can read skills" ON public.overdracht_skills;
DROP POLICY IF EXISTS "Anyone can insert skills" ON public.overdracht_skills;
DROP POLICY IF EXISTS "Anyone can update skills" ON public.overdracht_skills;
DROP POLICY IF EXISTS "Anyone can delete skills" ON public.overdracht_skills;

CREATE POLICY "Authenticated can select skills" ON public.overdracht_skills
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert skills" ON public.overdracht_skills
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update skills" ON public.overdracht_skills
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete skills" ON public.overdracht_skills
  FOR DELETE TO authenticated USING (true);

-- overdracht_config
DROP POLICY IF EXISTS "Anyone can read config" ON public.overdracht_config;

CREATE POLICY "Authenticated can select config" ON public.overdracht_config
  FOR SELECT TO authenticated USING (true);