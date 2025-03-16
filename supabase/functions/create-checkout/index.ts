
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@12.18.0";

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
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
    if (!stripeKey) {
      console.error('Stripe API key is not configured');
      throw new Error('Stripe API key is not configured');
    }

    const { productId, successUrl, cancelUrl, poemTitle, formData } = await req.json();
    
    if (!productId || !successUrl || !cancelUrl) {
      console.error('Missing required parameters', { productId, successUrl, cancelUrl });
      throw new Error('Missing required parameters');
    }

    console.log('Creating checkout session with:', { productId, successUrl, cancelUrl, poemTitle });

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
        formData: formData ? JSON.stringify(formData) : '{}'
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

    console.log('Checkout session created:', { id: session.id, url: session.url });

    // Send notification email if formData is provided
    if (formData) {
      try {
        // This would call another edge function to send the email
        // We'll implement this next
        const notifyUrl = new URL('/functions/v1/notify-poem', req.url);
        fetch(notifyUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            poemTitle,
            formData,
            poemContent: formData.poem || ''
          })
        }).catch(err => {
          // Just log the error, don't block the checkout process
          console.error('Failed to send notification:', err);
        });
      } catch (emailError) {
        console.error('Error sending notification:', emailError);
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
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
