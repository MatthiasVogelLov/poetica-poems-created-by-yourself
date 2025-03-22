
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { savePoemToLocalStorage } from '../paymentUtils';
import { PayPalButtons } from './PayPalButtons';

interface PayPalHostedButtonProps {
  isLoading: boolean;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ isLoading }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Save poem data when component mounts to ensure it's available after payment
  useEffect(() => {
    if (location.state?.generatedPoem) {
      const { title, poem } = location.state.generatedPoem;
      savePoemToLocalStorage(title, poem);
      console.log('Saved poem data before PayPal payment:', { title });
    }
  }, [location.state]);
  
  if (isLoading) {
    return (
      <button 
        disabled={true}
        className={`w-full bg-[#0070ba] hover:bg-[#005ea6] text-white px-4 py-2 rounded flex items-center justify-center ${isMobile ? 'text-sm py-1.5' : ''}`}
      >
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Wird bearbeitet...</span>
      </button>
    );
  }

  return (
    <div className="w-full">
      <button 
        onClick={() => window.location.href = '/api/create-paypal-payment'}
        className={`w-full bg-[#FFD140] text-black font-bold px-4 rounded hover:bg-[#f5c638] transition-colors ${isMobile ? 'text-sm py-1.5' : 'py-2'}`}
      >
        Mit PayPal bezahlen
      </button>
      <div className="flex flex-col items-center text-xs text-muted-foreground mt-2">
        <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="Payment methods" className="h-6 mb-1" />
        <div className="flex items-center gap-1">
          Abgewickelt durch 
          <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="PayPal" className="h-3" />
        </div>
      </div>
    </div>
  );
};

export default PayPalHostedButton;
