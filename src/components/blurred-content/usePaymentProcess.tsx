
import { useState } from 'react';
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

/**
 * Main hook for handling payment processing
 */
export const usePaymentProcess = (): UsePaymentProcessProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { verifyPayPalPayment } = usePayPalPayment();
  const { isAdminLoggedIn, handleAdminBypass } = useAdminBypass();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if returning from PayPal with a token
  const paymentProvider = searchParams.get('payment_provider') as PaymentProvider;
  const paypalOrderId = searchParams.get('token');
  
  /**
   * Checks if the user is returning from a PayPal payment and verifies it
   */
  const checkPayPalReturn = async () => {
    if (paymentProvider === 'paypal' && paypalOrderId) {
      setIsLoading(true);
      const verified = await verifyPayPalPayment(paypalOrderId);
      
      if (verified) {
        // Create URL with paid parameter
        const currentPath = location.pathname;
        const paidUrl = `${currentPath}?paid=true`;
        
        // Redirect to the same page with paid=true
        navigate(paidUrl, { 
          state: location.state,
          replace: true 
        });
      }
      
      setIsLoading(false);
    }
  };
  
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
        poemTitle: paymentData.poemTitle,
        currentPath: paymentData.currentPath,
        origin: window.location.origin,
        poemLength: paymentData.poem?.length || 0
      });
      
      // Save poem data to localStorage before redirecting
      if (paymentData.poemTitle && paymentData.poem) {
        savePoemToLocalStorage(paymentData.poemTitle, paymentData.poem);
      }
      
      // Process payment based on selected provider
      let checkoutData;
      
      if (provider === 'paypal') {
        checkoutData = await processPayPalCheckout(paymentData);
        
        // Final localStorage check before redirect
        try {
          const finalCheck = localStorage.getItem('currentPoemData');
          console.log('Final localStorage check before PayPal redirect:', 
            finalCheck ? 'Data found' : 'NO DATA FOUND', 
            finalCheck ? JSON.parse(finalCheck).title : ''
          );
        } catch (e) {
          console.error('Error in final localStorage check:', e);
        }
        
        // Redirect to PayPal checkout
        if (checkoutData?.url) {
          console.log('Redirecting to PayPal:', checkoutData.url);
          window.location.href = checkoutData.url;
        } else {
          console.error('No PayPal checkout URL received', checkoutData);
          throw new Error('Keine PayPal Checkout-URL erhalten');
        }
      } else {
        // Default to Stripe
        checkoutData = await processStripeCheckout(paymentData);
        
        // Final localStorage check before redirect
        try {
          const finalCheck = localStorage.getItem('currentPoemData');
          console.log('Final localStorage check before Stripe redirect:', 
            finalCheck ? 'Data found' : 'NO DATA FOUND', 
            finalCheck ? JSON.parse(finalCheck).title : ''
          );
        } catch (e) {
          console.error('Error in final localStorage check:', e);
        }
        
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
      
      toast({
        title: "Fehler",
        description: error.message || "Bei der Zahlungsabwicklung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
// FIX: Use "export type" when re-exporting a type with isolatedModules enabled
export type { PaymentProvider } from './types';
