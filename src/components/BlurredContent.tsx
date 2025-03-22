
import React, { useEffect } from 'react';
import { usePaymentProcess } from './blurred-content/usePaymentProcess';
import BlurredPoemSection from './blurred-content/BlurredPoemSection';
import BlurredContentCard from './blurred-content/BlurredContentCard';

interface BlurredContentProps {
  children: React.ReactNode;
}

const BlurredContent = ({ children }: BlurredContentProps) => {
  const { 
    isLoading, 
    error, 
    handlePaymentClick, 
    checkPayPalReturn,
    paypalOrderId 
  } = usePaymentProcess();

  // Check for PayPal return on component mount
  useEffect(() => {
    if (paypalOrderId) {
      checkPayPalReturn();
    }
  }, [paypalOrderId, checkPayPalReturn]);

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
