
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
