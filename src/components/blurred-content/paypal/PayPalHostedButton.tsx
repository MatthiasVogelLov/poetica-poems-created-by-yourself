
import React from 'react';
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
    console.log('PayPal button clicked, initiating checkout...');
    await initiatePayPalCheckout();
  };

  return (
    <div className="w-full">
      {error && <PaymentError error={error} />}
      <PayPalButton 
        isLoading={combinedLoading} 
        onClick={handlePayPalClick}
        hasError={!!error}
      />
      <PayPalFooter />
    </div>
  );
};

export default PayPalHostedButton;
