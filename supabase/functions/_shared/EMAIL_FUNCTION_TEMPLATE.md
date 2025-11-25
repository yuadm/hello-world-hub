# Email Edge Function Template

Use this template when creating new email-sending edge functions.

## Quick Start Template

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { sendEmail, createEmailTemplate } from "../_shared/email-service.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface YourRequestData {
  // Define your request parameters
  recipientEmail: string;
  recipientName: string;
  // ... other fields
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { recipientEmail, recipientName }: YourRequestData = await req.json();
    
    console.log("Processing email request for:", recipientEmail);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch any required data
    // const { data, error } = await supabase...

    // Create email content
    const emailContent = `
      <p>Dear ${recipientName},</p>
      <p>Your personalized message here.</p>
      
      <p><strong>Important information:</strong></p>
      <ul>
        <li>Point 1</li>
        <li>Point 2</li>
        <li>Point 3</li>
      </ul>

      <p>Use <a href="https://example.com" class="button">this button style</a> for CTAs.</p>

      <p>Additional details...</p>
    `;

    // Wrap in template
    const htmlContent = createEmailTemplate(
      'Email Subject/Title',
      emailContent,
      'Optional custom footer text'
    );

    // Send email with automatic retry
    console.log("Sending email to:", recipientEmail);
    const emailResult = await sendEmail({
      to: recipientEmail,
      toName: recipientName,
      subject: 'Your Email Subject',
      htmlContent,
    });

    // Handle result
    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Failed to send email');
    }

    console.log("Email sent successfully, messageId:", emailResult.messageId);

    // Optionally update database
    // await supabase.from('table').update({...})...

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully",
        messageId: emailResult.messageId
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in your-function-name:", error);
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
```

## Configuration Checklist

When creating a new email function:

- [ ] Import shared email utilities
- [ ] Define TypeScript interface for request data
- [ ] Add CORS headers and OPTIONS handler
- [ ] Add detailed logging for debugging
- [ ] Use `sendEmail()` for automatic retry logic
- [ ] Use `createEmailTemplate()` for consistent styling
- [ ] Handle errors gracefully with try/catch
- [ ] Return proper HTTP status codes
- [ ] Log success and error cases
- [ ] Test with actual email addresses

## Email Content Guidelines

### Do's ✅
- Use clear, concise language
- Include all necessary information
- Add actionable next steps
- Use bullet points for clarity
- Include contact information
- Test across email clients
- Use semantic HTML

### Don'ts ❌
- Don't use overly complex HTML
- Don't forget to escape user data
- Don't send without testing
- Don't use broken links
- Don't ignore accessibility
- Don't forget mobile users

## Testing Your Function

1. **Local Testing** (if configured):
```bash
supabase functions serve your-function-name
```

2. **Test Request**:
```bash
curl -X POST http://localhost:54321/functions/v1/your-function-name \\\
  -H "Content-Type: application/json" \\\
  -d '{"recipientEmail":"test@example.com","recipientName":"Test User"}'
```

3. **Check Logs**:
- View function logs in Supabase dashboard
- Check email delivery in Brevo dashboard
- Verify recipient received email

## Common Patterns

### Multiple Recipients

```typescript
// Send to multiple people
for (const recipient of recipients) {
  const result = await sendEmail({
    to: recipient.email,
    toName: recipient.name,
    subject: 'Subject',
    htmlContent,
  });
  
  if (!result.success) {
    console.error(`Failed for ${recipient.email}:`, result.error);
    // Handle individual failures
  }
}
```

### Conditional Content

```typescript
const emailContent = `
  <p>Dear ${name},</p>
  ${isUrgent ? '<p><strong>⚠️ URGENT:</strong> Immediate action required!</p>' : ''}
  <p>Your regular content...</p>
`;
```

### With Attachments (future)

```typescript
// Not currently supported, but can be added to email-service.ts
// when needed by extending the EmailData interface
```

## Error Handling

Always handle these scenarios:
- Invalid email addresses
- Missing required data
- Database query failures
- Email service failures
- Network timeouts

## Performance Tips

- Use batch operations where possible
- Don't wait for non-critical emails
- Log important events for monitoring
- Set reasonable timeouts
- Handle retries gracefully

## Security Considerations

- Validate all input data
- Escape user-generated content
- Don't expose sensitive data in logs
- Use parameterized queries
- Verify permissions before sending
