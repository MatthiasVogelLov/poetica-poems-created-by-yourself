
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePaymentClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user is admin - if so, bypass payment
      const isAdminLoggedIn = localStorage.getItem('admin_authenticated') === 'true';
      
      if (isAdminLoggedIn) {
        // Admin bypass - show success toast and redirect with paid=true parameter
        console.log('Admin payment bypass activated');
        toast({
          title: "Admin-Bypass aktiviert",
          description: "Als Administrator können Sie das vollständige Gedicht ohne Zahlung ansehen.",
        });
        
        // Create URL with paid parameter
        const currentPath = location.pathname;
        const paidUrl = `${currentPath}?paid=true`;
        
        // Redirect to the same page with paid=true
        navigate(paidUrl, { 
          state: location.state,
          replace: true 
        });
        
        setIsLoading(false);
        return;
      }
      
      // Regular payment flow for non-admin users
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

  return { isLoading, error, handlePaymentClick };
};
