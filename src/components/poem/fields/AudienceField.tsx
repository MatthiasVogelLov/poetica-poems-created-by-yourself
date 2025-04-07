
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface AudienceFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const audienceOptions: SelectOption[] = [
  { value: 'eltern', label: 'Eltern' },
  { value: 'erwachsene', label: 'Erwachsene' },
  { value: 'familie', label: 'Familie' },
  { value: 'freunde', label: 'Freunde' },
  { value: 'kinder', label: 'Kinder' },
  { value: 'kollegen', label: 'Kollegen' },
  { value: 'partner', label: 'Partner/in' }
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
