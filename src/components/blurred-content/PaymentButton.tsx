
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PaymentProvider } from './types';

interface PaymentButtonProps {
  provider: PaymentProvider;
  isLoading: boolean;
  onClick: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ provider, isLoading, onClick }) => {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <Button 
        disabled={true}
        className="w-full"
        size={isMobile ? "sm" : "default"}
      >
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Wird bearbeitet...</span>
      </Button>
    );
  }
  
  if (provider === 'paypal') {
    return (
      <Button 
        onClick={onClick}
        className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
        size={isMobile ? "sm" : "default"}
      >
        <div className="flex items-center justify-center">
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.067 8.478c.492.88.695 1.937.599 3.084-.275 3.293-2.787 5.073-6.251 5.073h-.455c-.385 0-.711.282-.771.664l-.162.92-.407 2.683-.035.155c-.06.382-.385.664-.77.664h-3.164c-.322 0-.551-.237-.511-.575l.955-6.344c.01-.068.03-.135.062-.213l.153-.7c.066-.305.359-.537.686-.537h1.5c.103 0 .204.016.302.043 3.214.941 4.992.037 5.765-3.851.23-.13.033-.261.048-.392.192.209.4.406.626.595l.01.01c.075.076.153.148.23.216z" fill="#ffffff"/>
            <path d="M9.118 7.655c.051-.32.321-.557.645-.557h4.003c.942 0 1.7.075 2.331.236.199.05.386.114.56.188.173.073.336.157.483.252.057.036.11.075.163.114-.23.13-.033.261-.048.392-.773 3.888-2.55 4.792-5.765 3.851a1.08 1.08 0 0 0-.302-.043h-1.5a.776.776 0 0 0-.686.537l-.153.7-.063.213-.954 6.344c-.04.338.189.575.51.575h3.164c.385 0 .711-.282.77-.664l.036-.155.406-2.683.052-.284.076-.432c.059-.383.386-.664.77-.664h.456c3.464 0 5.976-1.78 6.25-5.073a4.413 4.413 0 0 0-.598-3.084 3.653 3.653 0 0 0-.626-.595c-.117-.091-.245-.169-.38-.214-1.243-.508-2.99-.593-4.984-.593h-3.924c-.385 0-.738.282-.798.664L9.118 7.655z" fill="#ffffff"/>
            <path d="M8.965 7.107c.04-.338.363-.619.72-.619h4.094c.971 0 1.752.077 2.404.242.652.165 1.215.418 1.688.756.943.673 1.54 1.64 1.801 2.916.021.101.038.204.054.308.492.881.695 1.936.599 3.084-.031.374-.099.743-.202 1.108-.103.363-.241.724-.415 1.081-.174.354-.385.695-.634 1.024-.124.163-.259.32-.403.474-.145.154-.3.301-.464.44-.566.478-1.213.88-1.987 1.176-.775.298-1.672.446-2.695.446h-.574a1.35 1.35 0 0 0-1.113.663l-.035.06-.291 1.624-.366 2.39c-.059.39-.386.678-.771.678H7.512c-.385 0-.627-.288-.536-.678l1.989-13.087z" fill="#253B80"/>
          </svg>
          <span>Mit PayPal bezahlen</span>
        </div>
      </Button>
    );
  }
  
  // Default to Stripe/credit card
  return (
    <Button 
      onClick={onClick}
      className="w-full"
      size={isMobile ? "sm" : "default"}
    >
      <CreditCard size={18} className="mr-2" />
      <span>Mit Kreditkarte bezahlen</span>
    </Button>
  );
};

export default PaymentButton;
