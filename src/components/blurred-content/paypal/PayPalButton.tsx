
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertTriangle } from 'lucide-react';

interface PayPalButtonProps {
  isLoading: boolean;
  onClick: () => void;
  hasError?: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ isLoading, onClick, hasError = false }) => {
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
      className={`w-full ${hasError ? 'bg-amber-100 border border-amber-300' : 'bg-[#FFC439] hover:bg-[#f5c638]'} text-black font-bold px-4 rounded transition-colors ${isMobile ? 'text-sm py-1.5' : 'py-2'}`}
    >
      {hasError ? (
        <div className="flex items-center justify-center">
          <AlertTriangle size={16} className="mr-2 text-amber-700" />
          <span>Erneut versuchen</span>
        </div>
      ) : (
        <span>Mit PayPal bezahlen</span>
      )}
    </button>
  );
};

export default PayPalButton;
