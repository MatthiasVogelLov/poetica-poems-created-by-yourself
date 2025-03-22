
import React from 'react';
import { LockIcon } from 'lucide-react';
import PaymentButton from './PaymentButton';
import PaymentError from './PaymentError';
import { PaymentProvider } from './types';

interface BlurredContentCardProps {
  isLoading: boolean;
  error: string | null;
  onPaymentClick: (provider: PaymentProvider) => void;
}

const BlurredContentCard: React.FC<BlurredContentCardProps> = ({ 
  isLoading, 
  error, 
  onPaymentClick 
}) => {
  return (
    <div className="text-center max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6 glass-card rounded-xl animate-fade-in mt-2">
      <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <LockIcon className="text-primary" size={20} />
      </div>
      <h3 className="text-xl font-medium mb-2">Vollständiges Gedicht freischalten</h3>
      <p className="text-muted-foreground mb-6">
        Für nur 1,29 € können Sie das vollständige Gedicht freischalten und herunterladen.
      </p>
      
      <PaymentError error={error} />
      
      <div className="space-y-3">
        <PaymentButton 
          provider="stripe"
          isLoading={isLoading} 
          onClick={() => onPaymentClick('stripe')} 
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Oder
            </span>
          </div>
        </div>
        
        <PaymentButton 
          provider="paypal"
          isLoading={isLoading} 
          onClick={() => onPaymentClick('paypal')} 
        />
      </div>
    </div>
  );
};

export default BlurredContentCard;
