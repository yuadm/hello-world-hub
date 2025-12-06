-- Grant INSERT permission on childminder_applications to anon role
GRANT INSERT ON public.childminder_applications TO anon;

-- Also ensure the anon role can use the schema
GRANT USAGE ON SCHEMA public TO anon;