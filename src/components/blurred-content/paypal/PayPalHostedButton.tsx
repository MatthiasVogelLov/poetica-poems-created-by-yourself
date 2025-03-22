
import React, { useState, useEffect } from 'react';
import PayPalButton from './PayPalButton';
import PayPalFooter from './PayPalFooter';
import { usePayPalCheckout } from './usePayPalCheckout';
import PaymentError from '../PaymentError';
import { PayPalButtons } from './PayPalButtons';

interface PayPalHostedButtonProps {
  isLoading: boolean;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ isLoading: externalLoading }) => {
  const { isLoading: checkoutLoading, error, initiatePayPalCheckout } = usePayPalCheckout();
  const [useHostedButton, setUseHostedButton] = useState(true);
  
  // Combined loading state
  const combinedLoading = externalLoading || checkoutLoading;
  
  const handlePayPalClick = async () => {
    await initiatePayPalCheckout();
  };

  // Fallback to standard button if we detect issues with the hosted button
  useEffect(() => {
    const hasHostedButtonError = error && error.includes('PayPal');
    
    if (hasHostedButtonError) {
      setUseHostedButton(false);
      console.log('Falling back to standard PayPal button due to error');
    }
  }, [error]);

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
      {/* Use hosted PayPal buttons when there's no error */}
      {!error && !combinedLoading ? (
        useHostedButton ? <PayPalButtons /> : (
          <PayPalButton 
            isLoading={combinedLoading} 
            onClick={handlePayPalClick}
            hasError={false}
          />
        )
      ) : (
        <PayPalButton 
          isLoading={combinedLoading} 
          onClick={handlePayPalClick}
          hasError={false}
        />
      )}
      <PayPalFooter />
    </div>
  );
};

export default PayPalHostedButton;
