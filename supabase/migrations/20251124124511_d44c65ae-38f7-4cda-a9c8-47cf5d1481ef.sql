-- Add DBS tracking columns to employee_household_members table
ALTER TABLE employee_household_members
  ADD COLUMN IF NOT EXISTS dbs_request_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS compliance_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS last_contact_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS reminder_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reminder_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS reminder_history jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS application_reference text,
  ADD COLUMN IF NOT EXISTS application_submitted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS response_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS response_received boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS follow_up_due_date date,
  ADD COLUMN IF NOT EXISTS expiry_reminder_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS turning_16_notification_sent boolean DEFAULT false;

-- Create index on employee_id for better query performance
CREATE INDEX IF NOT EXISTS idx_employee_household_members_employee_id ON employee_household_members(employee_id);

-- Create index on member_type for filtering
CREATE INDEX IF NOT EXISTS idx_employee_household_members_member_type ON employee_household_members(member_type);

-- Create index on compliance_status for filtering
CREATE INDEX IF NOT EXISTS idx_employee_household_members_compliance_status ON employee_household_members(compliance_status);