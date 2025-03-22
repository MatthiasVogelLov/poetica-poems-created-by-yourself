
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { savePoemToLocalStorage } from '../paymentUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const usePayPalCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      console.log('Starting PayPal payment process...');
      setIsLoading(true);
      setError(null);
      
      // Save poem data before redirecting
      saveCurrentPoemData();
      
      // Get current URL for return URLs
      const currentUrl = window.location.href;
      const baseUrl = window.location.origin + location.pathname;
      const successUrl = `${baseUrl}?paid=true&payment_provider=paypal`;
      
      // Get poem title if available
      const poemTitle = location.state?.generatedPoem?.title || 'Personalisiertes Gedicht';
      
      // Call the create-paypal-checkout function via Supabase
      const { data, error: functionError } = await supabase.functions.invoke('create-paypal-checkout', {
        body: {
          successUrl: successUrl,
          cancelUrl: currentUrl,
          poemTitle: poemTitle,
          formData: null
        }
      });
      
      if (functionError) {
        console.error('Error calling create-paypal-checkout function:', functionError);
        setError('PayPal-Verbindung fehlgeschlagen. Bitte versuchen Sie es später erneut.');
        toast.error('Fehler bei der PayPal-Verbindung', {
          description: 'Bitte versuchen Sie es später erneut.'
        });
        return false;
      }
      
      console.log('PayPal checkout function response:', data);
      
      if (data && data.url) {
        // Store order ID in localStorage for verification on return
        if (data.id) {
          localStorage.setItem('paypal_order_id', data.id);
        }
        
        // Open PayPal in a new tab
        window.location.href = data.url;
        
        toast.info('PayPal Checkout', {
          description: 'Sie werden zu PayPal weitergeleitet...'
        });
        
        return true;
      } else {
        console.error('No redirect URL returned from create-paypal-checkout function');
        setError('PayPal Checkout konnte nicht gestartet werden');
        toast.error('PayPal Checkout konnte nicht gestartet werden');
        return false;
      }
    } catch (err) {
      console.error('Failed to process PayPal payment:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten');
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
    error,
    initiatePayPalCheckout
  };
};
