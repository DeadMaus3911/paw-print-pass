
CREATE TABLE public.overdracht_items (
  id TEXT NOT NULL PRIMARY KEY,
  done BOOLEAN NOT NULL DEFAULT false,
  checked_by TEXT,
  checked_date TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.overdracht_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read overdracht_items" ON public.overdracht_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert overdracht_items" ON public.overdracht_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update overdracht_items" ON public.overdracht_items FOR UPDATE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.overdracht_items;
