CREATE TABLE public.overdracht_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.overdracht_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read config"
  ON public.overdracht_config FOR SELECT
  USING (true);

INSERT INTO public.overdracht_config (key, value) VALUES ('vault_pin', '1963');