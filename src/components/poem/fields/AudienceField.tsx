
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface AudienceFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const AudienceField: React.FC<AudienceFieldProps> = ({ form }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const audienceOptions: SelectOption[] = language === 'en' ? [
    { value: 'eltern', label: 'Parents' },
    { value: 'erwachsene', label: 'Adults' },
    { value: 'familie', label: 'Family' },
    { value: 'freunde', label: 'Friends' },
    { value: 'kinder', label: 'Children' },
    { value: 'kollegen', label: 'Colleagues' },
    { value: 'partner', label: 'Partner' }
  ] : [
    { value: 'eltern', label: 'Eltern' },
    { value: 'erwachsene', label: 'Erwachsene' },
    { value: 'familie', label: 'Familie' },
    { value: 'freunde', label: 'Freunde' },
    { value: 'kinder', label: 'Kinder' },
    { value: 'kollegen', label: 'Kollegen' },
    { value: 'partner', label: 'Partner/in' }
  ];

  return (
    <SelectField
      form={form}
      name="audience"
      label={t('generator.audience')}
      options={audienceOptions}
    />
  );
};

export default AudienceField;
