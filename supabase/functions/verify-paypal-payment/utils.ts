
/**
 * Extract error text from a response
 */
export async function extractErrorText(response: Response): Promise<string> {
  let errorText = '';
  try {
    const responseText = await response.text();
    console.log('[verify-paypal-payment] Full error response:', responseText);
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
 * Format and log an object in a more readable way
 */
export function logObject(label: string, obj: any) {
  try {
    console.log(`${label}:`, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.log(`${label}: [Could not stringify object]`, obj);
  }
}
