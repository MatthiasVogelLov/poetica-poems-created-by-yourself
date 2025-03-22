
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { savePoemToLocalStorage } from '../paymentUtils';
import { PayPalButtons } from './PayPalButtons';
import { supabase } from '@/integrations/supabase/client';

interface PayPalHostedButtonProps {
  isLoading: boolean;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ isLoading }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
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

  const handlePayPalClick = async () => {
    try {
      console.log('Starting PayPal payment process...');
      
      // Call the create-paypal-payment function via Supabase
      const { data, error } = await supabase.functions.invoke('create-paypal-payment');
      
      if (error) {
        console.error('Error calling create-paypal-payment function:', error);
        return;
      }
      
      console.log('PayPal payment function response:', data);
      
      if (data && data.redirectUrl) {
        // Open PayPal in a new window for better return handling
        window.open(data.redirectUrl, '_blank');
      } else {
        console.error('No redirect URL returned from create-paypal-payment function');
      }
    } catch (err) {
      console.error('Failed to process PayPal payment:', err);
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handlePayPalClick}
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
