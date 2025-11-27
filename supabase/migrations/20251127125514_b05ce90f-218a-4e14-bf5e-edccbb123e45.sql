-- Create employee_assistants table
CREATE TABLE IF NOT EXISTS public.employee_assistants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  dbs_status dbs_status DEFAULT 'not_requested'::dbs_status,
  dbs_certificate_number TEXT,
  dbs_certificate_date DATE,
  dbs_certificate_expiry_date DATE,
  dbs_request_date TIMESTAMPTZ,
  form_token TEXT,
  form_status TEXT DEFAULT 'not_sent',
  form_sent_date TIMESTAMPTZ,
  form_submitted_date TIMESTAMPTZ,
  compliance_status TEXT DEFAULT 'pending',
  risk_level TEXT DEFAULT 'low',
  notes TEXT,
  reminder_count INTEGER DEFAULT 0,
  last_reminder_date TIMESTAMPTZ,
  reminder_history JSONB DEFAULT '[]'::jsonb,
  last_contact_date TIMESTAMPTZ,
  follow_up_due_date DATE,
  expiry_reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_assistants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can view all employee assistants"
ON public.employee_assistants
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert employee assistants"
ON public.employee_assistants
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update employee assistants"
ON public.employee_assistants
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete employee assistants"
ON public.employee_assistants
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_employee_assistants_updated_at
BEFORE UPDATE ON public.employee_assistants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for DBS expiry calculation
CREATE TRIGGER calculate_employee_assistant_dbs_expiry
BEFORE INSERT OR UPDATE ON public.employee_assistants
FOR EACH ROW
EXECUTE FUNCTION public.calculate_dbs_expiry();

-- Create index for better query performance
CREATE INDEX idx_employee_assistants_employee_id ON public.employee_assistants(employee_id);
CREATE INDEX idx_employee_assistants_form_token ON public.employee_assistants(form_token) WHERE form_token IS NOT NULL;