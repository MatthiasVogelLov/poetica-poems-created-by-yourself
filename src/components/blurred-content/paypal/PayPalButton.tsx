
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PayPalButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ isLoading, onClick }) => {
  const isMobile = useIsMobile();
  
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
    <button 
      onClick={onClick}
      className={`w-full bg-[#FFD140] text-black font-bold px-4 rounded hover:bg-[#f5c638] transition-colors ${isMobile ? 'text-sm py-1.5' : 'py-2'}`}
    >
      Mit PayPal bezahlen
    </button>
  );
};

export default PayPalButton;
