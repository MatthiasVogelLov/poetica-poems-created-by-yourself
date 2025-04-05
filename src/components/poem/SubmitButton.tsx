
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  return (
    <div className="pt-4">
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ease-in-out"
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white/100 animate-spin"></div>
            <span>{language === 'en' ? 'Creating poem...' : 'Gedicht wird erstellt...'}</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>{t('generator.generate')}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
