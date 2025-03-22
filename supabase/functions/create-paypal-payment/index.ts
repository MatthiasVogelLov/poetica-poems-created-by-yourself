
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/email-utils.ts";

// PayPal API configuration
// Use PayPal Sandbox environment for testing
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_SECRET_KEY');

// Create a basic PayPal order in sandbox mode
async function createPayPalOrder() {
  // Check for required environment variables
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.error('[create-paypal-payment] Missing PayPal credentials:', {
      hasClientId: !!PAYPAL_CLIENT_ID,
      hasClientSecret: !!PAYPAL_CLIENT_SECRET
    });
    throw new Error('PayPal credentials not configured');
  }

  try {
    // Get access token
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    
    console.log('[create-paypal-payment] Requesting PayPal access token...');
    console.log('[create-paypal-payment] Using PayPal environment: SANDBOX');
    console.log('[create-paypal-payment] Token request URL:', `${PAYPAL_API}/v1/oauth2/token`);
    
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });

    const tokenStatus = tokenResponse.status;
    console.log('[create-paypal-payment] Token response status:', tokenStatus);

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('[create-paypal-payment] Token error:', tokenError);
      throw new Error(`Failed to get PayPal access token: Status ${tokenStatus}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      console.error('[create-paypal-payment] No access token in response:', tokenData);
      throw new Error('No access token in PayPal response');
    }
    
    console.log('[create-paypal-payment] Successfully got PayPal access token');

    // Create order with sandbox URLs
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
      throw new Error(`Failed to create PayPal order: Status ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();
    console.log('[create-paypal-payment] Order created:', orderData.id);
    
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
    console.log('[create-paypal-payment] PayPal credentials check:', {
      hasClientId: !!PAYPAL_CLIENT_ID,
      hasClientSecret: !!PAYPAL_CLIENT_SECRET
    });
    
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
