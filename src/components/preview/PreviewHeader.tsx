
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreviewHeaderProps {
  isPaid: boolean;
  onBackClick: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ isPaid, onBackClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="max-w-3xl mx-auto text-center mb-4 sm:mb-6">
      <button onClick={onBackClick} className="btn-ghost mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm sm:text-base">
        <ArrowLeft size={isMobile ? 16 : 20} />
        <span>Zurück zum Generator</span>
      </button>
      
      <span className="subheading mb-2 sm:mb-3 block animate-fade-in text-xs sm:text-sm">
        Ihr Gedicht
      </span>
      <h1 className="heading-lg mb-3 sm:mb-4 animate-slide-up text-2xl sm:text-4xl">
        {isPaid ? 'Ihr Gedicht ist fertig' : 'Vorschau Ihres Gedichts'}
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{
        animationDelay: '100ms'
      }}>
        {isPaid ? 'Hier ist Ihr personalisiertes Gedicht. Sie können es jetzt speichern, drucken oder teilen.' : 'Hier sehen Sie eine Vorschau Ihres personalisierten Gedichts.'}
      </p>
    </div>
  );
};

export default PreviewHeader;
