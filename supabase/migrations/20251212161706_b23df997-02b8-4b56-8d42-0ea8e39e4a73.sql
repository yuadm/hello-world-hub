-- Backfill existing co-childminder data for application 1eed7914-f464-472f-b0a5-732613c0eebf
INSERT INTO compliance_cochildminders (application_id, first_name, last_name, date_of_birth, email, phone, dbs_status, form_status)
VALUES ('1eed7914-f464-472f-b0a5-732613c0eebf', 'daryel', 'delete', '2000-01-01', 'daryelcare72@gmail.com', '02072724914', 'not_requested', 'not_sent')
ON CONFLICT DO NOTHING;