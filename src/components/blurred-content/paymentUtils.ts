import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentProvider } from './types';
import { Location } from 'react-router-dom';

/**
 * Prepares the payment data from the current state and form data
 */
export const preparePaymentData = (location: Location) => {
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
  
  return {
    successUrl,
    cancelUrl,
    poemTitle,
    poem,
    formData,
    currentPath
  };
};

/**
 * Saves the poem data to localStorage before payment redirect
 */
export const savePoemToLocalStorage = (poemTitle: string, poem: string) => {
  if (!poemTitle || !poem) {
    console.warn('Missing poem data before payment redirect');
    return false;
  }
  
  try {
    const poemData = {
      title: poemTitle,
      poem: poem,
      timestamp: new Date().toISOString() // Add timestamp for debugging
    };
    
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
      return false;
    }
    
    return true;
  } catch (storageError) {
    console.error('Error saving to localStorage:', storageError);
    return false;
  }
};

/**
 * Tracks payment attempts in Supabase
 */
export const trackPaymentAttempt = async (poemId: string, provider: PaymentProvider) => {
  try {
    await supabase.functions.invoke('track-stats', {
      body: {
        action: 'payment_started',
        data: { poemId, provider }
      }
    });
    return true;
  } catch (error) {
    console.error(`Error tracking ${provider} payment attempt:`, error);
    return false;
  }
};

/**
 * Execute Stripe checkout process
 */
export const processStripeCheckout = async (paymentData: any) => {
  const { successUrl, cancelUrl, poemTitle, formData } = paymentData;
  
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
  
  // Track payment attempt if we have a poem ID
  if (data.poemId) {
    await trackPaymentAttempt(data.poemId, 'stripe');
  }
  
  return data;
};

/**
 * Execute PayPal checkout process
 */
export const processPayPalCheckout = async (paymentData: any) => {
  const { successUrl, cancelUrl, poemTitle, formData } = paymentData;
  
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
  
  // Track payment attempt if we have a poem ID
  if (data.poemId) {
    await trackPaymentAttempt(data.poemId, 'paypal');
  }
  
  return data;
};
