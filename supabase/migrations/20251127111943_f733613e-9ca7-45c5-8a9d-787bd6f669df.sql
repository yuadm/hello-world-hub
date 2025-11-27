-- Create assistant_dbs_tracking table
CREATE TABLE IF NOT EXISTS public.assistant_dbs_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.childminder_applications(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL, -- 'Assistant' or 'Co-childminder'
  date_of_birth DATE NOT NULL,
  dbs_status dbs_status DEFAULT 'not_requested'::dbs_status,
  dbs_certificate_number TEXT,
  dbs_certificate_date DATE,
  dbs_certificate_expiry_date DATE,
  dbs_request_date TIMESTAMP WITH TIME ZONE,
  form_token TEXT UNIQUE,
  form_status TEXT DEFAULT 'not_sent', -- not_sent, sent, draft, submitted, reviewed
  form_sent_date TIMESTAMP WITH TIME ZONE,
  form_submitted_date TIMESTAMP WITH TIME ZONE,
  compliance_status TEXT DEFAULT 'pending',
  risk_level TEXT DEFAULT 'low',
  reminder_count INTEGER DEFAULT 0,
  last_reminder_date TIMESTAMP WITH TIME ZONE,
  reminder_history JSONB DEFAULT '[]'::jsonb,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  follow_up_due_date DATE,
  expiry_reminder_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assistant_forms table
CREATE TABLE IF NOT EXISTS public.assistant_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES public.assistant_dbs_tracking(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.childminder_applications(id) ON DELETE CASCADE,
  form_token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft', -- draft, submitted, reviewed
  
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
  
  -- Section 3: Professional History & Training
  employment_history JSONB DEFAULT '[]'::jsonb,
  employment_gaps TEXT,
  pfa_completed TEXT,
  safeguarding_completed TEXT,
  
  -- Section 4: Vetting & Suitability
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
  
  -- Section 5: Health Declaration
  health_conditions TEXT,
  health_conditions_details TEXT,
  smoker TEXT,
  
  -- Section 6: Declaration
  consent_checks BOOLEAN DEFAULT false,
  declaration_truth BOOLEAN DEFAULT false,
  declaration_notify BOOLEAN DEFAULT false,
  signature_name TEXT,
  signature_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.assistant_dbs_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_forms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assistant_dbs_tracking
CREATE POLICY "Admins can view all assistant tracking"
  ON public.assistant_dbs_tracking FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert assistant tracking"
  ON public.assistant_dbs_tracking FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update assistant tracking"
  ON public.assistant_dbs_tracking FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assistant tracking"
  ON public.assistant_dbs_tracking FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for assistant_forms
CREATE POLICY "Admins can view all assistant forms"
  ON public.assistant_forms FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update assistant forms"
  ON public.assistant_forms FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can insert assistant forms with token"
  ON public.assistant_forms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update own assistant form via token"
  ON public.assistant_forms FOR UPDATE
  USING (true);

CREATE POLICY "Public can view own assistant form via token"
  ON public.assistant_forms FOR SELECT
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_assistant_dbs_tracking_updated_at
  BEFORE UPDATE ON public.assistant_dbs_tracking
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_assistant_forms_updated_at
  BEFORE UPDATE ON public.assistant_forms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to calculate DBS expiry date
CREATE TRIGGER calculate_assistant_dbs_expiry
  BEFORE INSERT OR UPDATE ON public.assistant_dbs_tracking
  FOR EACH ROW EXECUTE FUNCTION public.calculate_dbs_expiry();

-- Create indexes for performance
CREATE INDEX idx_assistant_dbs_tracking_application_id ON public.assistant_dbs_tracking(application_id);
CREATE INDEX idx_assistant_dbs_tracking_form_token ON public.assistant_dbs_tracking(form_token);
CREATE INDEX idx_assistant_forms_assistant_id ON public.assistant_forms(assistant_id);
CREATE INDEX idx_assistant_forms_form_token ON public.assistant_forms(form_token);