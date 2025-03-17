
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
    console.log('Executing send-poem function');
    
    if (!resendApiKey) {
      console.error('Resend API key is not configured');
      throw new Error('Resend API key is not configured');
    }

    console.log('Resend API key found');
    const resend = new Resend(resendApiKey);
    const body = await req.text();
    const { recipientEmail, recipientName, poemTitle, poemContent } = JSON.parse(body);
    
    console.log(`Sending email to: ${recipientEmail}, Poem: ${poemTitle}`);
    
    if (!recipientEmail || !poemTitle || !poemContent) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await resend.emails.send({
      from: 'Poetica <poem@poetica.apvora.com>',
      to: recipientEmail,
      subject: `Ihr Gedicht: ${poemTitle}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: left; margin-bottom: 20px;">
            <h1 style="font-family: serif; font-size: 24px; margin: 0;">Poetica</h1>
          </div>
          
          <h1 style="font-family: 'Playfair Display', serif; text-align: center; color: #1d3557; margin-bottom: 20px;">
            ${poemTitle}
          </h1>
          
          <div style="font-family: 'Playfair Display', serif; white-space: pre-line; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6; margin-bottom: 30px;">
            ${poemContent}
          </div>
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
