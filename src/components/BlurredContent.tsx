
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { usePaymentProcess } from './blurred-content/usePaymentProcess';
import BlurredPoemSection from './blurred-content/BlurredPoemSection';
import BlurredContentCard from './blurred-content/BlurredContentCard';

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

  // Check for PayPal return parameters from both API and hosted checkout
  useEffect(() => {
    // Check for API flow return
    if (paypalOrderId) {
      checkPayPalReturn();
      return;
    }
    
    // Check for hosted checkout return
    const paymentStatus = searchParams.get('status');
    if (paymentStatus === 'COMPLETED' || paymentStatus === 'success') {
      // Navigate to the paid state
      const currentPath = location.pathname;
      navigate(`${currentPath}?paid=true&payment_provider=paypal`, { 
        state: location.state,
        replace: true 
      });
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
