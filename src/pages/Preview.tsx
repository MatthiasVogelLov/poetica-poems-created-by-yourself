
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
import { supabase } from "@/integrations/supabase/client";

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
  
  // Store newly generated poem to the database when it's fully unlocked
  useEffect(() => {
    const savePoemToDatabase = async () => {
      if ((isPaid || !!transactionId) && 
          poemContent && 
          poemTitle && 
          location.state?.formData && 
          !isGenerating) {
        try {
          console.log('Saving poem to database:', poemTitle);
          
          // Save poem to user_poems table
          const { error } = await supabase
            .from('user_poems')
            .insert([
              {
                title: poemTitle,
                content: poemContent,
                occasion: location.state.formData.occasion,
                content_type: location.state.formData.contentType,
                style: location.state.formData.style,
                verse_type: location.state.formData.verseType,
                length: location.state.formData.length,
              }
            ]);
            
          if (error) {
            console.error('Error saving poem to database:', error);
            return;
          }
          
          toast.success('Gedicht wurde in PoemsLand gespeichert', {
            description: 'Sie können es jederzeit in PoemsLand ansehen.',
            duration: 5000,
          });
          
        } catch (error) {
          console.error('Failed to save poem to database:', error);
        }
      }
    };
    
    savePoemToDatabase();
  }, [isPaid, transactionId, poemContent, poemTitle, location.state, isGenerating]);

  const goBack = () => {
    // When going back to generator, include state to indicate we're returning from preview
    navigate('/generator', { 
      state: { 
        returnFromPreview: true,
        formData: location.state?.formData // Pass the original form data back
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
