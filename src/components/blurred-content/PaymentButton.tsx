
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ isLoading, onClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      className="w-full"
      size={isMobile ? "sm" : "default"}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          <span>Wird bearbeitet...</span>
        </>
      ) : (
        <>
          <CreditCard size={18} className="mr-2" />
          <span>Jetzt freischalten</span>
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
