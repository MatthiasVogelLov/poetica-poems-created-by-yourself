
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

    const { productId, successUrl, cancelUrl, poemTitle } = await req.json();
    
    if (!productId || !successUrl || !cancelUrl) {
      console.error('Missing required parameters', { productId, successUrl, cancelUrl });
      throw new Error('Missing required parameters');
    }

    console.log('Creating checkout session with:', { productId, successUrl, cancelUrl, poemTitle });

    // Create a Stripe checkout session
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
        poemTitle: poemTitle || 'Personalisiertes Gedicht'
      }
    });

    console.log('Checkout session created:', { id: session.id, url: session.url });

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
