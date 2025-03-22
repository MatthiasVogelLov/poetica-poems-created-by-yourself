
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
      
      // Add additional backup to session storage
      try {
        sessionStorage.setItem('poemBackup', JSON.stringify({
          title,
          poem,
          timestamp: new Date().toISOString()
        }));
        console.log('Additional backup saved to sessionStorage');
      } catch (e) {
        console.error('Error saving to sessionStorage:', e);
      }
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
      const cancelUrl = `${currentUrl}`;
      
      // Get poem title if available
      const poemTitle = location.state?.generatedPoem?.title || 'Personalisiertes Gedicht';
      
      console.log('PayPal checkout parameters:', {
        successUrl,
        cancelUrl,
        poemTitle,
        currentRoute: location.pathname
      });
      
      // Call the create-paypal-checkout function via Supabase
      const response = await supabase.functions.invoke('create-paypal-checkout', {
        body: {
          successUrl: successUrl,
          cancelUrl: cancelUrl,
          poemTitle: poemTitle,
          formData: null
        }
      });
      
      // Log the full response for debugging
      console.log('PayPal checkout function full response:', response);
      
      if (response.error) {
        console.error('Error calling create-paypal-checkout function:', response.error);
        setError('PayPal-Verbindung fehlgeschlagen. Bitte versuchen Sie es später erneut.');
        toast.error('Fehler bei der PayPal-Verbindung', {
          description: 'Bitte versuchen Sie es später erneut.'
        });
        return false;
      }
      
      // Access the response data
      const data = response.data;
      console.log('PayPal checkout function processed data:', data);
      
      if (!data) {
        console.error('No data returned from create-paypal-checkout function');
        setError('PayPal Checkout konnte nicht gestartet werden');
        toast.error('PayPal Checkout konnte nicht gestartet werden');
        return false;
      }
      
      if (data.url) {
        // Store order ID in localStorage for verification on return
        if (data.id) {
          localStorage.setItem('paypal_order_id', data.id);
          console.log('Saved PayPal order ID to localStorage:', data.id);
        }
        
        // Redirect to PayPal
        console.log('Redirecting to PayPal URL:', data.url);
        
        // Add a delay to make sure console logs are visible
        setTimeout(() => {
          window.location.href = data.url;
        }, 100);
        
        toast.info('PayPal Checkout', {
          description: 'Sie werden zu PayPal weitergeleitet...'
        });
        
        return true;
      } else {
        console.error('No redirect URL in response:', data);
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
