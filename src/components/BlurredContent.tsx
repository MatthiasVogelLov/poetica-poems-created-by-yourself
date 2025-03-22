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

  useEffect(() => {
    if (paypalOrderId) {
      checkPayPalReturn();
      return;
    }
    
    const isPaid = searchParams.get('paid') === 'true';
    const paymentProvider = searchParams.get('payment_provider');
    const transactionId = searchParams.get('tx');
    
    if (transactionId) {
      console.log('User returned from PayPal payment with transaction ID:', transactionId);
      
      if (location.pathname === '/preview') {
        toast.success(`Zahlung erfolgreich (PayPal)`, {
          description: "Ihr Gedicht wurde erfolgreich freigeschaltet."
        });
        
        if (!isPaid) {
          navigate('/preview?paid=true&payment_provider=paypal&tx=' + transactionId, { 
            state: location.state,
            replace: true 
          });
        }
      } else {
        navigate('/preview?paid=true&payment_provider=paypal&tx=' + transactionId, { replace: true });
      }
      return;
    }
    
    if (isPaid && paymentProvider === 'paypal') {
      console.log('User returned from PayPal payment', {
        isPaid,
        paymentProvider,
        pathname: location.pathname
      });
      
      if (location.pathname === '/preview') {
        toast.success(`Zahlung erfolgreich (PayPal)`, {
          description: "Ihr Gedicht wurde erfolgreich freigeschaltet."
        });
      } else {
        navigate('/preview?paid=true&payment_provider=paypal', { replace: true });
      }
    }
  }, [paypalOrderId, checkPayPalReturn, searchParams, navigate, location]);

  return (
    <div className="relative">
      <BlurredPoemSection>
        {children}
      </BlurredPoemSection>
      
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
