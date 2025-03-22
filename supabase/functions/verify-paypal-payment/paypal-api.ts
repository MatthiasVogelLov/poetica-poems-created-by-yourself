
import { ENVIRONMENT } from './config.ts';
import { getPayPalAccessToken } from './paypal-auth.ts';
import { checkOrderStatus, processOrderBasedOnStatus } from './order-service.ts';
import { extractErrorText } from './utils.ts';

/**
 * Get PayPal access token using client credentials
 */
export async function getPayPalAccessToken(clientId: string, secretKey: string) {
  console.log('[verify-paypal-payment] Requesting PayPal access token...');
  
  // Create authorization header using base64 encoding of client_id:client_secret
  const credentials = `${clientId}:${secretKey}`;
  const encodedCredentials = btoa(credentials);
  
  try {
    const authResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!authResponse.ok) {
      const errorText = await extractErrorText(authResponse);
      console.error('[verify-paypal-payment] Auth error details:', errorText);
      throw new Error(`Failed to authenticate with PayPal: ${errorText}`);
    }
    
    const authData = await authResponse.json();
    
    if (!authData.access_token) {
      console.error('[verify-paypal-payment] No access token in PayPal response:', authData);
      throw new Error('PayPal did not return an access token');
    }
    
    return authData.access_token;
  } catch (fetchError) {
    console.error('[verify-paypal-payment] Network error during auth request:', fetchError);
    throw new Error(`Network error during PayPal authentication: ${fetchError.message}`);
  }
}

/**
 * Check order status
 */
export async function checkOrderStatus(accessToken: string, orderId: string) {
  console.log('[verify-paypal-payment] Checking order status for:', orderId);
  
  const orderResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!orderResponse.ok) {
    const errorText = await extractErrorText(orderResponse);
    throw new Error(`Failed to verify PayPal order: ${errorText}`);
  }
  
  const orderData = await orderResponse.json();
  console.log('[verify-paypal-payment] Order status:', orderData.status);
  
  return orderData;
}

/**
 * Process an order based on its status
 */
export async function processOrderBasedOnStatus(orderData: any, accessToken: string) {
  const orderId = orderData.id;
  const status = orderData.status;
  
  console.log(`[verify-paypal-payment] Processing order ${orderId} with status ${status}`);
  
  // If the order is approved, capture the payment
  if (status === 'APPROVED') {
    console.log('[verify-paypal-payment] Order is approved, capturing payment...');
    
    const captureResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `poetica-capture-${Date.now()}`
      }
    });
    
    if (!captureResponse.ok) {
      const errorText = await extractErrorText(captureResponse);
      throw new Error(`Failed to capture PayPal payment: ${errorText}`);
    }
    
    const captureData = await captureResponse.json();
    console.log('[verify-paypal-payment] Payment captured successfully:', captureData.status);
    
    return {
      id: captureData.id,
      status: captureData.status,
      verified: captureData.status === 'COMPLETED'
    };
  }
  
  // If payment is already completed
  if (status === 'COMPLETED') {
    console.log('[verify-paypal-payment] Payment already completed');
    return {
      id: orderId,
      status: status,
      verified: true
    };
  }
  
  // If we get here, the payment is not in a complete state
  console.log('[verify-paypal-payment] Payment not completed, current status:', status);
  return {
    id: orderId,
    status: status,
    verified: false
  };
}
