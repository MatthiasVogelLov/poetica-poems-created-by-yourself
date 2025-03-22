
import { ENVIRONMENT } from './config.ts';
import { extractErrorText } from './utils.ts';
import { capturePayment } from './payment-service.ts';

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
