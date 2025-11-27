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

    const { assistantId, customEmail, applicantEmail, applicantName, isEmployee, employeeEmail, employeeName } = await req.json();

    console.log(`[send-assistant-form-email] Processing for assistant: ${assistantId}, isEmployee: ${isEmployee}`);

    // Determine which table to query based on isEmployee flag
    const tableName = isEmployee ? "employee_assistants" : "assistant_dbs_tracking";
    const parentEmail = isEmployee ? employeeEmail : applicantEmail;
    const parentName = isEmployee ? employeeName : applicantName;

    // Get assistant details
    const { data: assistant, error: assistantError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", assistantId)
      .single();

    if (assistantError) throw assistantError;

    // Generate secure token
    const formToken = crypto.randomUUID();

    // Update assistant with form token
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        form_token: formToken,
        form_status: "sent",
        form_sent_date: new Date().toISOString(),
        email: customEmail || assistant.email,
        reminder_count: (assistant.reminder_count || 0) + 1,
        last_reminder_date: new Date().toISOString(),
      })
      .eq("id", assistantId);

    if (updateError) throw updateError;

    // For employees, we still need to get the application_id from the employee
    let applicationId = assistant.application_id;
    if (isEmployee) {
      const { data: employee } = await supabase
        .from("employees")
        .select("application_id")
        .eq("id", assistant.employee_id)
        .single();
      
      applicationId = employee?.application_id || null;
    }

    // Create draft form record (only if we have an application_id)
    if (applicationId) {
      const { error: formError } = await supabase
        .from("assistant_forms")
        .insert({
          assistant_id: assistantId,
          application_id: applicationId,
          form_token: formToken,
          status: "draft",
        });

      if (formError) {
        console.error("[send-assistant-form-email] Failed to create form record:", formError);
        // Don't throw - continue with email sending
      }
    }

    // Send email to assistant via Brevo
    const assistantEmailAddress = customEmail || assistant.email;
    const formUrl = `https://childminderpro.vercel.app/assistant-form?token=${formToken}`;

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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
        to: [{ email: assistantEmailAddress, name: `${assistant.first_name} ${assistant.last_name}` }],
        subject: "Complete Your CMA-A1 Suitability Form - Assistant/Co-childminder Check",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ready Kids</h1>
              <p style="margin: 5px 0 0 0;">Childminder Registration Service</p>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2 style="color: #1e40af; margin-top: 0;">Suitability Check Required</h2>
              
              <p>Dear ${assistant.first_name},</p>
              
              <p>You have been asked to complete a <strong>CMA-A1 Suitability Check</strong> form because you will be working as a <strong>${assistant.role}</strong> for ${parentName}.</p>
              
              <p>This is a mandatory requirement for anyone working in a childminding setting. The form will ask about your personal details, address history, professional background, and suitability to work with children.</p>
              
              <div style="background-color: white; padding: 20px; margin: 25px 0; border-left: 4px solid #1e40af;">
                <p style="margin: 0 0 15px 0; font-weight: bold;">Click the button below to access your secure form:</p>
                <a href="${formUrl}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Complete CMA-A1 Form</a>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul style="color: #374151;">
                <li>This link is unique to you and should not be shared</li>
                <li>You can save your progress and return later</li>
                <li>Please complete the form within 14 days</li>
                <li>All information will be kept confidential</li>
              </ul>
              
              <p>If you have any questions or need assistance, please contact ${parentName} at ${parentEmail}.</p>
              
              <p>Thank you for your cooperation.</p>
              
              <p style="margin-top: 30px;">
                <strong>Ready Kids Registration Team</strong>
              </p>
            </div>
            
            <div style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">This is an automated message from Ready Kids Childminder Registration Service</p>
            </div>
          </div>
        `,
      }),
    });

    if (!brevoResponse.ok) {
      const error = await brevoResponse.text();
      console.error("[send-assistant-form-email] Brevo error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    console.log(`[send-assistant-form-email] Email sent successfully to ${assistantEmailAddress}`);

    // Send notification to parent (applicant or employee)
    const parentNotificationResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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
        to: [{ email: parentEmail, name: parentName }],
        subject: "CMA-A1 Form Sent Successfully",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ready Kids</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2 style="color: #1e40af; margin-top: 0;">Form Request Sent</h2>
              
              <p>Dear ${parentName},</p>
              
              <p>The CMA-A1 Suitability Check form has been successfully sent to:</p>
              
              <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${assistant.first_name} ${assistant.last_name}</p>
                <p style="margin: 5px 0;"><strong>Role:</strong> ${assistant.role}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${assistantEmailAddress}</p>
              </div>
              
              <p>They will receive an email with a secure link to complete the form. You will be notified once they submit it.</p>
              
              <p style="margin-top: 30px;">
                <strong>Ready Kids Registration Team</strong>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!parentNotificationResponse.ok) {
      console.error("[send-assistant-form-email] Failed to send parent notification");
    }

    return new Response(
      JSON.stringify({ success: true, formToken }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[send-assistant-form-email] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
