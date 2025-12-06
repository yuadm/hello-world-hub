-- First grant all necessary permissions to anon
GRANT ALL ON public.childminder_applications TO anon;
GRANT ALL ON public.childminder_applications TO authenticated;

-- Also grant on the related tables for the compliance records
GRANT INSERT ON public.compliance_household_members TO anon;
GRANT INSERT ON public.compliance_assistants TO anon;

-- Make sure sequences work (for any serial/auto-increment)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;