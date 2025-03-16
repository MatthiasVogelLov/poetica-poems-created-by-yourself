
import React from 'react';
import { LockIcon } from 'lucide-react';
import PaymentButton from './PaymentButton';
import PaymentError from './PaymentError';

interface BlurredContentCardProps {
  isLoading: boolean;
  error: string | null;
  onPaymentClick: () => void;
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
        Für nur 0,99 € können Sie das vollständige Gedicht freischalten und herunterladen.
      </p>
      
      <PaymentError error={error} />
      <PaymentButton isLoading={isLoading} onClick={onPaymentClick} />
    </div>
  );
};

export default BlurredContentCard;
