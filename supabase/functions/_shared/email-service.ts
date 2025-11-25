/**
 * Shared Email Service for Supabase Edge Functions
 * Provides centralized email sending with retry logic, validation, and error handling
 */

interface EmailConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
}

interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Get email configuration from environment variables
 */
export function getEmailConfig(): EmailConfig {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  
  if (!apiKey) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  return {
    apiKey,
    senderEmail: 'yuadm3@gmail.com',
    senderName: 'Childminder Registration',
  };
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send email with retry logic
 */
export async function sendEmail(
  emailData: EmailData,
  retries = 3,
  retryDelay = 1000
): Promise<EmailResponse> {
  const config = getEmailConfig();

  // Validate recipient email
  if (!isValidEmail(emailData.to)) {
    console.error('Invalid recipient email:', emailData.to);
    return {
      success: false,
      error: 'Invalid recipient email address',
    };
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Email send attempt ${attempt}/${retries} to ${emailData.to}`);

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': config.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: config.senderName,
            email: config.senderEmail,
          },
          to: [
            {
              email: emailData.to,
              name: emailData.toName || emailData.to,
            },
          ],
          subject: emailData.subject,
          htmlContent: emailData.htmlContent,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Brevo API error (${response.status}): ${JSON.stringify(responseData)}`
        );
      }

      console.log('Email sent successfully:', responseData);

      return {
        success: true,
        messageId: responseData.messageId,
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`Email send attempt ${attempt} failed:`, error);

      // If not the last attempt, wait before retrying
      if (attempt < retries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to send email after retries',
  };
}

/**
 * Create standard email template wrapper
 */
export function createEmailTemplate(
  title: string,
  content: string,
  footerText?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 8px 8px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        ul {
          padding-left: 20px;
        }
        a {
          color: #667eea;
          text-decoration: none;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        ${footerText || 'Childminder Registration Team'}<br>
        Email: yuadm3@gmail.com
      </div>
    </body>
    </html>
  `;
}
