
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "../_shared/email-utils.ts";

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');
// Always use live PayPal environment
const paypalBaseUrl = 'https://api-m.paypal.com';

/**
 * Validate if required environment variables are set
 */
function validateEnvironment() {
  console.log('[verify-paypal-payment] Using PayPal environment: LIVE');
  
  if (!paypalClientId) {
    console.error('[verify-paypal-payment] PayPal Client ID is not configured');
    throw new Error('PayPal Client ID is not configured');
  }

  if (!paypalSecretKey) {
    console.error('[verify-paypal-payment] PayPal Secret Key is not configured');
    throw new Error('PayPal Secret Key is not configured');
  }

  const maskedClientId = paypalClientId.substring(0, 4) + '...' + paypalClientId.substring(paypalClientId.length - 4);
  console.log('[verify-paypal-payment] Using PayPal Client ID:', maskedClientId);
}

/**
 * Parse and validate request data
 */
async function parseRequestData(req: Request) {
  try {
    const requestData = await req.json();
    console.log('[verify-paypal-payment] Request body:', JSON.stringify(requestData));
    
    const { orderId } = requestData;
    
    if (!orderId) {
      console.error('[verify-paypal-payment] Missing order ID');
      throw new Error('Missing PayPal order ID');
    }
    
    console.log('[verify-paypal-payment] Verifying PayPal order:', { orderId });
    return requestData;
  } catch (parseError) {
    console.error('[verify-paypal-payment] Error parsing request body:', parseError);
    throw new Error('Invalid request format');
  }
}

/**
 * Create encoded authorization credentials for PayPal API
 */
function createEncodedCredentials() {
  // Using TextEncoder/TextDecoder for more reliable encoding
  const authString = `${paypalClientId}:${paypalSecretKey}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(authString);
  const encodedCredentials = btoa(String.fromCharCode(...new Uint8Array(data)));
  
  console.log('[verify-paypal-payment] Using auth header: Basic ' + encodedCredentials.substring(0, 10) + '...');
  return encodedCredentials;
}

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken() {
  console.log('[verify-paypal-payment] Requesting PayPal access token...');
  console.log('[verify-paypal-payment] PayPal API URL:', `${paypalBaseUrl}/v1/oauth2/token`);
  
  const encodedCredentials = createEncodedCredentials();
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
    const errorText = await extractErrorText(authResponse);
    throw new Error(`Failed to authenticate with PayPal: ${errorText}`);
  }
  
  try {
    const authData = await authResponse.json();
    console.log('[verify-paypal-payment] PayPal auth successful, received token');
    
    if (!authData.access_token) {
      console.error('[verify-paypal-payment] No access token in PayPal response:', authData);
      throw new Error('PayPal did not return an access token');
    }
    
    return authData.access_token;
  } catch (jsonError) {
    console.error('[verify-paypal-payment] Error parsing auth response:', jsonError);
    throw new Error('Error parsing PayPal authentication response');
  }
}

/**
 * Extract error text from a response
 */
async function extractErrorText(response: Response): Promise<string> {
  let errorText = '';
  try {
    const responseText = await response.text();
    console.error('[verify-paypal-payment] Full error response:', responseText);
    try {
      const errorJson = JSON.parse(responseText);
      errorText = JSON.stringify(errorJson);
    } catch (e) {
      errorText = responseText;
    }
  } catch (e) {
    errorText = 'Could not read error response body';
  }
  return errorText;
}

/**
 * Check the order status
 */
async function checkOrderStatus(accessToken: string, orderId: string) {
  console.log('[verify-paypal-payment] Checking order status...');
  console.log('[verify-paypal-payment] PayPal order URL:', `${paypalBaseUrl}/v2/checkout/orders/${orderId}`);
  
  const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const orderStatus = orderResponse.status;
  console.log('[verify-paypal-payment] PayPal order status response:', orderStatus);
  
  if (!orderResponse.ok) {
    const errorText = await extractErrorText(orderResponse);
    throw new Error(`Failed to verify PayPal order: ${errorText}`);
  }
  
  try {
    const orderData = await orderResponse.json();
    console.log('[verify-paypal-payment] PayPal order info received:', { 
      id: orderData.id, 
      status: orderData.status
    });
    return orderData;
  } catch (jsonError) {
    console.error('[verify-paypal-payment] Error parsing order response:', jsonError);
    throw new Error('Error parsing PayPal order response');
  }
}

/**
 * Capture an approved PayPal payment
 */
async function capturePayment(accessToken: string, orderId: string) {
  console.log('[verify-paypal-payment] Order is approved, capturing payment...');
  console.log('[verify-paypal-payment] PayPal capture URL:', `${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`);
  
  const captureResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': `poetica-capture-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    }
  });
  
  const captureStatus = captureResponse.status;
  console.log('[verify-paypal-payment] PayPal capture response status:', captureStatus);
  
  if (!captureResponse.ok) {
    const errorText = await extractErrorText(captureResponse);
    throw new Error(`Failed to capture PayPal payment: ${errorText}`);
  }
  
  try {
    const captureData = await captureResponse.json();
    console.log('[verify-paypal-payment] Payment captured successfully:', { 
      id: captureData.id, 
      status: captureData.status
    });
    return captureData;
  } catch (jsonError) {
    console.error('[verify-paypal-payment] Error parsing capture response:', jsonError);
    throw new Error('Error parsing PayPal capture response');
  }
}

/**
 * Process PayPal order based on its status
 */
async function processOrderBasedOnStatus(orderData: any, accessToken: string) {
  // If the order is approved but not captured yet, capture the payment
  if (orderData.status === 'APPROVED') {
    const captureData = await capturePayment(accessToken, orderData.id);
    
    return {
      id: captureData.id,
      status: captureData.status,
      verified: captureData.status === 'COMPLETED'
    };
  }
  
  // Check if the payment is already completed
  if (orderData.status === 'COMPLETED') {
    console.log('[verify-paypal-payment] Payment already completed');
    
    return {
      id: orderData.id,
      status: orderData.status,
      verified: true
    };
  }
  
  // If we get here, the payment is not completed or approved
  console.log('[verify-paypal-payment] Payment not completed or approved:', orderData.status);
  
  return {
    id: orderData.id,
    status: orderData.status,
    verified: false
  };
}

/**
 * Main handler function for verifying PayPal payments
 */
async function verifyPayPalPayment(req: Request) {
  console.log('[verify-paypal-payment] Starting execution with timestamp:', new Date().toISOString());
  
  try {
    // Validate environment variables
    validateEnvironment();
    
    // Parse request body
    const requestData = await parseRequestData(req);
    const { orderId } = requestData;
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  return await verifyPayPalPayment(req);
});
