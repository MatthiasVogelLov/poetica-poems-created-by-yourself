
import { ENVIRONMENT } from './config.ts';
import { extractErrorText } from './utils.ts';

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
