
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface ContentTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const contentTypeOptions: SelectOption[] = [
  { value: 'liebe', label: 'Liebe' },
  { value: 'freundschaft', label: 'Freundschaft' },
  { value: 'natur', label: 'Natur' },
  { value: 'leben', label: 'Leben' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'humor', label: 'Humor' },
  { value: 'trauer', label: 'Trauer' }
];

const ContentTypeField: React.FC<ContentTypeFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="contentType"
      label="Inhalt"
      options={contentTypeOptions}
    />
  );
};

export default ContentTypeField;
