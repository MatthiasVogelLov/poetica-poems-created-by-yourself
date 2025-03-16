
import React from 'react';
import { LockIcon, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlurredContentProps {
  children: React.ReactNode;
}

const BlurredContent = ({ children }: BlurredContentProps) => {
  const navigate = useNavigate();
  
  const handlePaymentClick = () => {
    // In a real implementation, this would trigger the payment flow
    // For now, let's simulate a successful payment
    setTimeout(() => {
      // Navigate to the same page with a "paid" query parameter
      const url = new URL(window.location.href);
      url.searchParams.set('paid', 'true');
      window.history.pushState({}, '', url);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="relative mt-8">
      {/* First few lines are visible */}
      <div className="mb-4">
        {children}
      </div>
      
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/90 backdrop-blur-md flex flex-col items-center justify-end pb-10">
        <div className="text-center max-w-md mx-auto px-6 py-8 glass-card rounded-xl animate-fade-in">
          <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <LockIcon className="text-primary" size={20} />
          </div>
          <h3 className="text-xl font-medium mb-2">Vollständiges Gedicht freischalten</h3>
          <p className="text-muted-foreground mb-6">
            Für nur 4,99 € können Sie das vollständige Gedicht freischalten und herunterladen.
          </p>
          <button 
            onClick={handlePaymentClick}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            <span>Jetzt freischalten</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlurredContent;
