
import React, { useState } from 'react';
import { LockIcon, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface BlurredContentProps {
  children: React.ReactNode;
}

const BlurredContent = ({ children }: BlurredContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePaymentClick = async () => {
    setIsLoading(true);
    
    try {
      // Get the current URL and poem title
      const currentPath = location.pathname;
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}${currentPath}?paid=true`;
      const cancelUrl = `${baseUrl}${currentPath}`;
      
      // Get the poem title from the state if available
      const poemTitle = location.state?.generatedPoem?.title || 'Personalisiertes Gedicht';
      
      console.log('Payment process started', { successUrl, cancelUrl, poemTitle });
      
      // Call our Supabase edge function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productId: 'prod_Rx5lv8pz727AjU', // The product ID from Stripe
          successUrl,
          cancelUrl,
          poemTitle
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }
      
      console.log('Checkout session created:', data);
      
      // Redirect to Stripe checkout
      if (data?.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received', data);
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error) {
      console.error('Payment process error:', error);
      toast({
        title: "Fehler",
        description: "Bei der Zahlungsabwicklung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mt-2">
      {/* Container for the blurred content */}
      <div className="relative overflow-hidden" style={{ maxHeight: '200px' }}>
        {/* The actual content that will be blurred */}
        <div className="blur-[5px] opacity-60 pointer-events-none">
          {children}
        </div>
        
        {/* Gradient overlay to fade out the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/90" />
      </div>
      
      {/* Payment call-to-action */}
      <div className="text-center max-w-md mx-auto px-6 py-8 glass-card rounded-xl animate-fade-in mt-4">
        <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <LockIcon className="text-primary" size={20} />
        </div>
        <h3 className="text-xl font-medium mb-2">Vollständiges Gedicht freischalten</h3>
        <p className="text-muted-foreground mb-6">
          Für nur 0,99 € können Sie das vollständige Gedicht freischalten und herunterladen.
        </p>
        <Button 
          onClick={handlePaymentClick}
          disabled={isLoading}
          className="w-full"
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
      </div>
    </div>
  );
};

export default BlurredContent;
