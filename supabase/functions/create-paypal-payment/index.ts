
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/email-utils.ts";

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[create-paypal-payment] Processing request');
    
    // Use the PayPal checkout URL with just the basic parameters
    // This is a simpler and more reliable approach than the hosted button
    const redirectUrl = "https://www.paypal.com/checkoutnow?token=EC-MQBQFKYJP8NJW";
    
    // Return the URL in the expected format
    return new Response(
      JSON.stringify({ 
        redirectUrl: redirectUrl,
        success: true 
      }), 
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
