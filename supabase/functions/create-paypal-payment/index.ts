
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/email-utils.ts";

// PayPal API configuration
const PAYPAL_API = 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_SECRET_KEY');

// Create a basic PayPal order
async function createPayPalOrder() {
  // Check for required environment variables
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  try {
    // Get access token
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('[create-paypal-payment] Token error:', tokenError);
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `poetica-${Date.now()}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '1.29'
          },
          description: 'Poetica Gedicht Freischaltung'
        }],
        application_context: {
          return_url: 'https://poetica-ai.vercel.app/preview?paid=true&payment_provider=paypal',
          cancel_url: 'https://poetica-ai.vercel.app/preview',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          brand_name: 'Poetica'
        }
      })
    });

    if (!orderResponse.ok) {
      const orderError = await orderResponse.text();
      console.error('[create-paypal-payment] Order error:', orderError);
      throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();
    
    // Find approval URL
    const approvalLink = orderData.links.find(link => link.rel === 'approve');
    if (!approvalLink) {
      throw new Error('PayPal approval URL not found');
    }

    return {
      orderId: orderData.id,
      redirectUrl: approvalLink.href,
      success: true
    };
  } catch (error) {
    console.error('[create-paypal-payment] Error:', error);
    throw error;
  }
}

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[create-paypal-payment] Processing request');
    
    // Create PayPal order and get redirect URL
    const paypalOrderData = await createPayPalOrder();
    
    // Return the order data with redirect URL
    return new Response(
      JSON.stringify(paypalOrderData), 
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("[create-paypal-payment] Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
