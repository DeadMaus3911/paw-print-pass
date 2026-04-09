
CREATE TABLE public.overdracht_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  emoji TEXT,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.overdracht_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skills" ON public.overdracht_skills FOR SELECT USING (true);
CREATE POLICY "Anyone can insert skills" ON public.overdracht_skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update skills" ON public.overdracht_skills FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete skills" ON public.overdracht_skills FOR DELETE USING (true);
