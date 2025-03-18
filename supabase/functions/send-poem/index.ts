
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const adminEmail = "matthiasvogel1973@gmail.com"; // Admin email for CC

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = new Date();
    console.log(`[send-poem] Starting execution at ${startTime.toISOString()}`);
    
    // Validate Resend API key
    if (!resendApiKey) {
      console.error('[send-poem] CRITICAL ERROR: Resend API key is not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Resend API key is not configured on the server'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    console.log(`[send-poem] Resend API key found, length: ${resendApiKey.length}`);
    const resend = new Resend(resendApiKey);
    
    // Parse request body
    let body;
    let parsedBody;
    
    try {
      body = await req.json();
      console.log('[send-poem] Request body received successfully');
    } catch (parseError) {
      console.error('[send-poem] Error reading request body:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to read request body, make sure it is valid JSON' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    // Extract required fields and validate
    const { recipientEmail, recipientName, poemTitle, poemContent, personalMessage } = body;
    
    console.log('[send-poem] Extracted data:', { 
      recipientEmail, 
      recipientNameProvided: !!recipientName,
      poemTitleLength: poemTitle?.length,
      poemContentLength: poemContent?.length,
      hasPersonalMessage: !!personalMessage
    });
    
    // Validate required fields
    if (!recipientEmail) {
      console.error('[send-poem] Missing recipient email address');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Recipient email address is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    if (!poemTitle || !poemContent) {
      console.error('[send-poem] Missing poem title or content');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Poem title and content are required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log(`[send-poem] Preparing to send email to: ${recipientEmail}, with CC to: ${adminEmail}`);

    // Format poem content to preserve line breaks and stanzas
    const formattedPoemContent = poemContent
      .split('\n\n') // Split by double line breaks (stanzas)
      .map(stanza => {
        // For each stanza, wrap each line in a paragraph tag
        return stanza
          .split('\n')
          .map(line => `<p style="margin: 0; line-height: 1.6;">${line || '&nbsp;'}</p>`)
          .join('');
      })
      .map(stanza => `<div style="margin-bottom: 1em;">${stanza}</div>`) // Wrap each stanza in a div with bottom margin
      .join('');

    // Prepare email
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
          
          ${personalMessage ? `
          <div style="margin-bottom: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #1d3557;">
            <p style="font-style: italic; margin: 0;">${personalMessage.replace(/\n/g, '<br />')}</p>
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
      const result = await resend.emails.send(emailPayload);
      
      console.log('[send-poem] Raw result from Resend API:', JSON.stringify(result));
      
      const { data, error } = result;

      if (error) {
        console.error('[send-poem] Error returned from Resend API:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Resend API error: ${error.message}`, 
            details: error 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }

      console.log('[send-poem] Email sent successfully:', data);
      const endTime = new Date();
      const executionTime = endTime.getTime() - startTime.getTime();
      console.log(`[send-poem] Function completed in ${executionTime}ms`);

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (sendError) {
      console.error('[send-poem] Exception while calling Resend API:', sendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Exception calling Resend API: ${sendError.message}`,
          stack: sendError.stack
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }
  } catch (error) {
    console.error('[send-poem] Unhandled error:', error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unhandled server error: ${error.message}`,
        stack: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
