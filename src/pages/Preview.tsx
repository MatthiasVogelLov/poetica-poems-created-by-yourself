
import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import PoemPreview from '../components/PoemPreview';
import { usePoemLoader } from '@/hooks/use-poem-loader';
import PreviewHeader from '@/components/preview/PreviewHeader';
import LoadingIndicator from '@/components/preview/LoadingIndicator';
import PreviewFooter from '@/components/preview/PreviewFooter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPaid = searchParams.get('paid') === 'true';
  const paymentProvider = searchParams.get('payment_provider');
  const transactionId = searchParams.get('tx');
  const fromCache = location.state?.fromCache;
  
  useEffect(() => {
    console.log('Preview page loaded with payment status:', isPaid ? 'PAID' : 'NOT PAID');
    console.log('Payment provider:', paymentProvider || 'none');
    console.log('Transaction ID:', transactionId || 'none');
    console.log('From cache:', fromCache ? 'YES' : 'NO');
    
    try {
      const poemData = localStorage.getItem('currentPoemData');
      console.log('LocalStorage poem data check:', 
        poemData ? 'FOUND' : 'NOT FOUND',
        poemData ? JSON.parse(poemData).title : ''
      );
    } catch (e) {
      console.error('Error checking localStorage:', e);
    }
    
    if (fromCache && !isPaid) {
      toast.success("Gedicht aus dem Cache geladen", {
        description: "Ein passendes Gedicht wurde schnell aus dem Zwischenspeicher geladen."
      });
    }
    
    if (isPaid && (paymentProvider || transactionId)) {
      const provider = paymentProvider === 'paypal' || transactionId ? 'PayPal' : 'Kreditkarte';
      toast.success(`Zahlung erfolgreich (${provider})`, {
        description: "Vielen Dank für Ihren Kauf! Das vollständige Gedicht wurde freigeschaltet."
      });
      
      if (!isPaid && transactionId) {
        navigate('/preview?paid=true&payment_provider=paypal&tx=' + transactionId, { 
          state: location.state,
          replace: true 
        });
      }
    }
  }, [isPaid, paymentProvider, transactionId, location.state, navigate, fromCache]);
  
  const { poemTitle, poemContent, isGenerating } = usePoemLoader(
    isPaid || !!transactionId, 
    location.state, 
    navigate
  );
  
  const goBack = () => {
    navigate('/generator');
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-16 sm:pt-20 pb-10 sm:pb-20">
        <div className="container-narrow px-4 sm:px-8">
          <div className="mb-4 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zum Generator
            </Button>
            
            {fromCache && (
              <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                Schnell geladen aus dem Cache
              </div>
            )}
          </div>
          
          <PreviewHeader isPaid={isPaid || !!transactionId} onBackClick={goBack} />
          
          {isGenerating ? (
            <LoadingIndicator />
          ) : (
            <PoemPreview 
              title={poemTitle || 'Personalisiertes Gedicht'} 
              poem={poemContent || ''} 
              isPaid={isPaid || !!transactionId} 
            />
          )}
        </div>
      </div>
      
      <PreviewFooter />
    </div>
  );
};

export default Preview;
