
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface StyleFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const styleOptions: SelectOption[] = [
  { value: 'sonett', label: 'Sonett' },
  { value: 'ballade', label: 'Ballade' },
  { value: 'ode', label: 'Ode' },
  { value: 'hymne', label: 'Hymne' },
  { value: 'epigramm', label: 'Epigramm' },
  { value: 'haiku', label: 'Haiku' },
  { value: 'tanka', label: 'Tanka' },
  { value: 'freieverse', label: 'Freie Verse' },
  { value: 'elfchen', label: 'Elfchen' },
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
