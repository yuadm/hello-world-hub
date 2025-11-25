-- Create household_member_forms table to store form submissions
CREATE TABLE IF NOT EXISTS public.household_member_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.household_member_dbs_tracking(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.childminder_applications(id) ON DELETE CASCADE,
  form_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  
  -- Section 1: Personal Details
  title TEXT,
  first_name TEXT,
  middle_names TEXT,
  last_name TEXT,
  previous_names JSONB DEFAULT '[]'::jsonb,
  date_of_birth DATE,
  birth_town TEXT,
  sex TEXT,
  ni_number TEXT,
  
  -- Section 2: Address History
  current_address JSONB,
  address_history JSONB DEFAULT '[]'::jsonb,
  lived_outside_uk TEXT,
  outside_uk_details TEXT,
  
  -- Section 3: Vetting & Suitability
  previous_registration TEXT,
  previous_registration_details JSONB,
  has_dbs TEXT,
  dbs_number TEXT,
  dbs_update_service TEXT,
  criminal_history TEXT,
  criminal_history_details TEXT,
  disqualified TEXT,
  social_services TEXT,
  social_services_details TEXT,
  
  -- Section 4: Health Declaration
  health_conditions TEXT,
  health_conditions_details TEXT,
  smoker TEXT,
  
  -- Section 5: Declaration
  consent_checks BOOLEAN DEFAULT false,
  declaration_truth BOOLEAN DEFAULT false,
  declaration_notify BOOLEAN DEFAULT false,
  signature_name TEXT,
  signature_date DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes
  CONSTRAINT valid_status CHECK (status IN ('draft', 'submitted', 'reviewed'))
);

-- Add form_token column to household_member_dbs_tracking if it doesn't exist
ALTER TABLE public.household_member_dbs_tracking 
ADD COLUMN IF NOT EXISTS form_token TEXT UNIQUE;

-- Create index on form_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_household_member_forms_token ON public.household_member_forms(form_token);
CREATE INDEX IF NOT EXISTS idx_household_member_forms_member_id ON public.household_member_forms(member_id);
CREATE INDEX IF NOT EXISTS idx_household_member_dbs_tracking_token ON public.household_member_dbs_tracking(form_token);

-- Enable RLS
ALTER TABLE public.household_member_forms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for household_member_forms
CREATE POLICY "Public can insert forms with valid token"
  ON public.household_member_forms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view their own form via token"
  ON public.household_member_forms
  FOR SELECT
  USING (true);

CREATE POLICY "Public can update their own form via token"
  ON public.household_member_forms
  FOR UPDATE
  USING (true);

CREATE POLICY "Admins can view all forms"
  ON public.household_member_forms
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all forms"
  ON public.household_member_forms
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger to update updated_at
CREATE TRIGGER update_household_member_forms_updated_at
  BEFORE UPDATE ON public.household_member_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.household_member_forms IS 'Stores CMA-H2 household member suitability form submissions';
COMMENT ON COLUMN public.household_member_forms.form_token IS 'Secure token for accessing the form without authentication';
COMMENT ON COLUMN public.household_member_forms.status IS 'Form status: draft, submitted, or reviewed';