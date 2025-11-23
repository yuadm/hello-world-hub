-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can insert their own applications" ON childminder_applications;

-- Create a new policy that allows anonymous submissions
CREATE POLICY "Allow public application submissions"
ON childminder_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also update the childminder_applications table to make user_id nullable since applications can be submitted anonymously
-- (This is already nullable based on the schema, so no change needed)

-- Add a comment to document this decision
COMMENT ON POLICY "Allow public application submissions" ON childminder_applications IS 
'Allows anyone (authenticated or anonymous) to submit childminder applications. Applications are reviewed by admins before approval.';