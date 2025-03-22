
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for handling PayPal-specific payment functionality
 */
export const usePayPalPayment = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  
  /**
   * Verifies a PayPal payment using the order ID
   */
  const verifyPayPalPayment = async (orderId: string) => {
    try {
      console.log('Verifying PayPal payment for order:', orderId);
      setIsVerifying(true);
      
      // Add request ID for tracking
      const requestId = `verify-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      console.log('Generated request ID:', requestId);
      
      const response = await supabase.functions.invoke('verify-paypal-payment', {
        body: { 
          orderId,
          requestId
        }
      });
      
      // Check for errors in the response
      if (response.error) {
        console.error('Error response from verify-paypal-payment function:', response.error);
        
        // Try to extract more detailed error information if available
        let errorMessage = 'Fehler bei der Verifizierung der PayPal-Zahlung';
        
        if (typeof response.error === 'object' && response.error !== null) {
          if ('message' in response.error && typeof response.error.message === 'string') {
            errorMessage = response.error.message;
          } else if ('error' in response.error && typeof response.error.error === 'string') {
            errorMessage = response.error.error;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Check if data exists and is correctly formatted
      if (!response.data) {
        console.error('Empty response data from verify-paypal-payment function');
        throw new Error('Keine Antwort vom Zahlungsdienstleister erhalten');
      }
      
      console.log('PayPal verification response:', response.data);
      
      if (!response.data.verified) {
        console.error('PayPal payment not verified, status:', response.data.status);
        throw new Error(`PayPal-Zahlung konnte nicht verifiziert werden (Status: ${response.data.status})`);
      }
      
      console.log('PayPal payment verified successfully:', response.data);
      toast.success('Zahlung erfolgreich', {
        description: 'Ihre PayPal-Zahlung wurde erfolgreich verarbeitet.',
      });
      
      // Clear the stored order ID
      localStorage.removeItem('paypal_order_id');
      
      return true;
    } catch (error) {
      console.error('PayPal verification error:', error);
      toast.error('Fehler bei der Zahlung', {
        description: error.message || 'Die PayPal-Zahlung konnte nicht verifiziert werden.',
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };
  
  return {
    verifyPayPalPayment,
    isVerifying
  };
};
