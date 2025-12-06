ALTER TABLE public.ofsted_form_submissions 
ADD COLUMN IF NOT EXISTS request_data jsonb;