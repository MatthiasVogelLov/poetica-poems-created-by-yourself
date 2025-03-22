
import { NavigateFunction } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PaymentProvider } from './types';

/**
 * Hook for handling admin payment bypass
 */
export const useAdminBypass = () => {
  const { toast } = useToast();
  
  /**
   * Checks if admin bypass should be activated
   */
  const isAdminLoggedIn = (): boolean => {
    return localStorage.getItem('admin_authenticated') === 'true';
  };
  
  /**
   * Processes the admin bypass for payments
   */
  const handleAdminBypass = (
    navigate: NavigateFunction, 
    currentPath: string, 
    provider: PaymentProvider,
    locationState: any
  ) => {
    console.log('Admin payment bypass activated');
    
    toast({
      title: "Admin-Bypass aktiviert",
      description: "Als Administrator können Sie das vollständige Gedicht ohne Zahlung ansehen.",
    });
    
    // Create URL with paid parameter and payment provider for consistency in analytics
    const paidUrl = `${currentPath}?paid=true&payment_provider=${provider}`;
    
    // Redirect to the same page with paid=true
    navigate(paidUrl, { 
      state: locationState,
      replace: true 
    });
    
    return true;
  };
  
  return {
    isAdminLoggedIn,
    handleAdminBypass
  };
};
