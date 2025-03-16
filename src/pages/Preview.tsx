
import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import PoemPreview from '../components/PoemPreview';
import { usePoemLoader } from '@/hooks/use-poem-loader';
import PreviewHeader from '@/components/preview/PreviewHeader';
import LoadingIndicator from '@/components/preview/LoadingIndicator';
import PreviewFooter from '@/components/preview/PreviewFooter';
import { toast } from "sonner";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPaid = searchParams.get('paid') === 'true';
  
  // Add debugging to check payment status and localStorage on page load
  useEffect(() => {
    console.log('Preview page loaded with payment status:', isPaid ? 'PAID' : 'NOT PAID');
    
    // Check localStorage for poem data
    try {
      const poemData = localStorage.getItem('currentPoemData');
      console.log('LocalStorage poem data check:', 
        poemData ? 'FOUND' : 'NOT FOUND',
        poemData ? JSON.parse(poemData).title : ''
      );
    } catch (e) {
      console.error('Error checking localStorage:', e);
    }
    
    // Show toast message if coming back from payment
    if (isPaid) {
      toast.success("Zahlung erfolgreich", {
        description: "Wenn Ihr Gedicht nicht angezeigt wird, laden Sie bitte die Seite neu."
      });
    }
  }, [isPaid]);
  
  // Use our custom hook to handle poem loading
  const { poemTitle, poemContent, isGenerating } = usePoemLoader(
    isPaid, 
    location.state, 
    navigate
  );
  
  const goBack = () => {
    navigate('/generator');
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Reduced top padding to make poem more visible */}
      <div className="pt-16 sm:pt-20 pb-10 sm:pb-20">
        <div className="container-narrow px-4 sm:px-8">
          <PreviewHeader isPaid={isPaid} onBackClick={goBack} />
          
          {isGenerating ? (
            <LoadingIndicator />
          ) : (
            <PoemPreview 
              title={poemTitle || 'Personalisiertes Gedicht'} 
              poem={poemContent || ''} 
              isPaid={isPaid} 
            />
          )}
        </div>
      </div>
      
      <PreviewFooter />
    </div>
  );
};

export default Preview;
