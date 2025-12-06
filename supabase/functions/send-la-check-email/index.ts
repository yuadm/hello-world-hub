import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const brevoApiKey = Deno.env.get("BREVO_API_KEY");
const brevoSenderEmail = Deno.env.get("BREVO_SENDER_EMAIL") || "noreply@readykids.co.uk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LACheckRequest {
  laEmail: string;
  applicantName: string;
  dateOfBirth: string;
  currentAddress: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
    moveInDate: string;
  };
  previousAddresses?: Array<{
    address: string;
    dateFrom: string;
    dateTo: string;
  }>;
  previousNames?: Array<{
    name: string;
    dateFrom: string;
    dateTo: string;
  }>;
  role: string;
  localAuthority: string;
  requesterName: string;
  requesterRole: string;
  agencyName: string;
  parentId?: string;
  parentType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: LACheckRequest = await req.json();
    
    console.log("Received LA check request:", {
      laEmail: data.laEmail,
      applicantName: data.applicantName,
      localAuthority: data.localAuthority,
      role: data.role,
      parentId: data.parentId,
      parentType: data.parentType,
    });

    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a unique token for this form
    const formToken = crypto.randomUUID();
    
    // Generate reference ID
    const year = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
    const referenceId = `LA-${year}-${seq}`;

    // Build the form URL with query parameters
    const baseUrl = "https://childminderpro.vercel.app";
    const formUrl = new URL(`${baseUrl}/la-form`);
    
    // Encode form data as URL parameters
    formUrl.searchParams.set("token", formToken);
    formUrl.searchParams.set("ref", referenceId);
    formUrl.searchParams.set("name", data.applicantName);
    formUrl.searchParams.set("dob", data.dateOfBirth || "");
    formUrl.searchParams.set("address", JSON.stringify(data.currentAddress));
    formUrl.searchParams.set("prevAddresses", JSON.stringify(data.previousAddresses || []));
    formUrl.searchParams.set("prevNames", JSON.stringify(data.previousNames || []));
    formUrl.searchParams.set("role", data.role);
    formUrl.searchParams.set("la", data.localAuthority);
    formUrl.searchParams.set("requesterName", data.requesterName);
    formUrl.searchParams.set("requesterRole", data.requesterRole);
    formUrl.searchParams.set("agency", data.agencyName);

    // Save to database
    const submissionData: Record<string, unknown> = {
      form_token: formToken,
      reference_id: referenceId,
      applicant_name: data.applicantName,
      date_of_birth: data.dateOfBirth || null,
      role: data.role,
      local_authority: data.localAuthority,
      la_email: data.laEmail,
      requester_name: data.requesterName,
      requester_role: data.requesterRole,
      status: 'pending',
      sent_at: new Date().toISOString(),
      request_data: {
        currentAddress: data.currentAddress,
        previousAddresses: data.previousAddresses || [],
        previousNames: data.previousNames || [],
        agencyName: data.agencyName,
        requesterName: data.requesterName,
        requesterRole: data.requesterRole,
        role: data.role,
        localAuthority: data.localAuthority,
      },
    };

    if (data.parentType === 'application' && data.parentId) {
      submissionData.application_id = data.parentId;
    } else if (data.parentType === 'employee' && data.parentId) {
      submissionData.employee_id = data.parentId;
    }

    const { error: insertError } = await supabase
      .from('la_form_submissions')
      .insert(submissionData);

    if (insertError) {
      console.error("Error saving submission:", insertError);
    } else {
      console.log("LA submission saved to database:", referenceId);
    }

    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'N/A';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    const formatMonthYear = (dateStr: string) => {
      if (!dateStr) return 'N/A';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    const roleLabels: Record<string, string> = {
      childminder: 'Registered childminder',
      household_member: 'Adult household member',
      assistant: 'Childminding assistant',
      manager: 'Manager',
      nominated_individual: 'Nominated individual',
    };

    // Build previous addresses HTML
    let previousAddressesHtml = '';
    if (data.previousAddresses && data.previousAddresses.length > 0) {
      previousAddressesHtml = data.previousAddresses.map((addr, idx) => 
        `<li>${addr.address} – from ${formatMonthYear(addr.dateFrom)} to ${formatMonthYear(addr.dateTo)}</li>`
      ).join('');
    } else {
      previousAddressesHtml = '<li>None provided</li>';
    }

    // Build previous names HTML
    let previousNamesHtml = '';
    if (data.previousNames && data.previousNames.length > 0) {
      previousNamesHtml = data.previousNames.map(n => n.name).join(', ');
    } else {
      previousNamesHtml = 'None';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 14px; }
          .container { max-width: 700px; margin: 0 auto; padding: 24px; }
          .header { border-bottom: 3px solid #1B9AAA; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 18px; color: #1B9AAA; }
          .agency-details { margin-bottom: 24px; font-size: 13px; }
          .letter { background: #fff; }
          .letter p { margin: 0 0 12px; }
          .applicant-details { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .applicant-details ul { margin: 8px 0; padding-left: 24px; }
          .applicant-details li { margin: 4px 0; }
          .request-section { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .request-section ol { margin: 8px 0; padding-left: 24px; }
          .request-section li { margin: 8px 0; }
          .btn { display: inline-block; background: #1B9AAA; color: white !important; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Local Authority Children's Services Check Request</h1>
          </div>
          
          <div class="agency-details">
            <strong>${data.agencyName}</strong><br>
            Ofsted-registered Childminder Agency<br>
            Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <div class="letter">
            <p><strong>Private and Confidential</strong><br>
            For the attention of: Director of Children's Services / LADO / Children's Services Checks Team<br>
            ${data.localAuthority}</p>
            
            <p>Dear Sir/Madam,</p>
            
            <p><strong>Re: Local authority children's services check – ${data.applicantName}, DOB ${formatDate(data.dateOfBirth)}</strong></p>
            
            <p>${data.agencyName} is an Ofsted-registered childminder agency. We are currently assessing the suitability of the above-named individual to register as a ${roleLabels[data.role] || data.role}.</p>
            
            <p>In line with Ofsted's expectations for suitability checks on early years providers, we are seeking information from your children's services records to help us assess whether this person is suitable to care for, or be in regular contact with, children.</p>
            
            <div class="applicant-details">
              <strong>The applicant's details are as follows:</strong>
              <ul>
                <li><strong>Full name:</strong> ${data.applicantName}</li>
                <li><strong>Previous names (if any):</strong> ${previousNamesHtml}</li>
                <li><strong>Date of birth:</strong> ${formatDate(data.dateOfBirth)}</li>
                <li><strong>Current address:</strong> ${data.currentAddress?.line1 || ''}, ${data.currentAddress?.line2 ? data.currentAddress.line2 + ', ' : ''}${data.currentAddress?.town || ''}, ${data.currentAddress?.postcode || ''} (from ${formatMonthYear(data.currentAddress?.moveInDate)})</li>
                <li><strong>Previous addresses (last 5 years):</strong>
                  <ul>${previousAddressesHtml}</ul>
                </li>
                <li><strong>Role applied for:</strong> ${roleLabels[data.role] || data.role}</li>
              </ul>
            </div>
            
            <p><strong>Consent</strong><br>
            The applicant has signed our application and consent form confirming that they understand we will request information from local authority children's services, and consent to relevant information being shared with ${data.agencyName} for the purpose of assessing their suitability.</p>
            
            <div class="request-section">
              <strong>Request</strong>
              <p>We would be grateful if you could check your children's services and safeguarding records (including, where relevant, LADO records) to identify any information relevant to this individual's suitability.</p>
              <p>Please indicate whether:</p>
              <ol>
                <li>The person is <strong>NOT known</strong> to your children's services in any capacity relevant to this request; or</li>
                <li>The person <strong>IS known</strong> but there is <strong>NO information</strong> which you consider relevant to their suitability; or</li>
                <li>The person <strong>IS known</strong> and you hold <strong>relevant information</strong> (e.g., child protection enquiries, LADO referrals, removal of a child from care); or</li>
                <li>You <strong>hold information</strong> but are <strong>unable to provide it</strong> at this stage.</li>
              </ol>
            </div>
            
            <p>Please click the button below to complete your response:</p>
            
            <a href="${formUrl.toString()}" class="btn">Complete Response Form</a>
            
            <p style="font-size: 12px; color: #6b7280;">Or copy this link: <a href="${formUrl.toString()}">${formUrl.toString()}</a></p>
            
            <p><strong>Data protection</strong><br>
            We will use any information you provide solely to make a suitability decision about this person's registration with our agency. Information will be handled and stored securely in accordance with data protection legislation.</p>
            
            <p>We would be very grateful if you could complete and give a response within <strong>10 working days</strong> where possible.</p>
            
            <p>Thank you for your assistance in safeguarding children.</p>
            
            <p>Yours faithfully,</p>
            
            <p><strong>${data.requesterName}</strong><br>
            ${data.requesterRole}<br>
            ${data.agencyName}</p>
            
            <div class="footer">
              <p>Reference: ${referenceId}</p>
              <p>This email was sent by ${data.agencyName} | Operating under the Childcare Act 2006</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Brevo API
    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: data.agencyName,
          email: brevoSenderEmail,
        },
        to: [
          {
            email: data.laEmail,
            name: `${data.localAuthority} Children's Services`,
          },
        ],
        subject: `Local Authority Children's Services Check - ${data.applicantName} (${referenceId})`,
        htmlContent: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Brevo API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("LA check email sent successfully:", emailResult);

    return new Response(JSON.stringify({ 
      success: true, 
      referenceId,
      formToken,
      emailResult 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-la-check-email:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
