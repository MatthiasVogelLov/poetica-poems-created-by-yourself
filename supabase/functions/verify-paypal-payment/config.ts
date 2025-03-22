
// PayPal configuration and environment settings
export const ENVIRONMENT = {
  // Always use live PayPal environment
  BASE_URL: 'https://api-m.paypal.com',
  IS_LIVE: true
};

// Function to get and validate required environment variables
export function getEnvironmentVariables() {
  const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');

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
  console.log('[verify-paypal-payment] Using PayPal environment: LIVE');
  
  return {
    paypalClientId,
    paypalSecretKey
  };
}
