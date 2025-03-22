
import { useState } from 'react';
import { Location, NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminBypass } from '../useAdminBypass';
import { 
  preparePaymentData, 
  savePoemToLocalStorage, 
  processStripeCheckout
} from '../paymentUtils';
import { PaymentProvider } from '../types';
import { toast } from 'sonner';

/**
 * Hook for handling payment button clicks
 */
export const usePaymentHandler = (navigate: NavigateFunction, location: Location) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdminLoggedIn, handleAdminBypass } = useAdminBypass();

  /**
   * Handle PayPal payment specifically
   */
  const handlePayPalClick = async () => {
    try {
      console.log('Starting PayPal checkout process...');
      
      // Call the create-paypal-payment function via Supabase
      const { data, error } = await supabase.functions.invoke('create-paypal-payment');
      
      if (error) {
        console.error('Error calling create-paypal-payment function:', error);
        throw new Error('Fehler bei der PayPal-Verbindung');
      }
      
      console.log('PayPal payment function response:', data);
      
      if (data && data.redirectUrl) {
        // Store order ID in localStorage for verification on return
        if (data.orderId) {
          localStorage.setItem('paypal_order_id', data.orderId);
        }
        
        window.location.href = data.redirectUrl;
      } else {
        console.error('No redirect URL received from create-paypal-payment function');
        throw new Error('Keine PayPal Checkout-URL erhalten');
      }
    } catch (err) {
      console.error('Failed to process PayPal payment:', err);
      throw err;
    }
  };

  /**
   * Main function to handle payment button clicks
   */
  const handlePaymentClick = async (provider: PaymentProvider = 'stripe') => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Check if user is admin - if so, bypass payment
      if (isAdminLoggedIn()) {
        handleAdminBypass(navigate, location.pathname, provider, location.state);
        setIsProcessing(false);
        return;
      }
      
      // Regular payment flow for non-admin users
      const paymentData = preparePaymentData(location);
      console.log(`Payment process started with ${provider}`, { 
        successUrl: paymentData.successUrl, 
        cancelUrl: paymentData.cancelUrl, 
        poemTitle: paymentData.poemTitle
      });
      
      // Save poem data to localStorage before redirecting
      if (paymentData.poemTitle && paymentData.poem) {
        savePoemToLocalStorage(paymentData.poemTitle, paymentData.poem);
      }
      
      // Process payment based on selected provider
      if (provider === 'paypal') {
        // Save additional backup to session storage
        try {
          sessionStorage.setItem('poemBackup', JSON.stringify({
            title: paymentData.poemTitle,
            poem: paymentData.poem,
            timestamp: new Date().toISOString()
          }));
          console.log('Backup saved to sessionStorage');
          
          // Save another backup with timestamp
          const backupKey = `poemData_${Date.now()}`;
          sessionStorage.setItem(backupKey, JSON.stringify({
            title: paymentData.poemTitle,
            poem: paymentData.poem,
            timestamp: new Date().toISOString()
          }));
          console.log('Additional backup saved with key:', backupKey);
        } catch (e) {
          console.error('Error saving to sessionStorage:', e);
        }
        
        await handlePayPalClick();
      } else {
        // Default to Stripe
        const checkoutData = await processStripeCheckout(paymentData);
        
        // Redirect to Stripe checkout
        if (checkoutData?.url) {
          console.log('Redirecting to Stripe:', checkoutData.url);
          window.location.href = checkoutData.url;
        } else {
          console.error('No Stripe checkout URL received', checkoutData);
          throw new Error('Keine Checkout-URL erhalten');
        }
      }
    } catch (error) {
      console.error('Payment process error:', error);
      setError(error.message || 'Bei der Zahlungsabwicklung ist ein Fehler aufgetreten');
      
      toast.error('Fehler', {
        description: error.message || 'Bei der Zahlungsabwicklung ist ein Fehler aufgetreten.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    handlePaymentClick
  };
};
