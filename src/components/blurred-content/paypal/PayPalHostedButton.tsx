
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { savePoemToLocalStorage } from '../paymentUtils';

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
  
  // Create return URL to the current page with paid=true
  const currentPath = location.pathname;
  const returnUrl = `${window.location.origin}${currentPath}?paid=true&payment_provider=paypal`;
  const cancelUrl = window.location.href;
  
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
  
  // Using direct checkout link with auto-return parameters
  return (
    <div className="w-full">
      <form 
        action="https://www.paypal.com/cgi-bin/webscr" 
        method="post" 
        target="_top"
        className="w-full flex flex-col items-center gap-2"
      >
        {/* PayPal Standard Checkout parameters */}
        <input type="hidden" name="cmd" value="_xclick" />
        <input type="hidden" name="business" value="matthiasvogel1973@gmail.com" />
        <input type="hidden" name="lc" value="DE" />
        <input type="hidden" name="item_name" value="Personalisiertes Gedicht" />
        <input type="hidden" name="amount" value="1.29" />
        <input type="hidden" name="currency_code" value="EUR" />
        <input type="hidden" name="button_subtype" value="services" />
        <input type="hidden" name="no_note" value="1" />
        <input type="hidden" name="no_shipping" value="1" />
        <input type="hidden" name="rm" value="1" /> {/* Return method: GET */}
        <input type="hidden" name="return" value={returnUrl} />
        <input type="hidden" name="cancel_return" value={cancelUrl} />
        <input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted" />
        
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

export default PayPalHostedButton;
