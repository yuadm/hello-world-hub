import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { sendEmail, createEmailTemplate } from "../_shared/email-service.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DBSRequestData {
  memberId: string;
  memberEmail: string;
  applicantName?: string;
  employeeName?: string;
  employeeId?: string;
  isEmployee?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberId, memberEmail, applicantName, employeeName, employeeId, isEmployee }: DBSRequestData = await req.json();
    
    console.log("Sending DBS request for member:", memberId, "isEmployee:", isEmployee);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine which table to use
    const tableName = isEmployee ? "employee_household_members" : "household_member_dbs_tracking";
    const contextName = isEmployee ? employeeName : applicantName;

    // Get member details
    const { data: memberData, error: memberError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", memberId)
      .single();

    if (memberError || !memberData) {
      console.error("Member not found:", memberError);
      throw new Error("Member not found");
    }

    // Update member tracking - mark DBS as requested
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        dbs_status: "requested",
        dbs_request_date: new Date().toISOString(),
        email: memberEmail,
        reminder_count: (memberData.reminder_count || 0) + 1,
        last_reminder_date: new Date().toISOString(),
        last_contact_date: new Date().toISOString(),
        reminder_history: [
          ...(memberData.reminder_history || []),
          {
            date: new Date().toISOString(),
            type: "dbs_request",
            sent_to: memberEmail,
          },
        ],
      })
      .eq("id", memberId);

    if (updateError) {
      console.error("Error updating member tracking:", updateError);
      throw updateError;
    }

    // Create email content using template
    const emailContent = `
      <p>Dear ${memberData.full_name},</p>
      <p>${contextName} ${isEmployee ? 'is a registered childminder' : 'has applied to become a registered childminder'}. As an adult member of their household, we need to conduct a DBS (Disclosure and Barring Service) check for you.</p>
      
      <p><strong>What you need to do:</strong></p>
      <ul>
        <li>Apply for an Enhanced DBS check with Barred Lists check</li>
        <li>Complete the online application form</li>
        <li>Provide the required identification documents</li>
        <li>Pay the applicable fee (if any)</li>
      </ul>

      <p><strong>Important:</strong> The childminder registration cannot proceed until all required DBS checks are completed.</p>

      <p>If you have any questions or need to schedule your DBS check, please contact us.</p>
    `;

    const htmlContent = createEmailTemplate(
      'DBS Check Required - Action Needed',
      emailContent,
      'Best regards,<br>Childminder Registration Team'
    );

    // Send email with retry logic
    console.log("Sending email to:", memberEmail);
    const emailResult = await sendEmail({
      to: memberEmail,
      toName: memberData.full_name,
      subject: 'DBS Check Required - Action Needed',
      htmlContent,
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Failed to send email');
    }

    console.log("Email sent successfully, messageId:", emailResult.messageId);

    return new Response(JSON.stringify({ 
      success: true,
      message: "DBS request sent successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-dbs-request-email:", error);
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
