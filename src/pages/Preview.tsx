
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
  
  useEffect(() => {
    console.log('Preview page loaded with payment status:', isPaid ? 'PAID' : 'NOT PAID');
    console.log('Payment provider:', paymentProvider || 'none');
    console.log('Transaction ID:', transactionId || 'none');
    
    try {
      const poemData = localStorage.getItem('currentPoemData');
      console.log('LocalStorage poem data check:', 
        poemData ? 'FOUND' : 'NOT FOUND',
        poemData ? JSON.parse(poemData).title : ''
      );
    } catch (e) {
      console.error('Error checking localStorage:', e);
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
  }, [isPaid, paymentProvider, transactionId, location.state, navigate]);
  
  const { poemTitle, poemContent, isGenerating } = usePoemLoader(
    isPaid || !!transactionId, 
    location.state, 
    navigate
  );
  
  const goBack = () => {
    // When going back to generator, include state to indicate we're returning from preview
    navigate('/generator', { 
      state: { 
        returnFromPreview: true 
      } 
    });
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
