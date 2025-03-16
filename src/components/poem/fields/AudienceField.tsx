
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface AudienceFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const audienceOptions: SelectOption[] = [
  { value: 'kinder', label: 'Kinder' },
  { value: 'erwachsene', label: 'Erwachsene' },
  { value: 'partner', label: 'Partner/in' },
  { value: 'familie', label: 'Familie' },
  { value: 'freunde', label: 'Freunde' },
  { value: 'kollegen', label: 'Kollegen' }
];

const AudienceField: React.FC<AudienceFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="audience"
      label="Zielgruppe"
      options={audienceOptions}
    />
  );
};

export default AudienceField;
