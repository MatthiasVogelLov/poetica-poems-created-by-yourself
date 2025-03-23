
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { 
  corsHeaders,
  handleCorsPreflightRequest,
  parseRequestBody,
  createErrorResponse,
  createSuccessResponse,
  formatTextWithLineBreaks
} from "../_shared/email-utils.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY');

interface TellAFriendRequest {
  recipientEmail: string;
  senderName: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('Executing tell-a-friend function');
    
    // Validate Resend API key
    if (!resendApiKey) {
      console.error('Resend API key is not configured');
      return createErrorResponse('Resend API key is not configured', 500);
    }

    console.log('Resend API key found');
    const resend = new Resend(resendApiKey);
    
    // Parse request body
    const { data, error } = await parseRequestBody<TellAFriendRequest>(req);
    if (error) return createErrorResponse(error);
    
    const { recipientEmail, senderName, message } = data!;
    console.log(`Sending recommendation email to: ${recipientEmail} from: ${senderName}`);
    
    // Validate required fields
    if (!recipientEmail || !senderName) {
      return createErrorResponse('Missing required fields');
    }

    // Format message to preserve line breaks
    const formattedMessage = formatTextWithLineBreaks(message);

    // Send email
    const emailResult = await resend.emails.send({
      from: 'Poetica <noreply@poetica.apvora.com>',
      to: recipientEmail,
      subject: `Empfehlung von ${senderName}: Poetica - Erstelle personalisierte Gedichte`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: left; margin-bottom: 20px;">
            <h1 style="font-family: serif; font-size: 24px; margin: 0;">Poetica</h1>
          </div>
          
          <div style="font-family: 'Helvetica', sans-serif; text-align: left; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6; margin-bottom: 30px;">
            ${formattedMessage}
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #6c757d; border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 30px;">
            Diese E-Mail wurde über <a href="https://poetica.apvora.com" style="color: #1d3557; text-decoration: none;">poetica.apvora.com</a> versendet
          </p>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      return createErrorResponse(`Failed to send email: ${emailResult.error.message}`, 400, emailResult.error);
    }

    console.log('Email sent successfully:', emailResult.data);
    return createSuccessResponse(emailResult.data);
  } catch (error) {
    console.error('Error handling request:', error.message);
    return createErrorResponse(error.message, 500, { stack: error.stack });
  }
});
