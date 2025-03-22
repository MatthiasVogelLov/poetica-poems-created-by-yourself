
import { ENVIRONMENT } from './config.ts';
import { extractErrorText } from './utils.ts';

/**
 * Get PayPal access token
 */
export async function getPayPalAccessToken(clientId: string, secretKey: string) {
  console.log('[verify-paypal-payment] Requesting PayPal access token...');
  console.log('[verify-paypal-payment] PayPal API URL:', `${ENVIRONMENT.BASE_URL}/v1/oauth2/token`);
  
  // Create authorization credentials
  const credentials = `${clientId}:${secretKey}`;
  const encodedCredentials = btoa(credentials);
  
  console.log('[verify-paypal-payment] Sending auth request with Basic auth');
  
  try {
    const authResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v1/oauth2/token`, {
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
      // Log detailed error info
      console.error('[verify-paypal-payment] Auth error details:', errorText);
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
  } catch (fetchError) {
    console.error('[verify-paypal-payment] Network error during auth request:', fetchError);
    throw new Error(`Network error during PayPal authentication: ${fetchError.message}`);
  }
}

/**
 * Check the order status
 */
export async function checkOrderStatus(accessToken: string, orderId: string) {
  console.log('[verify-paypal-payment] Checking order status...');
  console.log('[verify-paypal-payment] PayPal order URL:', `${ENVIRONMENT.BASE_URL}/v2/checkout/orders/${orderId}`);
  
  const orderResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v2/checkout/orders/${orderId}`, {
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
export async function capturePayment(accessToken: string, orderId: string) {
  console.log('[verify-paypal-payment] Order is approved, capturing payment...');
  console.log('[verify-paypal-payment] PayPal capture URL:', `${ENVIRONMENT.BASE_URL}/v2/checkout/orders/${orderId}/capture`);
  
  const captureResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
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
export async function processOrderBasedOnStatus(orderData: any, accessToken: string) {
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
