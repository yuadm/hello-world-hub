-- Create la_form_submissions table for Local Authority children's services checks
CREATE TABLE public.la_form_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_token text NOT NULL UNIQUE,
  reference_id text NOT NULL,
  application_id uuid REFERENCES public.childminder_applications(id) ON DELETE SET NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  applicant_name text NOT NULL,
  date_of_birth date,
  local_authority text NOT NULL,
  la_email text NOT NULL,
  role text NOT NULL,
  requester_name text NOT NULL,
  requester_role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  response_data jsonb,
  request_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.la_form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all la form submissions"
ON public.la_form_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert la form submissions"
ON public.la_form_submissions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update la form submissions"
ON public.la_form_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view own submission via token"
ON public.la_form_submissions
FOR SELECT
USING (form_token IS NOT NULL);

CREATE POLICY "Public can update submission via token"
ON public.la_form_submissions
FOR UPDATE
USING (form_token IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_la_form_submissions_updated_at
BEFORE UPDATE ON public.la_form_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();