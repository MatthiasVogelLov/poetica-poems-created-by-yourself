
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface PayPalButtonsProps {
  onApprove?: (data: any) => void;
  onCancel?: () => void;
  onError?: (err: any) => void;
}

export const PayPalButtons: React.FC<PayPalButtonsProps> = ({
  onApprove,
  onCancel,
  onError
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Create return URL to the current page with paid=true
  const currentPath = location.pathname;
  const returnUrl = `${window.location.origin}${currentPath}?paid=true&payment_provider=paypal`;
  const cancelUrl = window.location.href;

  return (
    <div className="w-full">
      <form 
        action="https://www.paypal.com/cgi-bin/webscr" 
        method="post" 
        target="_top"
        className="w-full flex flex-col items-center gap-2"
      >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="MQBQFKYJP8NJW" />
        <input type="hidden" name="currency_code" value="EUR" />
        <input type="hidden" name="rm" value="1" />
        <input type="hidden" name="return" value={returnUrl} />
        <input type="hidden" name="cancel_return" value={cancelUrl} />
        
        <button 
          type="submit"
          className={`w-full bg-[#FFD140] text-black font-bold px-4 rounded hover:bg-[#f5c638] transition-colors ${isMobile ? 'text-sm py-1.5' : 'py-2'}`}
        >
          Mit PayPal bezahlen
        </button>
        <div className="flex flex-col items-center text-xs text-muted-foreground">
          <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="Payment methods" className="h-6 mb-1" />
          <div className="flex items-center gap-1">
            Abgewickelt durch 
            <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="PayPal" className="h-3" />
          </div>
        </div>
      </form>
    </div>
  );
};
