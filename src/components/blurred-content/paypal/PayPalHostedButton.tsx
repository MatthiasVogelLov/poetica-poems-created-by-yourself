
import React, { useState, useEffect } from 'react';
import PayPalButton from './PayPalButton';
import PayPalFooter from './PayPalFooter';
import { usePayPalCheckout } from './usePayPalCheckout';
import PaymentError from '../PaymentError';

interface PayPalHostedButtonProps {
  isLoading: boolean;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ isLoading: externalLoading }) => {
  const { isLoading: checkoutLoading, error, initiatePayPalCheckout } = usePayPalCheckout();
  
  // Combined loading state
  const combinedLoading = externalLoading || checkoutLoading;
  
  const handlePayPalClick = async () => {
    await initiatePayPalCheckout();
  };

  // If there is an error, use the standard PayPal button with error styling
  if (error) {
    return (
      <div className="w-full">
        <PaymentError error={error} />
        <PayPalButton 
          isLoading={combinedLoading} 
          onClick={handlePayPalClick}
          hasError={true}
        />
        <PayPalFooter />
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalButton 
        isLoading={combinedLoading} 
        onClick={handlePayPalClick}
        hasError={false}
      />
      <PayPalFooter />
    </div>
  );
};

export default PayPalHostedButton;
