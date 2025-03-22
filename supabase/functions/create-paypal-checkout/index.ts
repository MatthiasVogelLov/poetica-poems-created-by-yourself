
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, parseRequestBody, createErrorResponse, createSuccessResponse, formatPoemForEmail } from "../_shared/email-utils.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const recipientEmail = "matthiasvogel1973@gmail.com";

// Always use live PayPal environment
const paypalBaseUrl = 'https://api-m.paypal.com';

/**
 * Validate environment variables and credentials
 */
function validateCredentials() {
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
}

/**
 * Validate required request parameters
 */
function validateRequestParams(successUrl: string, cancelUrl: string) {
  if (!successUrl || !cancelUrl) {
    console.error('[create-paypal-checkout] Missing required parameters', { 
      hasSuccessUrl: !!successUrl, 
      hasCancelUrl: !!cancelUrl
    });
    throw new Error('Missing required parameters: successUrl and cancelUrl');
  }
}

/**
 * Create a Base64 encoded auth string for PayPal API
 */
function createAuthCredentials() {
  const authString = `${paypalClientId}:${paypalSecretKey}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(authString);
  const encodedCredentials = btoa(String.fromCharCode(...new Uint8Array(data)));
  
  console.log('[create-paypal-checkout] Using auth header: Basic ' + encodedCredentials.substring(0, 10) + '...');
  return encodedCredentials;
}

/**
 * Get PayPal access token using client credentials
 */
async function getPayPalAccessToken() {
  console.log('[create-paypal-checkout] Requesting PayPal access token...');
  console.log('[create-paypal-checkout] Sending auth request to:', `${paypalBaseUrl}/v1/oauth2/token`);
  
  const encodedCredentials = createAuthCredentials();
  
  const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
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
}

/**
 * Create PayPal order with the given parameters
 */
async function createPayPalOrder(accessToken: string, poemTitle: string, successUrl: string, cancelUrl: string) {
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
      return_url: `${successUrl}&payment_provider=paypal`,
      cancel_url: cancelUrl,
      brand_name: 'Poetica',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING'
    }
  };
  
  console.log('[create-paypal-checkout] Order payload:', JSON.stringify(orderPayload));
  
  const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
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
    status: orderData.status
  });
  
  return orderData;
}

/**
 * Extract error text from a response
 */
async function extractErrorText(response: Response): Promise<string> {
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
function findApprovalUrl(orderData: any) {
  const approvalLink = orderData.links.find((link: any) => link.rel === 'approve');
  
  if (!approvalLink) {
    console.error('[create-paypal-checkout] PayPal approval URL not found in response:', orderData);
    throw new Error('PayPal approval URL not found in response');
  }
  
  console.log('[create-paypal-checkout] Found approval URL:', approvalLink.href);
  return approvalLink.href;
}

/**
 * Generate a unique poem ID for tracking
 */
function generatePoemId(poemTitle: string): string | null {
  return poemTitle ? Buffer.from(poemTitle).toString('base64').substring(0, 36) : null;
}

/**
 * Send email notification with poem details
 */
async function sendEmailNotification(formData: any, poemTitle: string) {
  if (!formData || !resendApiKey) {
    console.log('[create-paypal-checkout] Skipping email notification - missing data or API key');
    return;
  }
  
  try {
    console.log('[create-paypal-checkout] Attempting to send email notification');
    
    const resend = new Resend(resendApiKey);
    
    // Extract minimal form data
    const minimalFormData = {
      audience: formData.audience || '',
      occasion: formData.occasion || '',
      contentType: formData.contentType || '',
      style: formData.style || '',
      length: formData.length || '',
      keywords: formData.keywords || ''
    };
    
    // Format the form data for the email
    const formDataList = Object.entries(minimalFormData)
      .filter(([key]) => key !== 'poem')
      .map(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
      })
      .join('');

    // Format poem content for email
    const formattedPoemContent = formData.poem ? formatPoemForEmail(formData.poem) : '<p>Kein Gedichttext verfügbar</p>';

    const emailPayload = {
      from: 'Poetica <notification@poetica.apvora.com>',
      to: recipientEmail,
      subject: `Neues Gedicht: ${poemTitle} (PayPal Checkout)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1d3557; border-bottom: 1px solid #ddd; padding-bottom: 10px;">${poemTitle}</h1>
          
          <h2 style="color: #457b9d; margin-top: 20px;">Gedicht</h2>
          <div style="white-space: pre-line; font-family: 'Playfair Display', serif; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6;">
            ${formattedPoemContent}
          </div>
          
          <h2 style="color: #457b9d; margin-top: 20px;">Gewählte Einstellungen</h2>
          <ul style="line-height: 1.6;">
            ${formDataList || '<li>Keine Einstellungen verfügbar</li>'}
          </ul>
          
          <p style="margin-top: 30px; color: #6c757d; font-size: 14px; border-top: 1px solid #ddd; padding-top: 10px;">
            Diese E-Mail wurde automatisch von der Poetica App gesendet (PayPal Checkout).
          </p>
        </div>
      `
    };

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error('[create-paypal-checkout] Error sending email via Resend:', error);
    } else {
      console.log('[create-paypal-checkout] Email notification sent successfully via Resend:', data);
    }
  } catch (emailError) {
    console.error('[create-paypal-checkout] Error sending notification:', emailError);
    // Don't throw, allow checkout to continue
  }
}

/**
 * Main handler function for the create-paypal-checkout endpoint
 */
serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('[create-paypal-checkout] Starting execution with timestamp:', new Date().toISOString());
    console.log('[create-paypal-checkout] Using PayPal environment: LIVE');
    
    // Validate PayPal credentials
    validateCredentials();
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('[create-paypal-checkout] Request data received:', JSON.stringify({
        hasSuccessUrl: !!requestData.successUrl,
        hasCancelUrl: !!requestData.cancelUrl,
        poemTitle: requestData.poemTitle,
        hasFormData: !!requestData.formData
      }));
    } catch (parseError) {
      console.error('[create-paypal-checkout] Error parsing request body:', parseError);
      return createErrorResponse('Invalid request format', 400);
    }
    
    const { successUrl, cancelUrl, poemTitle, formData } = requestData;
    
    // Validate request parameters
    validateRequestParams(successUrl, cancelUrl);

    console.log('[create-paypal-checkout] Creating PayPal order with params:', { 
      successUrl, 
      cancelUrl, 
      poemTitle,
      hasFormData: !!formData
    });
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Create PayPal order
    const orderData = await createPayPalOrder(accessToken, poemTitle, successUrl, cancelUrl);
    
    // Send email notification if form data is provided
    await sendEmailNotification(formData, poemTitle);
    
    // Find the approval URL in the links array
    const approvalUrl = findApprovalUrl(orderData);
    
    console.log('[create-paypal-checkout] Returning success response with approval URL:', approvalUrl);
    
    // Generate a unique poem ID for tracking
    const poemId = generatePoemId(poemTitle);
    
    return createSuccessResponse({
      id: orderData.id,
      url: approvalUrl,
      poemId: poemId
    });
  } catch (error) {
    console.error('[create-paypal-checkout] Unhandled error:', error);
    
    return createErrorResponse(
      error.message || 'Unexpected error creating PayPal checkout',
      500
    );
  }
});
