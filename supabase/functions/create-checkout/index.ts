
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@12.18.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const recipientEmail = "matthiasvogel1973@gmail.com";
const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2023-10-16',
});

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
    console.log('[create-checkout] Starting execution with timestamp:', new Date().toISOString());
    
    if (!stripeKey) {
      console.error('[create-checkout] Stripe API key is not configured');
      throw new Error('Stripe API key is not configured');
    }

    const { productId, successUrl, cancelUrl, poemTitle, formData } = await req.json();
    
    if (!productId || !successUrl || !cancelUrl) {
      console.error('[create-checkout] Missing required parameters', { productId, successUrl, cancelUrl });
      throw new Error('Missing required parameters');
    }

    console.log('[create-checkout] Creating checkout session with:', { 
      productId, 
      successUrl, 
      cancelUrl, 
      poemTitle,
      hasFormData: !!formData,
      formDataKeys: formData ? Object.keys(formData) : []
    });
    
    // Extract only the essential form data to avoid metadata size limits
    const minimalFormData = formData ? {
      audience: formData.audience || '',
      occasion: formData.occasion || '',
      contentType: formData.contentType || '',
      style: formData.style || '',
      length: formData.length || '',
      keywords: formData.keywords || ''
    } : {};

    // Save poem content to Stripe metadata - limited to 500 chars
    const poemExcerpt = formData?.poem ? formData.poem.substring(0, 450) + (formData.poem.length > 450 ? '...' : '') : '';
    
    // Create a Stripe checkout session with appearance options to match app style
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: productId,
            unit_amount: 99, // €0.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        poemTitle: poemTitle || 'Personalisiertes Gedicht',
        createdAt: new Date().toISOString(),
      },
      // Custom appearance to match the app's style
      payment_intent_data: {
        description: `Freischaltung: ${poemTitle || 'Personalisiertes Gedicht'}`
      },
      custom_text: {
        submit: {
          message: 'Nach Bezahlung kehren Sie automatisch zu Ihrem Gedicht zurück.'
        }
      }
    });

    console.log('[create-checkout] Checkout session created:', { 
      id: session.id, 
      url: session.url,
      hasUrl: !!session.url
    });

    // Send notification email if formData is provided
    if (formData && resendApiKey) {
      try {
        console.log('[create-checkout] Attempting to send email notification directly from checkout');
        
        const resend = new Resend(resendApiKey);
        
        // Format the form data for the email
        const formDataList = Object.entries(minimalFormData)
          .filter(([key]) => key !== 'poem') // Exclude the poem content from the list
          .map(([key, value]) => {
            // Format the key for better readability
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
          })
          .join('');

        const emailPayload = {
          from: 'Poetica <notification@poetica-app.com>',
          to: recipientEmail,
          subject: `Neues Gedicht: ${poemTitle} (aus Checkout)`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1d3557; border-bottom: 1px solid #ddd; padding-bottom: 10px;">${poemTitle}</h1>
              
              <h2 style="color: #457b9d; margin-top: 20px;">Gedicht</h2>
              <div style="white-space: pre-line; font-family: 'Playfair Display', serif; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6;">
                ${formData.poem || 'Kein Gedichttext verfügbar'}
              </div>
              
              <h2 style="color: #457b9d; margin-top: 20px;">Gewählte Einstellungen</h2>
              <ul style="line-height: 1.6;">
                ${formDataList || '<li>Keine Einstellungen verfügbar</li>'}
              </ul>
              
              <p style="margin-top: 30px; color: #6c757d; font-size: 14px; border-top: 1px solid #ddd; padding-top: 10px;">
                Diese E-Mail wurde automatisch von der Poetica App gesendet (Backup vom Checkout).
              </p>
            </div>
          `
        };

        console.log('[create-checkout] Sending email with Resend...');
        const { data, error } = await resend.emails.send(emailPayload);

        if (error) {
          console.error('[create-checkout] Error sending email via Resend:', error);
        } else {
          console.log('[create-checkout] Email notification sent successfully via Resend:', data);
        }
      } catch (emailError) {
        console.error('[create-checkout] Error sending notification directly:', emailError);
        // Don't throw, allow checkout to continue
      }
    }

    return new Response(
      JSON.stringify({ 
        id: session.id,
        url: session.url
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('[create-checkout] Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
