
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "../_shared/email-utils.ts";

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');
// Always use live PayPal environment
const paypalBaseUrl = 'https://api-m.paypal.com';

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('[verify-paypal-payment] Starting execution with timestamp:', new Date().toISOString());
    console.log('[verify-paypal-payment] Using PayPal environment: LIVE');
    
    // Debug credentials (partially masked)
    if (!paypalClientId) {
      console.error('[verify-paypal-payment] PayPal Client ID is not configured');
      return createErrorResponse('PayPal Client ID is not configured', 500);
    }

    if (!paypalSecretKey) {
      console.error('[verify-paypal-payment] PayPal Secret Key is not configured');
      return createErrorResponse('PayPal Secret Key is not configured', 500);
    }

    const maskedClientId = paypalClientId.substring(0, 4) + '...' + paypalClientId.substring(paypalClientId.length - 4);
    console.log('[verify-paypal-payment] Using PayPal Client ID:', maskedClientId);

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
    
    // Fix: Properly encode credentials for Basic Auth
    const credentials = `${paypalClientId}:${paypalSecretKey}`;
    const encodedCredentials = btoa(credentials);
    
    console.log('[verify-paypal-payment] Sending auth request');
    
    const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const authStatus = authResponse.status;
    console.log('[verify-paypal-payment] PayPal auth response status:', authStatus);
    
    if (!authResponse.ok) {
      // Improved error handling
      let errorText = '';
      try {
        const responseText = await authResponse.text();
        console.error('[verify-paypal-payment] Full auth error response:', responseText);
        try {
          const errorJson = JSON.parse(responseText);
          errorText = JSON.stringify(errorJson);
        } catch (e) {
          errorText = responseText;
        }
      } catch (e) {
        errorText = 'Could not read error response body';
      }
      
      return createErrorResponse(`Failed to authenticate with PayPal: ${errorText}`, 500);
    }
    
    let authData;
    try {
      authData = await authResponse.json();
      console.log('[verify-paypal-payment] PayPal auth successful, received token');
      
      if (!authData.access_token) {
        console.error('[verify-paypal-payment] No access token in PayPal response:', authData);
        return createErrorResponse('PayPal did not return an access token', 500);
      }
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
      // Improved error handling
      let errorText = '';
      try {
        const responseText = await orderResponse.text();
        console.error('[verify-paypal-payment] Full order error response:', responseText);
        try {
          const errorJson = JSON.parse(responseText);
          errorText = JSON.stringify(errorJson);
        } catch (e) {
          errorText = responseText;
        }
      } catch (e) {
        errorText = 'Could not read error response body';
      }
      
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
          'Authorization': `Bearer ${authData.access_token}`,
          'PayPal-Request-Id': `poetica-capture-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        }
      });
      
      const captureStatus = captureResponse.status;
      console.log('[verify-paypal-payment] PayPal capture response status:', captureStatus);
      
      if (!captureResponse.ok) {
        // Improved error handling
        let errorText = '';
        try {
          const responseText = await captureResponse.text();
          console.error('[verify-paypal-payment] Full capture error response:', responseText);
          try {
            const errorJson = JSON.parse(responseText);
            errorText = JSON.stringify(errorJson);
          } catch (e) {
            errorText = responseText;
          }
        } catch (e) {
          errorText = 'Could not read error response body';
        }
        
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
