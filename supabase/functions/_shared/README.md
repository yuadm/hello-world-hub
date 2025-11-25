# Shared Edge Function Utilities

This directory contains reusable utilities for Supabase Edge Functions.

## Email Service (`email-service.ts`)

Centralized email service with built-in retry logic, validation, and error handling.

### Features

- ✅ Automatic retry with exponential backoff
- ✅ Email validation
- ✅ Consistent error handling and logging
- ✅ Centralized configuration
- ✅ Reusable email templates
- ✅ Type-safe interfaces

### Usage Example

```typescript
import { sendEmail, createEmailTemplate } from "../_shared/email-service.ts";

// Create email content
const emailContent = `
  <p>Hello ${name},</p>
  <p>This is your personalized message.</p>
  <ul>
    <li>Point 1</li>
    <li>Point 2</li>
  </ul>
`;

// Wrap in template
const htmlContent = createEmailTemplate(
  'Email Subject Title',
  emailContent,
  'Custom footer text (optional)'
);

// Send email with automatic retry
const result = await sendEmail({
  to: 'recipient@example.com',
  toName: 'Recipient Name',
  subject: 'Email Subject',
  htmlContent,
});

if (!result.success) {
  throw new Error(result.error);
}

console.log('Email sent:', result.messageId);
```

### Configuration

The email service automatically reads from environment variables:
- `BREVO_API_KEY` - Required Brevo API key
- Sender email: `yuadm3@gmail.com` (hardcoded)
- Sender name: `Childminder Registration` (hardcoded)

### Retry Logic

- Default: 3 retries
- Exponential backoff starting at 1 second
- Detailed logging for each attempt
- Returns success/failure with error details

### Error Handling

All errors are logged with context:
- Invalid email addresses
- API failures
- Network errors
- Retry exhaustion

### Creating New Email Functions

When creating new email edge functions:

1. **Import the utilities**:
```typescript
import { sendEmail, createEmailTemplate } from "../_shared/email-service.ts";
```

2. **Create your email content** using HTML:
```typescript
const emailContent = `
  <p>Your content here</p>
`;
```

3. **Wrap in template** for consistent styling:
```typescript
const htmlContent = createEmailTemplate(
  'Email Title',
  emailContent,
  'Optional footer'
);
```

4. **Send with retry**:
```typescript
const result = await sendEmail({
  to: recipientEmail,
  toName: recipientName,
  subject: 'Email Subject',
  htmlContent,
});
```

5. **Handle result**:
```typescript
if (!result.success) {
  throw new Error(result.error);
}
```

### Template Styling

The email template includes:
- Responsive design (max-width: 600px)
- Professional gradient header
- Clean content area with borders
- Styled footer
- Custom button styles (use `.button` class)
- Mobile-friendly layout

### Best Practices

1. **Always validate inputs** before sending
2. **Use descriptive subjects** for better deliverability
3. **Keep content concise** and clear
4. **Test with different email clients**
5. **Log important events** for debugging
6. **Handle errors gracefully**
7. **Use type-safe interfaces**

### Future Enhancements

Consider adding:
- Email templates for common use cases
- Attachment support
- CC/BCC functionality
- HTML sanitization
- Email queuing for bulk sends
- Delivery status tracking
