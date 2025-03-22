
import { ENVIRONMENT } from './config.ts';

/**
 * Get PayPal access token using client credentials
 */
export async function getPayPalAccessToken(clientId: string, secretKey: string) {
  console.log('[create-paypal-checkout] Requesting PayPal access token...');
  console.log('[create-paypal-checkout] Sending auth request to:', `${ENVIRONMENT.BASE_URL}/v1/oauth2/token`);
  
  // Create authorization header using base64 encoding of client_id:client_secret
  const credentials = `${clientId}:${secretKey}`;
  // Using TextEncoder for UTF-8 encoding
  const encodedCredentials = btoa(credentials);
  
  console.log('[create-paypal-checkout] Authorization header format: Basic [encoded credentials]');
  
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
    console.log('[create-paypal-checkout] PayPal auth response status:', authStatus);
    
    if (!authResponse.ok) {
      const errorText = await extractErrorText(authResponse);
      // Log full error details for debugging
      console.error('[create-paypal-checkout] Auth error details:', errorText);
      throw new Error(`Failed to authenticate with PayPal: ${errorText}`);
    }
    
    const authData = await authResponse.json();
    console.log('[create-paypal-checkout] PayPal auth successful, received token');
    
    if (!authData.access_token) {
      console.error('[create-paypal-checkout] No access token in PayPal response:', authData);
      throw new Error('PayPal did not return an access token');
    }
    
    console.log('[create-paypal-checkout] Access token received successfully');
    return authData.access_token;
  } catch (fetchError) {
    console.error('[create-paypal-checkout] Network error during auth request:', fetchError);
    throw new Error(`Network error during PayPal authentication: ${fetchError.message}`);
  }
}

/**
 * Create PayPal order with the given parameters
 */
export async function createPayPalOrder(accessToken: string, poemTitle: string, successUrl: string, cancelUrl: string) {
  console.log('[create-paypal-checkout] Creating PayPal order...');
  
  const orderPayload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: '1.29' // €1.29 to match PayPal's minimum requirement
        },
        description: `Freischaltung: ${poemTitle || 'Personalisiertes Gedicht'}`
      }
    ],
    application_context: {
      return_url: successUrl,
      cancel_url: cancelUrl,
      brand_name: 'Poetica',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING',
      landing_page: 'BILLING' // Show the billing page instead of LOGIN to avoid the seller account issue
    }
  };
  
  console.log('[create-paypal-checkout] Order payload:', JSON.stringify(orderPayload));
  
  const orderResponse = await fetch(`${ENVIRONMENT.BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': `poetica-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    },
    body: JSON.stringify(orderPayload)
  });
  
  const orderStatus = orderResponse.status;
  console.log('[create-paypal-checkout] PayPal order creation status:', orderStatus);
  
  if (!orderResponse.ok) {
    const errorText = await extractErrorText(orderResponse);
    throw new Error(`Failed to create PayPal order: ${errorText}`);
  }
  
  const orderData = await orderResponse.json();
  console.log('[create-paypal-checkout] PayPal order created successfully:', { 
    id: orderData.id, 
    status: orderData.status,
    links: orderData.links.map((link: any) => ({ rel: link.rel, href: link.href }))
  });
  
  return orderData;
}

/**
 * Extract error text from a response
 */
export async function extractErrorText(response: Response): Promise<string> {
  let errorText = '';
  try {
    const responseText = await response.text();
    console.error('[create-paypal-checkout] Full error response:', responseText);
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
 * Find the approval URL in the links array of the PayPal order response
 */
export function findApprovalUrl(orderData: any) {
  const approvalLink = orderData.links.find((link: any) => link.rel === 'approve');
  
  if (!approvalLink) {
    console.error('[create-paypal-checkout] PayPal approval URL not found in response:', orderData);
    throw new Error('PayPal approval URL not found in response');
  }
  
  console.log('[create-paypal-checkout] Found approval URL:', approvalLink.href);
  return approvalLink.href;
}
