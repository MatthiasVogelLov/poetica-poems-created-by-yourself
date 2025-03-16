
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PaymentErrorProps {
  error: string | null;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-start">
      <AlertTriangle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
      <p className="text-sm">{error}</p>
    </div>
  );
};

export default PaymentError;
