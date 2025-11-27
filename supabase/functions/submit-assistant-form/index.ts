import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { token, formData } = await req.json();

    console.log(`[submit-assistant-form] Processing submission for token: ${token}`);

    // Get assistant and application details
    const { data: assistant, error: assistantError } = await supabase
      .from("assistant_dbs_tracking")
      .select(`
        *,
        childminder_applications!inner(
          id, first_name, last_name, email
        )
      `)
      .eq("form_token", token)
      .single();

    if (assistantError) throw assistantError;
    if (!assistant) throw new Error("Invalid form token");

    // Update form with submitted status
    const { error: formError } = await supabase
      .from("assistant_forms")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
        ...formData,
      })
      .eq("form_token", token);

    if (formError) throw formError;

    // Update tracking record
    const { error: trackingError } = await supabase
      .from("assistant_dbs_tracking")
      .update({
        form_status: "submitted",
        form_submitted_date: new Date().toISOString(),
      })
      .eq("id", assistant.id);

    if (trackingError) throw trackingError;

    // Send confirmation email to assistant
    const confirmationResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": Deno.env.get("BREVO_API_KEY") || "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Ready Kids Registration",
          email: Deno.env.get("BREVO_SENDER_EMAIL") || "noreply@readykids.co.uk",
        },
        to: [{ email: assistant.email, name: `${assistant.first_name} ${assistant.last_name}` }],
        subject: "CMA-A1 Form Submitted Successfully",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ready Kids</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <div style="background-color: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">✓ Form Submitted Successfully</h2>
              </div>
              
              <p>Dear ${assistant.first_name},</p>
              
              <p>Thank you for completing your <strong>CMA-A1 Suitability Check</strong> form. We have received your submission.</p>
              
              <p>Your form has been sent to ${assistant.childminder_applications.first_name} ${assistant.childminder_applications.last_name} for review.</p>
              
              <p>If any additional information is required, you will be contacted directly.</p>
              
              <p style="margin-top: 30px;">
                <strong>Ready Kids Registration Team</strong>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!confirmationResponse.ok) {
      console.error("[submit-assistant-form] Failed to send confirmation email");
    }

    // Send notification to applicant
    const applicantNotificationResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": Deno.env.get("BREVO_API_KEY") || "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Ready Kids Registration",
          email: Deno.env.get("BREVO_SENDER_EMAIL") || "noreply@readykids.co.uk",
        },
        to: [{ 
          email: assistant.childminder_applications.email, 
          name: `${assistant.childminder_applications.first_name} ${assistant.childminder_applications.last_name}` 
        }],
        subject: "Assistant Form Completed",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ready Kids</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2 style="color: #1e40af; margin-top: 0;">Assistant Form Completed</h2>
              
              <p>Dear ${assistant.childminder_applications.first_name},</p>
              
              <p>${assistant.first_name} ${assistant.last_name} has successfully completed their CMA-A1 Suitability Check form.</p>
              
              <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${assistant.first_name} ${assistant.last_name}</p>
                <p style="margin: 5px 0;"><strong>Role:</strong> ${assistant.role}</p>
                <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>You can now view and download the completed form from your admin dashboard.</p>
              
              <p style="margin-top: 30px;">
                <strong>Ready Kids Registration Team</strong>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!applicantNotificationResponse.ok) {
      console.error("[submit-assistant-form] Failed to send applicant notification");
    }

    console.log(`[submit-assistant-form] Form submitted successfully for ${assistant.first_name} ${assistant.last_name}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[submit-assistant-form] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
