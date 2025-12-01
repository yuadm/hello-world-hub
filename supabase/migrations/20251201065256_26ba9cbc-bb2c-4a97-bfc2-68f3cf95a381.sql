-- Drop old duplicate tables that have been replaced by unified compliance tables

-- Drop old application-specific tables (replaced by compliance_household_members and compliance_household_forms)
DROP TABLE IF EXISTS household_member_forms CASCADE;
DROP TABLE IF EXISTS household_member_dbs_tracking CASCADE;

-- Drop old application-specific assistant tables (replaced by compliance_assistants and compliance_assistant_forms)
DROP TABLE IF EXISTS assistant_forms CASCADE;
DROP TABLE IF EXISTS assistant_dbs_tracking CASCADE;

-- Drop old employee-specific tables (replaced by unified compliance tables with employee_id)
DROP TABLE IF EXISTS employee_assistant_forms CASCADE;
DROP TABLE IF EXISTS employee_assistants CASCADE;
DROP TABLE IF EXISTS employee_household_members CASCADE;

-- Note: The new unified tables (compliance_household_members, compliance_household_forms, 
-- compliance_assistants, compliance_assistant_forms) now handle both application and employee
-- data using polymorphic references (application_id OR employee_id)