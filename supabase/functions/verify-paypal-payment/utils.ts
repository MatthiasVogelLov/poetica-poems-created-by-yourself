
/**
 * Parse and validate request data
 */
export async function parseRequestData(req: Request) {
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
 * Extract error text from a response
 */
export async function extractErrorText(response: Response): Promise<string> {
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
