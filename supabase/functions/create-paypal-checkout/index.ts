
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, parseRequestBody, createErrorResponse, createSuccessResponse, formatPoemForEmail } from "../_shared/email-utils.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const recipientEmail = "matthiasvogel1973@gmail.com";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('[create-paypal-checkout] Starting execution with timestamp:', new Date().toISOString());
    
    if (!paypalClientId || !paypalSecretKey) {
      console.error('[create-paypal-checkout] PayPal credentials are not configured');
      return createErrorResponse('PayPal credentials are not configured', 500);
    }

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
    
    if (!successUrl || !cancelUrl) {
      console.error('[create-paypal-checkout] Missing required parameters', { 
        hasSuccessUrl: !!successUrl, 
        hasCancelUrl: !!cancelUrl
      });
      return createErrorResponse('Missing required parameters: successUrl and cancelUrl', 400);
    }

    console.log('[create-paypal-checkout] Creating PayPal order with params:', { 
      successUrl, 
      cancelUrl, 
      poemTitle,
      hasFormData: !!formData
    });
    
    // Get PayPal access token
    console.log('[create-paypal-checkout] Requesting PayPal access token...');
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalSecretKey}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const authStatus = authResponse.status;
    console.log('[create-paypal-checkout] PayPal auth response status:', authStatus);
    
    if (!authResponse.ok) {
      let errorText = '';
      try {
        errorText = await authResponse.text();
      } catch (e) {
        errorText = 'Could not read error response body';
      }
      
      console.error('[create-paypal-checkout] PayPal auth error:', {
        status: authStatus,
        error: errorText
      });
      return createErrorResponse(`Failed to authenticate with PayPal: ${errorText}`, 500);
    }
    
    let authData;
    try {
      authData = await authResponse.json();
      console.log('[create-paypal-checkout] PayPal auth successful, token received');
    } catch (jsonError) {
      console.error('[create-paypal-checkout] Error parsing auth response:', jsonError);
      return createErrorResponse('Error parsing PayPal authentication response', 500);
    }
    
    if (!authData.access_token) {
      console.error('[create-paypal-checkout] No access token in PayPal response:', authData);
      return createErrorResponse('PayPal did not return an access token', 500);
    }
    
    // Create a PayPal order
    console.log('[create-paypal-checkout] Creating PayPal order...');
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '0.99' // €0.99 for the poem
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
    
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`
      },
      body: JSON.stringify(orderPayload)
    });
    
    const orderStatus = orderResponse.status;
    console.log('[create-paypal-checkout] PayPal order creation status:', orderStatus);
    
    if (!orderResponse.ok) {
      let errorText = '';
      try {
        errorText = await orderResponse.text();
      } catch (e) {
        errorText = 'Could not read error response body';
      }
      
      console.error('[create-paypal-checkout] PayPal order creation error:', {
        status: orderStatus,
        error: errorText
      });
      return createErrorResponse(`Failed to create PayPal order: ${errorText}`, 500);
    }
    
    let orderData;
    try {
      orderData = await orderResponse.json();
      console.log('[create-paypal-checkout] PayPal order created successfully:', { 
        id: orderData.id, 
        status: orderData.status
      });
    } catch (jsonError) {
      console.error('[create-paypal-checkout] Error parsing order response:', jsonError);
      return createErrorResponse('Error parsing PayPal order response', 500);
    }
    
    // Send notification email if formData is provided
    if (formData && resendApiKey) {
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
          .filter(([key]) => key !== 'poem') // Exclude the poem content from the list
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
    
    // Find the approval URL in the links array
    const approvalLink = orderData.links.find(link => link.rel === 'approve');
    
    if (!approvalLink) {
      console.error('[create-paypal-checkout] PayPal approval URL not found in response:', orderData);
      return createErrorResponse('PayPal approval URL not found in response', 500);
    }
    
    console.log('[create-paypal-checkout] Returning success response with approval URL:', approvalLink.href);
    
    // Generate a unique poem ID for tracking
    const poemId = poemTitle ? Buffer.from(poemTitle).toString('base64').substring(0, 36) : null;
    
    return createSuccessResponse({
      id: orderData.id,
      url: approvalLink.href,
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
