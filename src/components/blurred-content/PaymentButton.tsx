
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PaymentProvider } from './types';
import PayPalHostedButton from './paypal/PayPalHostedButton';

interface PaymentButtonProps {
  provider: PaymentProvider;
  isLoading: boolean;
  onClick: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ provider, isLoading, onClick }) => {
  const isMobile = useIsMobile();
  
  // If this is the PayPal button, use the hosted button component
  if (provider === 'paypal') {
    return <PayPalHostedButton isLoading={isLoading} />;
  }
  
  // Loading state
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
