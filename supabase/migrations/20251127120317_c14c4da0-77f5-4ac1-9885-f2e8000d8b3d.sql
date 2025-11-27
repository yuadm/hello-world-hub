-- Allow public to view assistant tracking records via form token
CREATE POLICY "Public can view assistant tracking via form token" 
ON assistant_dbs_tracking
FOR SELECT
TO public
USING (form_token IS NOT NULL);

-- Allow public to view limited application data via assistant form token
CREATE POLICY "Public can view limited application data via assistant form"
ON childminder_applications
FOR SELECT
TO public
USING (
  id IN (
    SELECT application_id FROM assistant_dbs_tracking WHERE form_token IS NOT NULL
  )
);