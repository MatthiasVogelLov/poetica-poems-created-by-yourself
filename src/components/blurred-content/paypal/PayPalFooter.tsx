import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PayPalIcon } from './PayPalIcon';

interface PayPalFooterProps {
  isLoading: boolean;
  onPayPalClick: () => void;
}

const PayPalFooter: React.FC<PayPalFooterProps> = ({ isLoading, onPayPalClick }) => {
  const { language } = useLanguage();
  
  return (
    <div className="mt-4">
      <div className="relative flex items-center justify-center mb-4">
        <div className="border-t border-gray-200 flex-grow"></div>
        <span className="px-2 text-xs text-gray-500">
          {language === 'en' ? 'or pay with' : 'oder zahlen mit'}
        </span>
        <div className="border-t border-gray-200 flex-grow"></div>
      </div>
      
      <button
        onClick={onPayPalClick}
        disabled={isLoading}
        className="w-full bg-white hover:bg-gray-50 text-[#003087] font-medium py-2 px-4 border border-gray-300 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div>
            <span className="text-gray-600">
              {language === 'en' ? 'Processing...' : 'Verarbeitung...'}
            </span>
          </div>
        ) : (
          <>
            <PayPalIcon />
            <span>PayPal</span>
          </>
        )}
      </button>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        {language === 'en' 
          ? 'Secure payment processing. No account needed.' 
          : 'Sichere Zahlungsabwicklung. Kein Konto erforderlich.'}
      </div>
    </div>
  );
};

export default PayPalFooter;
