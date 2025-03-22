
import React from 'react';

const PayPalFooter: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-xs text-muted-foreground mt-2">
      <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="Payment methods" className="h-6 mb-1" />
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Sandbox-Modus</span> · Abgewickelt durch 
        <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="PayPal" className="h-3" />
      </div>
    </div>
  );
};

export default PayPalFooter;
