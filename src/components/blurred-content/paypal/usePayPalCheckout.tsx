
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { savePoemToLocalStorage } from '../paymentUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const usePayPalCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  const saveCurrentPoemData = () => {
    if (location.state?.generatedPoem) {
      const { title, poem } = location.state.generatedPoem;
      savePoemToLocalStorage(title, poem);
      console.log('Saved poem data before PayPal payment:', { title });
    }
  };
  
  const initiatePayPalCheckout = async () => {
    try {
      console.log('Starting PayPal payment process (sandbox)...');
      setIsLoading(true);
      
      // Save poem data before redirecting
      saveCurrentPoemData();
      
      // Call the create-paypal-payment function via Supabase
      const { data, error } = await supabase.functions.invoke('create-paypal-payment');
      
      if (error) {
        console.error('Error calling create-paypal-payment function:', error);
        toast.error('Fehler bei der PayPal-Verbindung', {
          description: 'Bitte versuchen Sie es später erneut.'
        });
        return false;
      }
      
      console.log('PayPal payment function response:', data);
      
      if (data && data.redirectUrl) {
        // Store order ID in localStorage for verification on return
        if (data.orderId) {
          localStorage.setItem('paypal_order_id', data.orderId);
        }
        
        // Open PayPal in a new window to handle the return flow better
        window.open(data.redirectUrl, '_blank');
        
        // Show a message to the user about the new window
        toast.info('PayPal Checkout', {
          description: 'Bitte schließen Sie den Bezahlvorgang im PayPal-Fenster ab.'
        });
        
        return true;
      } else {
        console.error('No redirect URL returned from create-paypal-payment function');
        toast.error('PayPal Checkout konnte nicht gestartet werden');
        return false;
      }
    } catch (err) {
      console.error('Failed to process PayPal payment:', err);
      toast.error('Fehler bei der Zahlung', {
        description: 'Ein unerwarteter Fehler ist aufgetreten.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    initiatePayPalCheckout
  };
};
