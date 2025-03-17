
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY');

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
    console.log('Executing tell-a-friend function');
    
    if (!resendApiKey) {
      console.error('Resend API key is not configured');
      throw new Error('Resend API key is not configured');
    }

    console.log('Resend API key found');
    const resend = new Resend(resendApiKey);
    const body = await req.text();
    const { recipientEmail, message } = JSON.parse(body);
    
    console.log(`Sending recommendation email to: ${recipientEmail}`);
    
    if (!recipientEmail || !message) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await resend.emails.send({
      from: 'Poetica <noreply@poetica.apvora.com>',
      to: recipientEmail,
      subject: 'Eine Empfehlung für dich: Poetica - Erstelle personalisierte Gedichte',
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: left; margin-bottom: 20px;">
            <h1 style="font-family: serif; font-size: 24px; margin: 0;">Poetica</h1>
          </div>
          
          <div style="font-family: 'Helvetica', sans-serif; white-space: pre-line; text-align: left; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6; margin-bottom: 30px;">
            ${message}
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #6c757d; border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 30px;">
            Diese E-Mail wurde über <a href="https://poetica.apvora.com" style="color: #1d3557; text-decoration: none;">poetica.apvora.com</a> versendet
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error handling request:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
