
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface ContentTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const contentTypeOptions: SelectOption[] = [
  { value: 'liebe', label: 'Love' },
  { value: 'freundschaft', label: 'Friendship' },
  { value: 'natur', label: 'Nature' },
  { value: 'leben', label: 'Life' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'humor', label: 'Humor' },
  { value: 'trauer', label: 'Grief' }
];

const ContentTypeField: React.FC<ContentTypeFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="contentType"
      label="Theme"
      options={contentTypeOptions}
    />
  );
};

export default ContentTypeField;
