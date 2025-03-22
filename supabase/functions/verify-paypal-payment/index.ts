
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/email-utils.ts";
import { getPayPalAccessToken, checkOrderStatus, processOrderBasedOnStatus, extractErrorText } from "./paypal-api.ts";

// PayPal API configuration
const PAYPAL_API = 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_SECRET_KEY');

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[verify-paypal-payment] Starting verification process');
    
    // Check for required environment variables
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured');
    }
    
    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      throw new Error('Invalid request format');
    }
    
    const { orderId } = requestData;
    if (!orderId) {
      throw new Error('Missing PayPal order ID');
    }
    
    console.log('[verify-paypal-payment] Verifying order:', orderId);
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
    
    // Check order status
    const orderData = await checkOrderStatus(accessToken, orderId);
    
    // Process the order based on its status
    const result = await processOrderBasedOnStatus(orderData, accessToken);
    
    // Return the verification result
    return new Response(
      JSON.stringify(result), 
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error('[verify-paypal-payment] Error:', error);
    
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
