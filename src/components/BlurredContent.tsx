
import React from 'react';
import { usePaymentProcess } from './blurred-content/usePaymentProcess';
import BlurredPoemSection from './blurred-content/BlurredPoemSection';
import BlurredContentCard from './blurred-content/BlurredContentCard';

interface BlurredContentProps {
  children: React.ReactNode;
}

const BlurredContent = ({ children }: BlurredContentProps) => {
  const { isLoading, error, handlePaymentClick } = usePaymentProcess();

  return (
    <div className="relative">
      <BlurredPoemSection>
        {children}
      </BlurredPoemSection>
      
      {/* Payment card is now positioned with negative margin for closer placement */}
      <div className="mt-[-20px]">
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
