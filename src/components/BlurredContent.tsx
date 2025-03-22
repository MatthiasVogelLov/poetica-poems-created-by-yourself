
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { usePaymentProcess } from './blurred-content/usePaymentProcess';
import BlurredPoemSection from './blurred-content/BlurredPoemSection';
import BlurredContentCard from './blurred-content/BlurredContentCard';
import { toast } from "sonner";

interface BlurredContentProps {
  children: React.ReactNode;
}

const BlurredContent = ({ children }: BlurredContentProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isLoading, 
    error, 
    handlePaymentClick, 
    checkPayPalReturn,
    paypalOrderId 
  } = usePaymentProcess();

  // Check if returning from payment
  useEffect(() => {
    // Check for API flow return
    if (paypalOrderId) {
      checkPayPalReturn();
      return;
    }
    
    // Check for various PayPal return parameters
    const isPaid = searchParams.get('paid') === 'true';
    const paymentProvider = searchParams.get('payment_provider');
    const paymentStatus = searchParams.get('status');
    const transactionId = searchParams.get('tx');
    
    // If we have a transaction ID or completed status from PayPal, mark as paid
    const isPayPalSuccess = transactionId || paymentStatus === 'COMPLETED' || paymentStatus === 'success';
    
    if ((isPaid && paymentProvider === 'paypal') || isPayPalSuccess) {
      console.log('User returned from PayPal payment', {
        isPaid,
        paymentProvider,
        paymentStatus,
        transactionId,
        pathname: location.pathname
      });
      
      // If we're on the preview page, just ensure state is properly set
      if (location.pathname === '/preview') {
        // We're already on the preview page, show success message
        toast.success(`Zahlung erfolgreich (PayPal)`, {
          description: "Ihr Gedicht wurde erfolgreich freigeschaltet."
        });
        
        // If we don't have paid=true in the URL, add it
        if (!isPaid) {
          navigate('/preview?paid=true&payment_provider=paypal', { 
            state: location.state,
            replace: true 
          });
        }
      } else {
        // If not on preview page, redirect to preview with paid=true
        navigate('/preview?paid=true&payment_provider=paypal', { replace: true });
      }
    }
  }, [paypalOrderId, checkPayPalReturn, searchParams, navigate, location]);

  return (
    <div className="relative">
      <BlurredPoemSection>
        {children}
      </BlurredPoemSection>
      
      {/* Payment card is now positioned with negative margin for closer placement */}
      <div className="mt-[-40px]">
        <BlurredContentCard 
          isLoading={isLoading} 
          error={error} 
          onPaymentClick={handlePaymentClick} 
        />
      </div>
    </div>
  );
};

export default BlurredContent;
