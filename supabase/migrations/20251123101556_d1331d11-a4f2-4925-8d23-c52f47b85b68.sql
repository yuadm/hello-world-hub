-- Create household member DBS tracking table
CREATE TABLE IF NOT EXISTS public.household_member_dbs_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.childminder_applications(id) ON DELETE CASCADE,
  member_type text NOT NULL CHECK (member_type IN ('adult', 'child', 'assistant')),
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  relationship text,
  email text,
  dbs_status text NOT NULL DEFAULT 'not_requested' CHECK (dbs_status IN ('not_requested', 'requested', 'applied', 'certificate_received', 'exempt')),
  dbs_request_date timestamp with time zone,
  dbs_certificate_number text,
  dbs_certificate_date date,
  turning_16_notification_sent boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.household_member_dbs_tracking ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dbs_tracking_application_id ON public.household_member_dbs_tracking(application_id);
CREATE INDEX IF NOT EXISTS idx_dbs_tracking_date_of_birth ON public.household_member_dbs_tracking(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_dbs_tracking_status ON public.household_member_dbs_tracking(dbs_status);

-- RLS Policies
CREATE POLICY "Admins can view all DBS tracking records"
  ON public.household_member_dbs_tracking
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert DBS tracking records"
  ON public.household_member_dbs_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update DBS tracking records"
  ON public.household_member_dbs_tracking
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete DBS tracking records"
  ON public.household_member_dbs_tracking
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_household_member_dbs_tracking_updated_at
  BEFORE UPDATE ON public.household_member_dbs_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate age from date of birth
CREATE OR REPLACE FUNCTION public.calculate_age(dob date)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT EXTRACT(YEAR FROM AGE(dob))::integer;
$$;

-- Function to get members approaching 16
CREATE OR REPLACE FUNCTION public.get_members_approaching_16(days_ahead integer DEFAULT 90)
RETURNS TABLE (
  id uuid,
  application_id uuid,
  full_name text,
  date_of_birth date,
  relationship text,
  days_until_16 integer,
  turning_16_notification_sent boolean
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    id,
    application_id,
    full_name,
    date_of_birth,
    relationship,
    EXTRACT(DAY FROM (date_of_birth + INTERVAL '16 years' - CURRENT_DATE))::integer as days_until_16,
    turning_16_notification_sent
  FROM public.household_member_dbs_tracking
  WHERE member_type = 'child'
    AND calculate_age(date_of_birth) < 16
    AND EXTRACT(DAY FROM (date_of_birth + INTERVAL '16 years' - CURRENT_DATE)) <= days_ahead
    AND EXTRACT(DAY FROM (date_of_birth + INTERVAL '16 years' - CURRENT_DATE)) >= 0
  ORDER BY days_until_16 ASC;
$$;