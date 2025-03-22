
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
    
    // Get the PayPal checkout URL - this will redirect to PayPal's standard checkout
    const redirectUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQBQFKYJP8NJW&currency_code=EUR";
    
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
