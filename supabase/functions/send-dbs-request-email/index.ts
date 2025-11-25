import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const brevoApiKey = Deno.env.get("BREVO_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const appUrl = Deno.env.get("APP_URL") || "https://your-app.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DBSRequestData {
  memberId: string;
  memberName: string;
  memberEmail: string;
  applicationId: string;
  applicantName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberId, memberName, memberEmail, applicationId, applicantName }: DBSRequestData = await req.json();
    
    console.log("Sending DBS request email to:", memberEmail);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a secure token for the household form
    const formToken = crypto.randomUUID() + "-" + Date.now().toString(36);
    
    // Update member with form token
    const { error: tokenError } = await supabase
      .from("household_member_dbs_tracking")
      .update({ form_token: formToken })
      .eq("id", memberId);

    if (tokenError) {
      console.error("Error updating form token:", tokenError);
      throw tokenError;
    }

    const formUrl = `${appUrl}/household-form?token=${formToken}`;

    // Send email via Brevo
    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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
        to: [{ email: memberEmail, name: memberName }],
        subject: "DBS Check Required - Childminder Registration",
        htmlContent: `
          <h1>DBS Check & Suitability Form Required</h1>
          <p>Dear ${memberName},</p>
          <p>As part of the childminder registration process for <strong>${applicantName}</strong>, you are required to complete a suitability check and provide DBS information.</p>
          
          <h2>What You Need to Do:</h2>
          <ol>
            <li><strong>Complete the online suitability form:</strong> <a href="${formUrl}" style="color: #1d70b8; font-weight: bold;">Click here to access your form</a></li>
            <li>The form will ask for your personal details, address history, and vetting information</li>
            <li>If you don't already have an Enhanced DBS certificate for child workforce, we will initiate the process for you</li>
          </ol>

          <h2>Important Information:</h2>
          <ul>
            <li>The form must be completed within 14 days</li>
            <li>You can save your progress and return to complete it later</li>
            <li>The DBS check must be an Enhanced check with barred list</li>
            <li>Processing typically takes 2-4 weeks</li>
          </ul>

          <p><strong>Your secure form link:</strong> <a href="${formUrl}">${formUrl}</a></p>
          <p><strong>Application Reference:</strong> ${applicationId}</p>

          <p>If you have any questions, please contact the registration team.</p>

          <p>Best regards,<br>Childminder Registration Team</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Brevo email error:", errorData);
      throw new Error(`Email failed: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    // Send confirmation email to applicant
    const applicantEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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
        to: [{ email: applicantName }],
        subject: "Suitability Form Sent to Household Member",
        htmlContent: `
          <h1>Suitability Form Sent</h1>
          <p>Dear ${applicantName},</p>
          <p>We have sent the CMA-H2 Suitability Check form to <strong>${memberName}</strong> at ${memberEmail}.</p>
          
          <p>They will need to complete this form as part of your childminder registration application.</p>
          
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>${memberName} will receive an email with a secure link to their form</li>
            <li>They should complete the form within 14 days</li>
            <li>You will be notified once they have submitted it</li>
            <li>We may need to conduct a DBS check if they don't already have one</li>
          </ul>

          <p><strong>Application Reference:</strong> ${applicationId}</p>

          <p>If you have any questions, please contact the registration team.</p>

          <p>Best regards,<br>Childminder Registration Team</p>
        `,
      }),
    });

    if (!applicantEmailResponse.ok) {
      console.error("Failed to send applicant confirmation email");
    }

    // Get current member data to track reminder history
    const { data: memberData } = await supabase
      .from("household_member_dbs_tracking")
      .select("reminder_count, reminder_history")
      .eq("id", memberId)
      .single();

    const currentReminderCount = memberData?.reminder_count || 0;
    const currentHistory = memberData?.reminder_history || [];
    
    // Add to reminder history
    const newHistoryEntry = {
      date: new Date().toISOString(),
      type: 'dbs_request',
      recipient: memberEmail,
      success: true
    };
    
    // Update request date and reminder tracking in table
    const { error: updateError } = await supabase
      .from("household_member_dbs_tracking")
      .update({
        dbs_status: "requested",
        dbs_request_date: new Date().toISOString(),
        last_contact_date: new Date().toISOString(),
        reminder_count: currentReminderCount + 1,
        last_reminder_date: new Date().toISOString(),
        reminder_history: [...currentHistory, newHistoryEntry],
      })
      .eq("id", memberId);

    if (updateError) {
      console.error("Error updating DBS tracking:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true, emailData }), {
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
