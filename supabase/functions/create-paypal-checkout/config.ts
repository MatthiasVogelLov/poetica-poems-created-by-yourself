
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
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const recipientEmail = "matthiasvogel1973@gmail.com";

  if (!paypalClientId) {
    console.error('[create-paypal-checkout] PayPal Client ID is not configured');
    throw new Error('PayPal Client ID is not configured');
  }

  if (!paypalSecretKey) {
    console.error('[create-paypal-checkout] PayPal Secret Key is not configured');
    throw new Error('PayPal Secret Key is not configured');
  }
  
  const maskedClientId = paypalClientId.substring(0, 4) + '...' + paypalClientId.substring(paypalClientId.length - 4);
  console.log('[create-paypal-checkout] Using PayPal Client ID:', maskedClientId);
  
  return {
    paypalClientId,
    paypalSecretKey,
    resendApiKey,
    recipientEmail
  };
}
