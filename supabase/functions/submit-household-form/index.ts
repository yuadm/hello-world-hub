import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const brevoApiKey = Deno.env.get("BREVO_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubmitFormData {
  token: string;
  formData: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, formData }: SubmitFormData = await req.json();
    
    console.log("Submitting household form for token:", token);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try employee household members first
    const { data: employeeData, error: employeeError } = await supabase
      .from("employee_household_members")
      .select(`
        *,
        employees!inner(
          id, first_name, last_name, email
        )
      `)
      .eq("form_token", token)
      .maybeSingle();

    let isEmployee = false;
    let memberData: any;
    let parentName: string;
    let parentEmail: string;

    if (employeeData) {
      // Handle employee household member
      isEmployee = true;
      memberData = employeeData;
      parentName = `${employeeData.employees.first_name} ${employeeData.employees.last_name}`;
      parentEmail = employeeData.employees.email;

      // Update employee household member tracking
      const { error: updateMemberError } = await supabase
        .from("employee_household_members")
        .update({
          response_received: true,
          response_date: new Date().toISOString(),
          application_submitted: true,
          dbs_status: formData.hasDBS === "Yes" ? "received" : "requested",
          dbs_certificate_number: formData.hasDBS === "Yes" ? formData.dbsNumber : null
        })
        .eq("id", employeeData.id);

      if (updateMemberError) {
        console.error("Error updating employee member tracking:", updateMemberError);
        throw updateMemberError;
      }
    } else {
      // Try applicant household members
      const { data: applicantData, error: applicantError } = await supabase
        .from("household_member_dbs_tracking")
        .select(`
          *,
          childminder_applications!inner(
            id, first_name, last_name, email
          )
        `)
        .eq("form_token", token)
        .maybeSingle();

      if (!applicantData) {
        throw new Error("Invalid form token");
      }

      memberData = applicantData;
      parentName = `${applicantData.childminder_applications.first_name} ${applicantData.childminder_applications.last_name}`;
      parentEmail = applicantData.childminder_applications.email;

      // Update the form to submitted status
      const { error: updateFormError } = await supabase
        .from("household_member_forms")
        .update({
          status: "submitted",
          submitted_at: new Date().toISOString()
        })
        .eq("form_token", token);

      if (updateFormError) {
        console.error("Error updating form status:", updateFormError);
        throw updateFormError;
      }

      // Update member tracking
      const { error: updateMemberError } = await supabase
        .from("household_member_dbs_tracking")
        .update({
          response_received: true,
          response_date: new Date().toISOString(),
          application_submitted: true,
          dbs_status: formData.hasDBS === "Yes" ? "received" : "requested",
          dbs_certificate_number: formData.hasDBS === "Yes" ? formData.dbsNumber : null
        })
        .eq("id", applicantData.id);

      if (updateMemberError) {
        console.error("Error updating member tracking:", updateMemberError);
        throw updateMemberError;
      }
    }

    // Send confirmation email to household member
    const memberEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { 
          name: "Childminder Registration", 
          email: Deno.env.get("BREVO_SENDER_EMAIL") || "noreply@yourdomain.com"
        },
        to: [{ email: memberData.email, name: memberData.full_name }],
        subject: "Suitability Form Received - Thank You",
        htmlContent: `
          <h1>Form Submitted Successfully</h1>
          <p>Dear ${memberData.full_name},</p>
          <p>Thank you for completing the CMA-H2 Suitability Check form.</p>
          
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>We have notified ${parentName} that you have completed the form</li>
            <li>Our team will review your submission</li>
            ${formData.hasDBS === "No" ? "<li>We will initiate your DBS check and contact you with further instructions</li>" : ""}
            <li>If we need any additional information, we will contact you</li>
          </ul>

          <p>If you have any questions, please contact the registration team.</p>

          <p>Best regards,<br>Childminder Registration Team</p>
        `,
      }),
    });

    if (!memberEmailResponse.ok) {
      console.error("Failed to send member confirmation email");
    }

    // Send notification email to parent (applicant or employee)
    const parentEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { 
          name: "Childminder Registration", 
          email: Deno.env.get("BREVO_SENDER_EMAIL") || "noreply@yourdomain.com"
        },
        to: [{ 
          email: parentEmail, 
          name: parentName
        }],
        subject: "Household Member Form Completed",
        htmlContent: `
          <h1>Household Member Form Submitted</h1>
          <p>Dear ${parentName},</p>
          <p><strong>${memberData.full_name}</strong> has successfully completed and submitted their CMA-H2 Suitability Check form.</p>
          
          <p><strong>Next steps:</strong></p>
          <ul>
            <li>Our team will review their submission</li>
            ${formData.hasDBS === "No" ? "<li>We will initiate their DBS check</li>" : "<li>They have provided their existing DBS certificate details</li>"}
            <li>We will contact you if we need any additional information</li>
            <li>This brings you one step closer to completing your registration</li>
          </ul>

          <p>You can view the status of all household members in your ${isEmployee ? 'employee' : 'admin'} portal.</p>

          <p>Best regards,<br>Childminder Registration Team</p>
        `,
      }),
    });

    if (!parentEmailResponse.ok) {
      console.error("Failed to send parent notification email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in submit-household-form:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
