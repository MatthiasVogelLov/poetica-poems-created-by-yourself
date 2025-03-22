
import React, { useEffect } from 'react';
import PayPalButton from './PayPalButton';
import PayPalFooter from './PayPalFooter';
import { usePayPalCheckout } from './usePayPalCheckout';

interface PayPalHostedButtonProps {
  isLoading: boolean;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ isLoading: externalLoading }) => {
  const { isLoading: checkoutLoading, initiatePayPalCheckout } = usePayPalCheckout();
  
  // Combined loading state
  const combinedLoading = externalLoading || checkoutLoading;
  
  const handlePayPalClick = async () => {
    await initiatePayPalCheckout();
  };

  return (
    <div className="w-full">
      <PayPalButton 
        isLoading={combinedLoading} 
        onClick={handlePayPalClick} 
      />
      <PayPalFooter />
    </div>
  );
};

export default PayPalHostedButton;
