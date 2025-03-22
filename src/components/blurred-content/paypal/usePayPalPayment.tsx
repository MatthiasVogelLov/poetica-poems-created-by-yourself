
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
      
      const { data, error } = await supabase.functions.invoke('verify-paypal-payment', {
        body: { orderId }
      });
      
      if (error) {
        console.error('Error verifying PayPal payment:', error);
        throw new Error(error.message || 'Fehler bei der Verifizierung der PayPal-Zahlung');
      }
      
      if (!data.verified) {
        console.error('PayPal payment not verified, status:', data.status);
        throw new Error(`PayPal-Zahlung konnte nicht verifiziert werden (Status: ${data.status})`);
      }
      
      console.log('PayPal payment verified successfully:', data);
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
