
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "../_shared/email-utils.ts";

const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('[verify-paypal-payment] Starting execution with timestamp:', new Date().toISOString());
    
    if (!paypalClientId || !paypalSecretKey) {
      console.error('[verify-paypal-payment] PayPal credentials are not configured');
      throw new Error('PayPal credentials are not configured');
    }

    // Parse request body
    const { orderId } = await req.json();
    
    if (!orderId) {
      console.error('[verify-paypal-payment] Missing order ID');
      throw new Error('Missing PayPal order ID');
    }

    console.log('[verify-paypal-payment] Verifying PayPal order:', { orderId });
    
    // Get PayPal access token
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalSecretKey}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!authResponse.ok) {
      const errorData = await authResponse.text();
      console.error('[verify-paypal-payment] PayPal auth error:', errorData);
      throw new Error('Failed to authenticate with PayPal');
    }
    
    const authData = await authResponse.json();
    
    // Verify the order status
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`
      }
    });
    
    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('[verify-paypal-payment] PayPal order verification error:', errorData);
      throw new Error('Failed to verify PayPal order');
    }
    
    const orderData = await orderResponse.json();
    
    console.log('[verify-paypal-payment] PayPal order status:', { 
      id: orderData.id, 
      status: orderData.status
    });
    
    // If the order is not completed, capture the payment
    if (orderData.status === 'APPROVED') {
      console.log('[verify-paypal-payment] Capturing approved payment');
      
      const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`
        }
      });
      
      if (!captureResponse.ok) {
        const errorData = await captureResponse.text();
        console.error('[verify-paypal-payment] PayPal capture error:', errorData);
        throw new Error('Failed to capture PayPal payment');
      }
      
      const captureData = await captureResponse.json();
      
      console.log('[verify-paypal-payment] Payment captured successfully:', { 
        id: captureData.id, 
        status: captureData.status
      });
      
      return createSuccessResponse({
        id: captureData.id,
        status: captureData.status,
        verified: true
      });
    }
    
    // Check if the payment is already completed
    if (orderData.status === 'COMPLETED') {
      console.log('[verify-paypal-payment] Payment already completed');
      
      return createSuccessResponse({
        id: orderData.id,
        status: orderData.status,
        verified: true
      });
    }
    
    // If we get here, the payment is not completed or approved
    console.log('[verify-paypal-payment] Payment not completed or approved:', orderData.status);
    
    return createSuccessResponse({
      id: orderData.id,
      status: orderData.status,
      verified: false
    });
  } catch (error) {
    console.error('[verify-paypal-payment] Error verifying PayPal payment:', error);
    
    return createErrorResponse(
      error.message || 'Error verifying PayPal payment',
      400
    );
  }
});
