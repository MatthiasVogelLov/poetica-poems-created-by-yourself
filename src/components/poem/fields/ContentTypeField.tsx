
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface ContentTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const ContentTypeField: React.FC<ContentTypeFieldProps> = ({ form }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const contentTypeOptions: SelectOption[] = language === 'en' ? [
    { value: 'liebe', label: 'Love' },
    { value: 'freundschaft', label: 'Friendship' },
    { value: 'natur', label: 'Nature' },
    { value: 'leben', label: 'Life' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'humor', label: 'Humor' },
    { value: 'trauer', label: 'Grief' }
  ] : [
    { value: 'liebe', label: 'Liebe' },
    { value: 'freundschaft', label: 'Freundschaft' },
    { value: 'natur', label: 'Natur' },
    { value: 'leben', label: 'Leben' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'humor', label: 'Humor' },
    { value: 'trauer', label: 'Trauer' }
  ];

  return (
    <SelectField
      form={form}
      name="contentType"
      label={t('generator.contentType')}
      options={contentTypeOptions}
    />
  );
};

export default ContentTypeField;
