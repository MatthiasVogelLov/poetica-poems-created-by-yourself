
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const recipientEmail = "matthiasvogel1973@gmail.com";

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
    console.log('Starting notify-poem function execution');
    
    if (!resendApiKey) {
      console.error('Resend API key is not configured');
      throw new Error('Resend API key is not configured');
    }

    console.log('Resend API key found, length:', resendApiKey.length);
    const resend = new Resend(resendApiKey);
    
    const body = await req.text();
    console.log('Request body received:', body);
    
    let poemTitle, formData, poemContent;
    try {
      const parsedBody = JSON.parse(body);
      poemTitle = parsedBody.poemTitle;
      formData = parsedBody.formData;
      poemContent = parsedBody.poemContent;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      throw new Error(`Failed to parse request body: ${parseError.message}`);
    }
    
    if (!poemTitle) {
      console.error('Missing poem title');
      throw new Error('Missing poem title');
    }

    console.log('Sending poem notification:', { 
      poemTitle, 
      hasContent: !!poemContent, 
      hasFormData: !!formData,
      recipientEmail,
    });

    // Format the form data for the email
    const formDataList = Object.entries(formData || {})
      .filter(([key]) => key !== 'poem') // Exclude the poem content from the list
      .map(([key, value]) => {
        // Format the key for better readability
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
      })
      .join('');

    console.log('Formatted form data for email');

    // Send email notification
    const emailPayload = {
      from: 'Poetica <notification@poetica-app.com>',
      to: recipientEmail,
      subject: `Neues Gedicht: ${poemTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1d3557; border-bottom: 1px solid #ddd; padding-bottom: 10px;">${poemTitle}</h1>
          
          <h2 style="color: #457b9d; margin-top: 20px;">Gedicht</h2>
          <div style="white-space: pre-line; font-family: 'Playfair Display', serif; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6;">
            ${poemContent || 'Kein Gedichttext verfügbar'}
          </div>
          
          <h2 style="color: #457b9d; margin-top: 20px;">Gewählte Einstellungen</h2>
          <ul style="line-height: 1.6;">
            ${formDataList || '<li>Keine Einstellungen verfügbar</li>'}
          </ul>
          
          <p style="margin-top: 30px; color: #6c757d; font-size: 14px; border-top: 1px solid #ddd; padding-top: 10px;">
            Diese E-Mail wurde automatisch von der Poetica App gesendet.
          </p>
        </div>
      `
    };

    console.log('About to send email with payload:', JSON.stringify({
      to: emailPayload.to,
      subject: emailPayload.subject
    }));

    try {
      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error('Error from Resend API:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log('Email notification sent successfully:', data);
    } catch (sendError) {
      console.error('Exception while calling Resend API:', sendError);
      throw new Error(`Exception calling Resend API: ${sendError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error.message, error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
