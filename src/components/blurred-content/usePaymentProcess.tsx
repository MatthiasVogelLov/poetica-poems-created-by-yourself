
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { usePayPalVerification } from './hooks/usePayPalVerification';
import { usePaymentHandler } from './hooks/usePaymentHandler';
import { PaymentProvider, UsePaymentProcessProps } from './types';
import { toast } from 'sonner';

/**
 * Main hook for handling payment processing
 */
export const usePaymentProcess = (): UsePaymentProcessProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Check if there's a PayPal order ID in localStorage or from URL params
  const storedOrderId = localStorage.getItem('paypal_order_id');
  const paymentProvider = searchParams.get('payment_provider') as PaymentProvider;
  const paypalOrderId = searchParams.get('token') || storedOrderId;
  
  // Check if returning from PayPal with success
  const isPaid = searchParams.get('paid') === 'true';
  
  // Use our extracted hooks
  const { isVerifying, verifyPayPalPayment } = usePayPalVerification();
  const { isProcessing, error, handlePaymentClick } = usePaymentHandler(navigate, location);
  
  // Combined loading state
  const isLoading = isProcessing || isVerifying;
  
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
