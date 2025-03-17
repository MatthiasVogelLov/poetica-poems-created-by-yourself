
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
      
      {/* Removed margin-top to reduce space between sections */}
      <BlurredContentCard 
        isLoading={isLoading} 
        error={error} 
        onPaymentClick={handlePaymentClick} 
      />
    </div>
  );
};

export default BlurredContent;
