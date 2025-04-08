
import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from '../components/en/Header';
import PoemPreview from '../components/PoemPreview';
import { usePoemLoader } from '@/hooks/use-poem-loader';
import LoadingIndicator from '@/components/preview/LoadingIndicator';
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
    console.log('English Preview page loaded with payment status:', isPaid ? 'PAID' : 'NOT PAID');
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
      const provider = paymentProvider === 'paypal' || transactionId ? 'PayPal' : 'Credit Card';
      toast.success(`Payment successful (${provider})`, {
        description: "Thank you for your purchase! The complete poem has been unlocked."
      });
      
      if (!isPaid && transactionId) {
        navigate('/en/preview?paid=true&payment_provider=paypal&tx=' + transactionId, { 
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
          console.log('Saving English poem to database:', poemTitle);
          
          // Save poem to user_poems table
          const { error } = await supabase
            .from('en_user_poems')
            .insert([
              {
                title: poemTitle,
                content: poemContent,
                occasion: location.state.formData.occasion,
                content_type: location.state.formData.contentType,
                style: location.state.formData.style,
                verse_type: location.state.formData.verseType,
                length: location.state.formData.length,
                language: 'english'
              }
            ]);
            
          if (error) {
            console.error('Error saving poem to database:', error);
            return;
          }
          
          toast.success('Poem saved in PoemsLand', {
            description: 'You can view it anytime in PoemsLand.',
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
    navigate('/en/generator', { 
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
              Back to Generator
            </Button>
          </div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif mb-4">Your Generated Poem</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isPaid || !!transactionId 
                ? "Here's your complete poem. You can edit, print, or share it with others."
                : "Here's a preview of your poem. Purchase to reveal the complete poem."}
            </p>
          </div>
          
          {isGenerating ? (
            <LoadingIndicator />
          ) : (
            <PoemPreview 
              title={poemTitle || 'Personalized Poem'} 
              poem={poemContent || ''} 
              isPaid={isPaid || !!transactionId} 
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Preview;
