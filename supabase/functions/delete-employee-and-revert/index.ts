import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { employeeId } = await req.json();

    if (!employeeId) {
      throw new Error('Employee ID is required');
    }

    console.log('[delete-employee] Starting deletion for employee:', employeeId);

    // Fetch employee to get the application_id
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (empError || !employee) {
      throw new Error(`Failed to fetch employee: ${empError?.message}`);
    }

    const applicationId = employee.application_id;
    console.log('[delete-employee] Associated application:', applicationId);

    // =============================================================================
    // Delete all compliance data associated with this employee
    // =============================================================================

    // 1. Delete household member forms
    const { error: deleteHouseholdFormsError } = await supabase
      .from('compliance_household_forms')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteHouseholdFormsError) {
      console.error('[delete-employee] Failed to delete household forms:', deleteHouseholdFormsError.message);
    } else {
      console.log('[delete-employee] Household forms deleted');
    }

    // 2. Delete household members
    const { error: deleteHouseholdMembersError } = await supabase
      .from('compliance_household_members')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteHouseholdMembersError) {
      console.error('[delete-employee] Failed to delete household members:', deleteHouseholdMembersError.message);
    } else {
      console.log('[delete-employee] Household members deleted');
    }

    // 3. Delete assistant forms
    const { error: deleteAssistantFormsError } = await supabase
      .from('compliance_assistant_forms')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteAssistantFormsError) {
      console.error('[delete-employee] Failed to delete assistant forms:', deleteAssistantFormsError.message);
    } else {
      console.log('[delete-employee] Assistant forms deleted');
    }

    // 4. Delete assistants
    const { error: deleteAssistantsError } = await supabase
      .from('compliance_assistants')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteAssistantsError) {
      console.error('[delete-employee] Failed to delete assistants:', deleteAssistantsError.message);
    } else {
      console.log('[delete-employee] Assistants deleted');
    }

    // 5. Delete cochildminder forms/applications
    const { error: deleteCochildminderFormsError } = await supabase
      .from('cochildminder_applications')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteCochildminderFormsError) {
      console.error('[delete-employee] Failed to delete cochildminder forms:', deleteCochildminderFormsError.message);
    } else {
      console.log('[delete-employee] Cochildminder forms deleted');
    }

    // 6. Delete cochildminders
    const { error: deleteCochildmindersError } = await supabase
      .from('compliance_cochildminders')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteCochildmindersError) {
      console.error('[delete-employee] Failed to delete cochildminders:', deleteCochildmindersError.message);
    } else {
      console.log('[delete-employee] Cochildminders deleted');
    }

    // 7. Delete reference requests
    const { error: deleteReferencesError } = await supabase
      .from('reference_requests')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteReferencesError) {
      console.error('[delete-employee] Failed to delete references:', deleteReferencesError.message);
    } else {
      console.log('[delete-employee] Reference requests deleted');
    }

    // 8. Delete Ofsted form submissions
    const { error: deleteOfstedFormsError } = await supabase
      .from('ofsted_form_submissions')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteOfstedFormsError) {
      console.error('[delete-employee] Failed to delete Ofsted forms:', deleteOfstedFormsError.message);
    } else {
      console.log('[delete-employee] Ofsted forms deleted');
    }

    // 9. Delete LA form submissions
    const { error: deleteLaFormsError } = await supabase
      .from('la_form_submissions')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteLaFormsError) {
      console.error('[delete-employee] Failed to delete LA forms:', deleteLaFormsError.message);
    } else {
      console.log('[delete-employee] LA forms deleted');
    }

    // 10. Delete the employee record
    const { error: deleteEmployeeError } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);

    if (deleteEmployeeError) {
      throw new Error(`Failed to delete employee: ${deleteEmployeeError.message}`);
    }

    console.log('[delete-employee] Employee record deleted');

    // =============================================================================
    // Revert application status to pending if we have an application ID
    // =============================================================================

    if (applicationId) {
      const { error: updateAppError } = await supabase
        .from('childminder_applications')
        .update({ status: 'pending' })
        .eq('id', applicationId);

      if (updateAppError) {
        console.error('[delete-employee] Failed to revert application status:', updateAppError.message);
      } else {
        console.log('[delete-employee] Application status reverted to pending');
      }
    }

    console.log('[delete-employee] Deletion completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        applicationId,
        message: 'Employee deleted and application reverted to pending'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[delete-employee] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
