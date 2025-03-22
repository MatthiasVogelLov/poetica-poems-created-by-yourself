
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "../_shared/email-utils.ts";
import { getEnvironmentVariables } from "./config.ts";
import { parseRequestData } from "./utils.ts";
import { getPayPalAccessToken, checkOrderStatus, processOrderBasedOnStatus } from "./paypal-api.ts";

/**
 * Main handler function for verifying PayPal payments
 */
serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  console.log('[verify-paypal-payment] Starting execution with timestamp:', new Date().toISOString());
  
  try {
    // Get environment variables
    const { paypalClientId, paypalSecretKey } = getEnvironmentVariables();
    
    // Parse request body
    const requestData = await parseRequestData(req);
    const { orderId } = requestData;
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(paypalClientId, paypalSecretKey);
    
    // Check order status
    const orderData = await checkOrderStatus(accessToken, orderId);
    
    // Process the order based on its status
    const result = await processOrderBasedOnStatus(orderData, accessToken);
    
    return createSuccessResponse(result);
  } catch (error) {
    console.error('[verify-paypal-payment] Unhandled error:', error);
    
    return createErrorResponse(
      error.message || 'Unexpected error verifying PayPal payment',
      500
    );
  }
});
