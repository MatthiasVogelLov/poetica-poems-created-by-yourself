
/**
 * Parse and validate request data
 */
export async function parseRequestData(req: Request) {
  try {
    const requestData = await req.json();
    console.log('[create-paypal-checkout] Request data received:', JSON.stringify({
      hasSuccessUrl: !!requestData.successUrl,
      hasCancelUrl: !!requestData.cancelUrl,
      poemTitle: requestData.poemTitle,
      hasFormData: !!requestData.formData
    }));
    
    return requestData;
  } catch (parseError) {
    console.error('[create-paypal-checkout] Error parsing request body:', parseError);
    throw new Error('Invalid request format');
  }
}

/**
 * Validate required request parameters
 */
export function validateRequestParams(successUrl: string, cancelUrl: string) {
  if (!successUrl || !cancelUrl) {
    console.error('[create-paypal-checkout] Missing required parameters', { 
      hasSuccessUrl: !!successUrl, 
      hasCancelUrl: !!cancelUrl
    });
    throw new Error('Missing required parameters: successUrl and cancelUrl');
  }
}

/**
 * Generate a unique poem ID for tracking
 */
export function generatePoemId(poemTitle: string): string | null {
  return poemTitle ? Buffer.from(poemTitle).toString('base64').substring(0, 36) : null;
}
