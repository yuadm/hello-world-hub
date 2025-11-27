-- Create employee_assistant_forms table for employee assistant form submissions
CREATE TABLE public.employee_assistant_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_assistant_id uuid NOT NULL REFERENCES public.employee_assistants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  form_token text NOT NULL UNIQUE,
  status text DEFAULT 'draft',
  
  -- Personal details
  title text,
  first_name text,
  middle_names text,
  last_name text,
  previous_names jsonb DEFAULT '[]'::jsonb,
  date_of_birth date,
  birth_town text,
  sex text,
  ni_number text,
  
  -- Address
  current_address jsonb,
  address_history jsonb DEFAULT '[]'::jsonb,
  lived_outside_uk text,
  
  -- Employment
  employment_history jsonb DEFAULT '[]'::jsonb,
  employment_gaps text,
  pfa_completed text,
  safeguarding_completed text,
  
  -- Suitability
  previous_registration text,
  previous_registration_details jsonb,
  has_dbs text,
  dbs_number text,
  dbs_update_service text,
  criminal_history text,
  criminal_history_details text,
  disqualified text,
  social_services text,
  social_services_details text,
  health_conditions text,
  health_conditions_details text,
  smoker text,
  
  -- Declaration
  consent_checks boolean DEFAULT false,
  declaration_truth boolean DEFAULT false,
  declaration_notify boolean DEFAULT false,
  signature_name text,
  signature_date date,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  submitted_at timestamptz
);

-- Enable RLS
ALTER TABLE public.employee_assistant_forms ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view all employee assistant forms"
ON public.employee_assistant_forms
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update employee assistant forms"
ON public.employee_assistant_forms
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Public policies for form submission via token
CREATE POLICY "Public can insert employee assistant forms with token"
ON public.employee_assistant_forms
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can view own employee assistant form via token"
ON public.employee_assistant_forms
FOR SELECT
USING (true);

CREATE POLICY "Public can update own employee assistant form via token"
ON public.employee_assistant_forms
FOR UPDATE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_employee_assistant_forms_updated_at
  BEFORE UPDATE ON public.employee_assistant_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();