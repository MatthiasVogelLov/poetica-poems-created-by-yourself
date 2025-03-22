
import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type PaymentProvider = 'stripe' | 'paypal' | null;

export const usePaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if returning from PayPal with a token
  const paymentProvider = searchParams.get('payment_provider') as PaymentProvider;
  const paypalOrderId = searchParams.get('token');
  
  // Function to handle PayPal payment verification
  const verifyPayPalPayment = async (orderId: string) => {
    try {
      console.log('Verifying PayPal payment for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('verify-paypal-payment', {
        body: { orderId }
      });
      
      if (error) {
        console.error('Error verifying PayPal payment:', error);
        throw new Error(error.message || 'Fehler bei der Verifizierung der PayPal-Zahlung');
      }
      
      if (!data.verified) {
        console.error('PayPal payment not verified, status:', data.status);
        throw new Error(`PayPal-Zahlung konnte nicht verifiziert werden (Status: ${data.status})`);
      }
      
      console.log('PayPal payment verified successfully:', data);
      return true;
    } catch (error) {
      console.error('PayPal verification error:', error);
      toast({
        title: "Fehler bei der Zahlung",
        description: error.message || "Die PayPal-Zahlung konnte nicht verifiziert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Check for PayPal return on component mount
  const checkPayPalReturn = async () => {
    if (paymentProvider === 'paypal' && paypalOrderId) {
      setIsLoading(true);
      const verified = await verifyPayPalPayment(paypalOrderId);
      
      if (verified) {
        // Create URL with paid parameter
        const currentPath = location.pathname;
        const paidUrl = `${currentPath}?paid=true`;
        
        // Redirect to the same page with paid=true
        navigate(paidUrl, { 
          state: location.state,
          replace: true 
        });
      }
      
      setIsLoading(false);
    }
  };
  
  const handlePaymentClick = async (provider: PaymentProvider = 'stripe') => {
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
        
        // Create URL with paid parameter and payment provider for consistency in analytics
        const currentPath = location.pathname;
        const paidUrl = `${currentPath}?paid=true&payment_provider=${provider}`;
        
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
      
      console.log(`Payment process started with ${provider}`, { 
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
          // Continue anyway, as payment might still work
        }
      } else {
        console.warn('Missing poem data before payment redirect');
      }
      
      // Call the appropriate payment function based on provider
      if (provider === 'paypal') {
        // Call our Supabase edge function to create a PayPal checkout
        const { data, error } = await supabase.functions.invoke('create-paypal-checkout', {
          body: {
            successUrl,
            cancelUrl,
            poemTitle,
            formData
          }
        });
        
        if (error) {
          console.error('Supabase function error (PayPal):', error);
          throw new Error(error.message || 'Fehler bei der Verbindung mit PayPal');
        }
        
        if (!data) {
          console.error('No data returned from PayPal checkout function');
          throw new Error('Keine Rückmeldung von PayPal erhalten');
        }
        
        console.log('PayPal checkout created:', data);
        
        // Last chance to verify localStorage before redirect
        try {
          const finalCheck = localStorage.getItem('currentPoemData');
          console.log('Final localStorage check before PayPal redirect:', 
            finalCheck ? 'Data found' : 'NO DATA FOUND', 
            finalCheck ? JSON.parse(finalCheck).title : ''
          );
        } catch (e) {
          console.error('Error in final localStorage check:', e);
        }
        
        // Track payment attempt in our stats
        try {
          const poemId = data.poemId || null;
          if (poemId) {
            await supabase.functions.invoke('track-stats', {
              body: {
                action: 'payment_started',
                data: { poemId, provider: 'paypal' }
              }
            });
          }
        } catch (trackError) {
          // Don't stop the payment flow if tracking fails
          console.error('Error tracking PayPal payment attempt:', trackError);
        }
        
        // Redirect to PayPal checkout
        if (data?.url) {
          console.log('Redirecting to PayPal:', data.url);
          window.location.href = data.url;
        } else {
          console.error('No PayPal checkout URL received', data);
          throw new Error('Keine PayPal Checkout-URL erhalten');
        }
      } else {
        // Default to Stripe
        // Call our Supabase edge function to create a Stripe checkout session
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
          console.error('Supabase function error (Stripe):', error);
          throw new Error(error.message || 'Fehler bei der Verbindung mit dem Zahlungsdienstleister');
        }
        
        if (!data) {
          console.error('No data returned from Stripe checkout function');
          throw new Error('Keine Rückmeldung vom Zahlungsdienstleister erhalten');
        }
        
        console.log('Stripe checkout session created:', data);
        
        // Last chance to verify localStorage before redirect
        try {
          const finalCheck = localStorage.getItem('currentPoemData');
          console.log('Final localStorage check before Stripe redirect:', 
            finalCheck ? 'Data found' : 'NO DATA FOUND', 
            finalCheck ? JSON.parse(finalCheck).title : ''
          );
        } catch (e) {
          console.error('Error in final localStorage check:', e);
        }
        
        // Track payment attempt in our stats
        try {
          const poemId = data.poemId || null;
          if (poemId) {
            await supabase.functions.invoke('track-stats', {
              body: {
                action: 'payment_started',
                data: { poemId, provider: 'stripe' }
              }
            });
          }
        } catch (trackError) {
          // Don't stop the payment flow if tracking fails
          console.error('Error tracking Stripe payment attempt:', trackError);
        }
        
        // Redirect to Stripe checkout
        if (data?.url) {
          console.log('Redirecting to Stripe:', data.url);
          window.location.href = data.url;
        } else {
          console.error('No Stripe checkout URL received', data);
          throw new Error('Keine Checkout-URL erhalten');
        }
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

  return { 
    isLoading, 
    error, 
    handlePaymentClick,
    checkPayPalReturn,
    paymentProvider,
    paypalOrderId
  };
};
