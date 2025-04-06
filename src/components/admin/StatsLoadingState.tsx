
import React from 'react';
import { useTranslations } from '@/hooks/use-translations';

const StatsLoadingState = () => {
  const { t } = useTranslations();
  
  return (
    <div className="w-full p-8 text-center">
      <p>{t('admin.statsSection.loading')}</p>
    </div>
  );
};

export default StatsLoadingState;
