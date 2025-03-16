import React, { useState } from 'react';
import { LockIcon, CreditCard, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlurredContentProps {
  children: React.ReactNode;
}

const BlurredContent = ({ children }: BlurredContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const handlePaymentClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the current URL and poem title
      const currentPath = location.pathname;
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}${currentPath}?paid=true`;
      const cancelUrl = `${baseUrl}${currentPath}`;
      
      // Get the poem title and form data from the state if available
      const poemTitle = location.state?.generatedPoem?.title || 'Personalisiertes Gedicht';
      const poem = location.state?.generatedPoem?.poem || '';
      
      // Make a deep copy of all form data to avoid any reference issues
      const formData = {
        audience: location.state?.formData?.audience || '',
        occasion: location.state?.formData?.occasion || '',
        contentType: location.state?.formData?.contentType || '',
        style: location.state?.formData?.style || '',
        length: location.state?.formData?.length || '',
        keywords: location.state?.formData?.keywords || '',
        poem: poem
      };
      
      console.log('Payment process started', { 
        successUrl, 
        cancelUrl, 
        poemTitle,
        currentPath,
        origin: window.location.origin,
        poemLength: poem?.length || 0
      });
      
      // Make sure to store poem data in localStorage BEFORE redirecting
      if (poemTitle && poem) {
        const poemData = {
          title: poemTitle,
          poem: poem,
          timestamp: new Date().toISOString() // Add timestamp for debugging
        };
        
        try {
          // Store in localStorage with clear key name
          localStorage.setItem('currentPoemData', JSON.stringify(poemData));
          console.log('Saved poem data to localStorage before payment redirect:', poemData);
          
          // Also store in sessionStorage as a backup
          sessionStorage.setItem('currentPoemData', JSON.stringify(poemData));
          console.log('Backup saved to sessionStorage');
          
          // Also store with a timestamp in the key to keep multiple versions
          const backupKey = 'poemData_' + new Date().getTime();
          localStorage.setItem(backupKey, JSON.stringify(poemData));
          console.log('Additional backup saved with key:', backupKey);
          
          // Verify storage worked
          const verifyData = localStorage.getItem('currentPoemData');
          if (!verifyData) {
            console.warn('WARNING: Verification failed - could not read back poem data from localStorage');
          }
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          // Continue anyway, as Stripe might still work
        }
      } else {
        console.warn('Missing poem data before payment redirect');
      }
      
      // Call our Supabase edge function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productId: 'prod_Rx5lv8pz727AjU', // The product ID from Stripe
          successUrl,
          cancelUrl,
          poemTitle,
          formData
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Fehler bei der Verbindung mit dem Zahlungsdienstleister');
      }
      
      if (!data) {
        console.error('No data returned from checkout function');
        throw new Error('Keine Rückmeldung vom Zahlungsdienstleister erhalten');
      }
      
      console.log('Checkout session created:', data);
      
      // Last chance to verify localStorage before redirect
      try {
        const finalCheck = localStorage.getItem('currentPoemData');
        console.log('Final localStorage check before redirect:', 
          finalCheck ? 'Data found' : 'NO DATA FOUND', 
          finalCheck ? JSON.parse(finalCheck).title : ''
        );
      } catch (e) {
        console.error('Error in final localStorage check:', e);
      }
      
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
      setError(error.message || 'Bei der Zahlungsabwicklung ist ein Fehler aufgetreten');
      
      toast({
        title: "Fehler",
        description: error.message || "Bei der Zahlungsabwicklung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden" style={{ maxHeight: '150px' }}>
        <div className="blur-[5px] opacity-60 pointer-events-none">
          {children}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/90" />
      </div>
      
      <div className="text-center max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6 glass-card rounded-xl animate-fade-in mt-2">
        <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <LockIcon className="text-primary" size={20} />
        </div>
        <h3 className="text-xl font-medium mb-2">Vollständiges Gedicht freischalten</h3>
        <p className="text-muted-foreground mb-6">
          Für nur 0,99 € können Sie das vollständige Gedicht freischalten und herunterladen.
        </p>
        
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-start">
            <AlertTriangle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <Button 
          onClick={handlePaymentClick}
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
      </div>
    </div>
  );
};

export default BlurredContent;
