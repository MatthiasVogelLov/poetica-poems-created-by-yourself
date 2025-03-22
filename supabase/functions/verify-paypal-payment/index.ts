
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "../_shared/email-utils.ts";

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');
// Check if we're using sandbox or live environment
const isPayPalSandbox = Deno.env.get('PAYPAL_USE_SANDBOX') !== 'false';
const paypalBaseUrl = isPayPalSandbox 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('[verify-paypal-payment] Starting execution with timestamp:', new Date().toISOString());
    console.log('[verify-paypal-payment] Using PayPal environment:', isPayPalSandbox ? 'SANDBOX' : 'LIVE');
    
    if (!paypalClientId || !paypalSecretKey) {
      console.error('[verify-paypal-payment] PayPal credentials are not configured');
      return createErrorResponse('PayPal credentials are not configured', 500);
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('[verify-paypal-payment] Request body:', JSON.stringify(requestData));
    } catch (parseError) {
      console.error('[verify-paypal-payment] Error parsing request body:', parseError);
      return createErrorResponse('Invalid request format', 400);
    }
    
    const { orderId } = requestData;
    
    if (!orderId) {
      console.error('[verify-paypal-payment] Missing order ID');
      return createErrorResponse('Missing PayPal order ID', 400);
    }

    console.log('[verify-paypal-payment] Verifying PayPal order:', { orderId });
    
    // Get PayPal access token
    console.log('[verify-paypal-payment] Requesting PayPal access token...');
    console.log('[verify-paypal-payment] PayPal API URL:', `${paypalBaseUrl}/v1/oauth2/token`);
    
    const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalSecretKey}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const authStatus = authResponse.status;
    console.log('[verify-paypal-payment] PayPal auth response status:', authStatus);
    
    if (!authResponse.ok) {
      let errorText = '';
      try {
        errorText = await authResponse.text();
      } catch (e) {
        errorText = 'Could not read error response body';
      }
      
      console.error('[verify-paypal-payment] PayPal auth error:', {
        status: authStatus,
        error: errorText
      });
      return createErrorResponse(`Failed to authenticate with PayPal: ${errorText}`, 500);
    }
    
    let authData;
    try {
      authData = await authResponse.json();
      console.log('[verify-paypal-payment] PayPal auth successful, token received');
    } catch (jsonError) {
      console.error('[verify-paypal-payment] Error parsing auth response:', jsonError);
      return createErrorResponse('Error parsing PayPal authentication response', 500);
    }
    
    // Verify the order status
    console.log('[verify-paypal-payment] Checking order status...');
    console.log('[verify-paypal-payment] PayPal order URL:', `${paypalBaseUrl}/v2/checkout/orders/${orderId}`);
    
    const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`
      }
    });
    
    const orderStatus = orderResponse.status;
    console.log('[verify-paypal-payment] PayPal order status response:', orderStatus);
    
    if (!orderResponse.ok) {
      let errorText = '';
      try {
        errorText = await orderResponse.text();
      } catch (e) {
        errorText = 'Could not read error response body';
      }
      
      console.error('[verify-paypal-payment] PayPal order verification error:', {
        status: orderStatus,
        error: errorText
      });
      return createErrorResponse(`Failed to verify PayPal order: ${errorText}`, 500);
    }
    
    let orderData;
    try {
      orderData = await orderResponse.json();
      console.log('[verify-paypal-payment] PayPal order info received:', { 
        id: orderData.id, 
        status: orderData.status
      });
    } catch (jsonError) {
      console.error('[verify-paypal-payment] Error parsing order response:', jsonError);
      return createErrorResponse('Error parsing PayPal order response', 500);
    }
    
    // If the order is approved but not captured yet, capture the payment
    if (orderData.status === 'APPROVED') {
      console.log('[verify-paypal-payment] Order is approved, capturing payment...');
      console.log('[verify-paypal-payment] PayPal capture URL:', `${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`);
      
      const captureResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`
        }
      });
      
      const captureStatus = captureResponse.status;
      console.log('[verify-paypal-payment] PayPal capture response status:', captureStatus);
      
      if (!captureResponse.ok) {
        let errorText = '';
        try {
          errorText = await captureResponse.text();
        } catch (e) {
          errorText = 'Could not read error response body';
        }
        
        console.error('[verify-paypal-payment] PayPal capture error:', {
          status: captureStatus,
          error: errorText
        });
        return createErrorResponse(`Failed to capture PayPal payment: ${errorText}`, 500);
      }
      
      let captureData;
      try {
        captureData = await captureResponse.json();
        console.log('[verify-paypal-payment] Payment captured successfully:', { 
          id: captureData.id, 
          status: captureData.status
        });
      } catch (jsonError) {
        console.error('[verify-paypal-payment] Error parsing capture response:', jsonError);
        return createErrorResponse('Error parsing PayPal capture response', 500);
      }
      
      return createSuccessResponse({
        id: captureData.id,
        status: captureData.status,
        verified: captureData.status === 'COMPLETED'
      });
    }
    
    // Check if the payment is already completed
    if (orderData.status === 'COMPLETED') {
      console.log('[verify-paypal-payment] Payment already completed');
      
      return createSuccessResponse({
        id: orderData.id,
        status: orderData.status,
        verified: true
      });
    }
    
    // If we get here, the payment is not completed or approved
    console.log('[verify-paypal-payment] Payment not completed or approved:', orderData.status);
    
    return createSuccessResponse({
      id: orderData.id,
      status: orderData.status,
      verified: false
    });
  } catch (error) {
    console.error('[verify-paypal-payment] Unhandled error:', error);
    
    return createErrorResponse(
      error.message || 'Unexpected error verifying PayPal payment',
      500
    );
  }
});
