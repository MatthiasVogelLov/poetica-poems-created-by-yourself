
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePayPalPayment } from './paypal/usePayPalPayment';
import { useAdminBypass } from './useAdminBypass';
import { 
  preparePaymentData, 
  savePoemToLocalStorage, 
  processStripeCheckout,
  processPayPalCheckout
} from './paymentUtils';
import { PaymentProvider, UsePaymentProcessProps } from './types';
import { toast } from 'sonner';

/**
 * Main hook for handling payment processing
 */
export const usePaymentProcess = (): UsePaymentProcessProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAdminLoggedIn, handleAdminBypass } = useAdminBypass();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if there's a PayPal order ID in localStorage or from URL params
  const storedOrderId = localStorage.getItem('paypal_order_id');
  const paymentProvider = searchParams.get('payment_provider') as PaymentProvider;
  const paypalOrderId = searchParams.get('token') || storedOrderId;
  
  // Check if returning from PayPal with success
  const isPaid = searchParams.get('paid') === 'true';
  
  /**
   * Verifies a PayPal payment using the order ID
   */
  const verifyPayPalPayment = async (orderId: string) => {
    try {
      console.log('Verifying PayPal payment for order:', orderId);
      setIsLoading(true);
      
      // Add request ID for tracking
      const requestId = `verify-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      const response = await supabase.functions.invoke('verify-paypal-payment', {
        body: { 
          orderId,
          requestId
        }
      });
      
      // Check for errors in the response
      if (response.error) {
        console.error('Error verifying PayPal payment:', response.error);
        
        let errorMessage = 'Fehler bei der Verifizierung der PayPal-Zahlung';
        if (typeof response.error === 'object' && response.error !== null) {
          if ('message' in response.error && typeof response.error.message === 'string') {
            errorMessage = response.error.message;
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
      setIsLoading(false);
    }
  };
  
  /**
   * Check if returning from PayPal
   */
  const checkPayPalReturn = async () => {
    // If we have a PayPal order ID and we're not already marked as paid
    if (paymentProvider === 'paypal' && paypalOrderId && !isPaid) {
      const verified = await verifyPayPalPayment(paypalOrderId);
      
      if (verified) {
        // Create URL with paid parameter
        const currentPath = location.pathname;
        const paidUrl = `${currentPath}?paid=true&payment_provider=paypal`;
        
        // Redirect to the same page with paid=true
        navigate(paidUrl, { 
          state: location.state,
          replace: true 
        });
      }
    }
  };
  
  // Check for PayPal return on component mount
  useEffect(() => {
    if (paypalOrderId && paymentProvider === 'paypal' && !isPaid) {
      checkPayPalReturn();
    }
  }, [paypalOrderId, paymentProvider, isPaid]);
  
  /**
   * Main function to handle payment button clicks
   */
  const handlePaymentClick = async (provider: PaymentProvider = 'stripe') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user is admin - if so, bypass payment
      if (isAdminLoggedIn()) {
        handleAdminBypass(navigate, location.pathname, provider, location.state);
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };
  
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

  return { 
    isLoading, 
    error, 
    handlePaymentClick,
    checkPayPalReturn,
    paymentProvider,
    paypalOrderId
  };
};

// Re-export the PaymentProvider type for convenience
export type { PaymentProvider } from './types';
