
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';
import PaymentError from './PaymentError';
import PayPalFooter from './paypal/PayPalFooter';
import { Badge } from '@/components/ui/badge';

interface BlurredContentCardProps {
  isLoading: boolean;
  error: string | null;
  onPaymentClick: (provider: 'stripe' | 'paypal') => Promise<void>;
}

const BlurredContentCard: React.FC<BlurredContentCardProps> = ({ isLoading, error, onPaymentClick }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  // Payment provider buttons
  const renderPaymentButtons = () => {
    return (
      <div className="flex flex-col gap-3 w-full">
        <Button 
          onClick={() => onPaymentClick('stripe')} 
          className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white/100 animate-spin"></div>
              <span>{language === 'en' ? 'Processing...' : 'Verarbeitung...'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LockIcon size={15} />
              <span>{language === 'en' ? 'Unlock with Credit Card' : 'Mit Kreditkarte freischalten'}</span>
            </div>
          )}
        </Button>
      </div>
    );
  };

  return (
    <Card className="relative w-full bg-white/95 shadow-xl rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-medium mb-2">
            {language === 'en' 
              ? 'Unlock the Complete Poem' 
              : 'Vollständiges Gedicht freischalten'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {language === 'en'
              ? 'Receive the complete poem to save, print, or share with others.'
              : 'Erhalten Sie das vollständige Gedicht zum Speichern, Drucken oder Teilen mit anderen.'}
          </p>
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="px-3 py-1 text-sm bg-gradient-to-r from-orange-100 to-yellow-100 border-yellow-200">
              €1.29
            </Badge>
          </div>
        </div>

        {error ? <PaymentError error={error} /> : renderPaymentButtons()}
        
        <PayPalFooter isLoading={isLoading} onPayPalClick={() => onPaymentClick('paypal')} />
      </CardContent>
    </Card>
  );
};

export default BlurredContentCard;
