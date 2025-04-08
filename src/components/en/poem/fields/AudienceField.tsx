
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface AudienceFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const audienceOptions: SelectOption[] = [
  { value: 'eltern', label: 'Parents' },
  { value: 'erwachsene', label: 'Adults' },
  { value: 'familie', label: 'Family' },
  { value: 'freunde', label: 'Friends' },
  { value: 'kinder', label: 'Children' },
  { value: 'kollegen', label: 'Colleagues' },
  { value: 'partner', label: 'Partner' }
];

const AudienceField: React.FC<AudienceFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="audience"
      label="Audience"
      options={audienceOptions}
    />
  );
};

export default AudienceField;
