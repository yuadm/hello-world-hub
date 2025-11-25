-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests from cron
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily 16th birthday check at 8:00 AM UTC
SELECT cron.schedule(
  'check-16th-birthdays-daily',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://pnslbftwceqremqsfylk.supabase.co/functions/v1/check-all-16th-birthdays',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc2xiZnR3Y2VxcmVtcXNmeWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTI2NDcsImV4cCI6MjA3OTI4ODY0N30.mvuOOlnSo7xA_GOuQ_kP9pG8VwUBzQ9QSe3yuJvvXOc"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Create a view to monitor the cron job status
CREATE OR REPLACE VIEW cron_job_status AS
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job
WHERE jobname = 'check-16th-birthdays-daily';