
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface StyleFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const styleOptions: SelectOption[] = [
  { value: 'klassisch', label: 'Klassisch' },
  { value: 'modern', label: 'Modern' },
  { value: 'romantisch', label: 'Romantisch' },
  { value: 'humorvoll', label: 'Humorvoll' },
  { value: 'experimentell', label: 'Experimentell' }
];

const StyleField: React.FC<StyleFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="style"
      label="Stil"
      options={styleOptions}
    />
  );
};

export default StyleField;
