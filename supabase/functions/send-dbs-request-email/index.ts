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
  memberEmail: string;
  applicantName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberId, memberEmail, applicantName }: DBSRequestData = await req.json();
    
    console.log("Sending DBS request for member:", memberId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get member details
    const { data: memberData, error: memberError } = await supabase
      .from("household_member_dbs_tracking")
      .select("*")
      .eq("id", memberId)
      .single();

    if (memberError || !memberData) {
      throw new Error("Member not found");
    }

    // Update member tracking - mark DBS as requested
    const { error: updateError } = await supabase
      .from("household_member_dbs_tracking")
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

    // Send DBS reminder email to household member
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
        to: [{ email: memberEmail, name: memberData.full_name }],
        subject: "DBS Check Required - Action Needed",
        htmlContent: `
          <h1>DBS Check Required</h1>
          <p>Dear ${memberData.full_name},</p>
          <p>${applicantName} has applied to become a registered childminder. As an adult member of their household, we need to conduct a DBS (Disclosure and Barring Service) check for you.</p>
          
          <p><strong>What you need to do:</strong></p>
          <ul>
            <li>Please contact the registration team to arrange your DBS check</li>
            <li>You will need to provide identification documents</li>
            <li>The process typically takes 2-4 weeks</li>
          </ul>

          <p><strong>Important:</strong> The childminder registration cannot proceed until all required DBS checks are completed.</p>

          <p>If you have any questions or need to schedule your DBS check, please contact:</p>
          <p>Email: ${Deno.env.get("BREVO_SENDER_EMAIL") || "registration@yourdomain.com"}</p>

          <p>Best regards,<br>Childminder Registration Team</p>
        `,
      }),
    });

    if (!memberEmailResponse.ok) {
      console.error("Failed to send DBS request email");
      throw new Error("Failed to send email");
    }

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
