
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "../_shared/email-utils.ts";
import { getEnvironmentVariables } from "./config.ts";
import { getPayPalAccessToken, createPayPalOrder, findApprovalUrl } from "./paypal-api.ts";
import { sendEmailNotification } from "./email-service.ts";
import { parseRequestData, validateRequestParams, generatePoemId } from "./utils.ts";

/**
 * Main handler function for the create-paypal-checkout endpoint
 */
serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('[create-paypal-checkout] Starting execution with timestamp:', new Date().toISOString());
    
    // Get environment variables
    const { paypalClientId, paypalSecretKey, resendApiKey, recipientEmail } = getEnvironmentVariables();
    
    // Parse request body
    const requestData = await parseRequestData(req);
    const { successUrl, cancelUrl, poemTitle, formData } = requestData;
    
    // Validate request parameters
    validateRequestParams(successUrl, cancelUrl);

    console.log('[create-paypal-checkout] Creating PayPal order with params:', { 
      successUrl, 
      cancelUrl, 
      poemTitle,
      hasFormData: !!formData
    });
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(paypalClientId, paypalSecretKey);
    
    // Create PayPal order
    const orderData = await createPayPalOrder(accessToken, poemTitle, successUrl, cancelUrl);
    
    // Send email notification if form data is provided
    await sendEmailNotification(formData, poemTitle, resendApiKey, recipientEmail);
    
    // Find the approval URL in the links array
    const approvalUrl = findApprovalUrl(orderData);
    
    console.log('[create-paypal-checkout] Returning success response with approval URL:', approvalUrl);
    
    // Generate a unique poem ID for tracking
    const poemId = generatePoemId(poemTitle);
    
    return createSuccessResponse({
      id: orderData.id,
      url: approvalUrl,
      poemId: poemId
    });
  } catch (error) {
    console.error('[create-paypal-checkout] Unhandled error:', error);
    
    return createErrorResponse(
      error.message || 'Unexpected error creating PayPal checkout',
      500
    );
  }
});
