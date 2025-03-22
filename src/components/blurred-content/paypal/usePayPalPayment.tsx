
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for handling PayPal-specific payment functionality
 */
export const usePayPalPayment = () => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  
  /**
   * Verifies a PayPal payment using the order ID
   */
  const verifyPayPalPayment = async (orderId: string) => {
    try {
      console.log('Verifying PayPal payment for order:', orderId);
      setIsVerifying(true);
      
      const response = await supabase.functions.invoke('verify-paypal-payment', {
        body: { orderId }
      });
      
      // Check for errors in the response
      if (response.error) {
        console.error('Error response from verify-paypal-payment function:', response.error);
        throw new Error(response.error.message || 'Fehler bei der Verifizierung der PayPal-Zahlung');
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
      return true;
    } catch (error) {
      console.error('PayPal verification error:', error);
      toast({
        title: "Fehler bei der Zahlung",
        description: error.message || "Die PayPal-Zahlung konnte nicht verifiziert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
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
