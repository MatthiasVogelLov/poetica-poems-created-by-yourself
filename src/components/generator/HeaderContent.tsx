
import React from 'react';
import { useTranslations } from '@/hooks/use-translations';

const HeaderContent = () => {
  const { t } = useTranslations();
  
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="heading-lg mb-6 animate-slide-up">
        {t('generator.title')}
      </h1>
      <p 
        className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" 
        style={{ animationDelay: '100ms' }}
      >
        {t('generator.subtitle')}
      </p>
    </div>
  );
};

export default HeaderContent;
