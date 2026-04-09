
-- Create contacts table
CREATE TABLE public.overdracht_contacten (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  org TEXT,
  tag TEXT,
  initials TEXT,
  email TEXT,
  phone TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.overdracht_contacten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read contacts" ON public.overdracht_contacten FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contacts" ON public.overdracht_contacten FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contacts" ON public.overdracht_contacten FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contacts" ON public.overdracht_contacten FOR DELETE USING (true);

-- Add columns to overdracht_items for full task storage
ALTER TABLE public.overdracht_items
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS deadline TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Gemiddeld',
  ADD COLUMN IF NOT EXISTS involved TEXT,
  ADD COLUMN IF NOT EXISTS custom BOOLEAN DEFAULT false;

-- Enable realtime for contacts
ALTER PUBLICATION supabase_realtime ADD TABLE public.overdracht_contacten;
