
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { 
  corsHeaders,
  handleCorsPreflightRequest,
  parseRequestBody,
  createErrorResponse,
  createSuccessResponse,
  formatTextWithLineBreaks,
  formatPoemForEmail
} from "../_shared/email-utils.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const adminEmail = "matthiasvogel1973@gmail.com"; // Admin email for CC

interface SendPoemRequest {
  recipientEmail: string;
  recipientName?: string;
  poemTitle: string;
  poemContent: string;
  personalMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    const startTime = new Date();
    console.log(`[send-poem] Starting execution at ${startTime.toISOString()}`);
    
    // Validate Resend API key
    if (!resendApiKey) {
      console.error('[send-poem] CRITICAL ERROR: Resend API key is not configured');
      return createErrorResponse('Resend API key is not configured on the server', 500);
    }

    console.log(`[send-poem] Resend API key found, length: ${resendApiKey.length}`);
    const resend = new Resend(resendApiKey);
    
    // Parse and validate request body
    const { data, error } = await parseRequestBody<SendPoemRequest>(req);
    if (error) return createErrorResponse(error, 400);
    
    const { recipientEmail, recipientName, poemTitle, poemContent, personalMessage } = data!;
    
    console.log('[send-poem] Extracted data:', { 
      recipientEmail, 
      recipientNameProvided: !!recipientName,
      poemTitleLength: poemTitle?.length,
      poemContentLength: poemContent?.length,
      hasPersonalMessage: !!personalMessage
    });
    
    // Validate required fields
    if (!recipientEmail) {
      return createErrorResponse('Recipient email address is required', 400);
    }
    
    if (!poemTitle || !poemContent) {
      return createErrorResponse('Poem title and content are required', 400);
    }

    console.log(`[send-poem] Preparing to send email to: ${recipientEmail}, with CC to: ${adminEmail}`);

    // Format poem content for email
    const formattedPoemContent = formatPoemForEmail(poemContent);
    
    // Format personal message if present
    const formattedPersonalMessage = personalMessage 
      ? formatTextWithLineBreaks(personalMessage)
      : null;

    // Prepare email to recipient
    const emailPayload = {
      from: 'Poetica <poem@poetica.apvora.com>',
      to: [recipientEmail],
      cc: [adminEmail], // Always CC the admin
      subject: `Ihr Gedicht: ${poemTitle}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: left; margin-bottom: 20px;">
            <h1 style="font-family: serif; font-size: 24px; margin: 0;">Poetica</h1>
          </div>
          
          ${formattedPersonalMessage ? `
          <div style="margin-bottom: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #1d3557;">
            <p style="font-style: italic; margin: 0;">${formattedPersonalMessage}</p>
          </div>
          ` : ''}
          
          <h1 style="font-family: 'Playfair Display', serif; text-align: center; color: #1d3557; margin-bottom: 20px;">
            ${poemTitle}
          </h1>
          
          <div style="font-family: 'Playfair Display', serif; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
            ${formattedPoemContent}
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #6c757d; border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 30px;">
            Erstellt mit <a href="https://poetica.apvora.com" style="color: #1d3557; text-decoration: none;">poetica.apvora.com</a>
          </p>
        </div>
      `,
    };

    // Logging the email payload (excluding content for brevity)
    console.log('[send-poem] Sending email with payload:', JSON.stringify({
      from: emailPayload.from,
      to: emailPayload.to,
      cc: emailPayload.cc,
      subject: emailPayload.subject,
      htmlLength: emailPayload.html.length,
    }));

    // Send email
    try {
      // Send the email to the recipient with CC to admin
      const result = await resend.emails.send(emailPayload);
      
      console.log('[send-poem] Raw result from Resend API:', JSON.stringify(result));
      
      if (result.error) {
        console.error('[send-poem] Error returned from Resend API:', result.error);
        return createErrorResponse(`Resend API error: ${result.error.message}`, 400, result.error);
      }

      // Send a separate admin notification to ensure they receive it
      // This acts as a backup mechanism in case the CC fails
      try {
        const adminNotification = await resend.emails.send({
          from: 'Poetica <poem@poetica.apvora.com>',
          to: [adminEmail],
          subject: `[ADMIN COPY] Gedicht gesendet: ${poemTitle}`,
          html: `
            <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: left; margin-bottom: 20px;">
                <h1 style="font-family: serif; font-size: 24px; margin: 0;">Poetica - Admin Benachrichtigung</h1>
              </div>
              
              <p style="margin-bottom: 20px;">
                Ein Gedicht wurde an <strong>${recipientEmail}</strong> gesendet.
              </p>
              
              <h2 style="font-family: 'Playfair Display', serif; color: #1d3557; margin-bottom: 10px;">
                ${poemTitle}
              </h2>
              
              <div style="font-family: 'Playfair Display', serif; background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
                ${formattedPoemContent}
              </div>
            </div>
          `,
        });
        
        console.log('[send-poem] Admin notification sent:', JSON.stringify({
          success: !adminNotification.error,
          error: adminNotification.error
        }));
      } catch (adminError) {
        // Log the error but don't fail the entire request if only the admin notification fails
        console.error('[send-poem] Error sending admin notification:', adminError);
      }

      console.log('[send-poem] Email sent successfully:', result.data);
      const endTime = new Date();
      const executionTime = endTime.getTime() - startTime.getTime();
      console.log(`[send-poem] Function completed in ${executionTime}ms`);

      return createSuccessResponse(result.data);
    } catch (sendError) {
      console.error('[send-poem] Exception while calling Resend API:', sendError);
      return createErrorResponse(`Exception calling Resend API: ${sendError.message}`, 500, {
        stack: sendError.stack
      });
    }
  } catch (error) {
    console.error('[send-poem] Unhandled error:', error.message, error.stack);
    return createErrorResponse(`Unhandled server error: ${error.message}`, 500, {
      stack: error.stack
    });
  }
});
