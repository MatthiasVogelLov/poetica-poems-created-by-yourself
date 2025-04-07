
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface VerseTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const verseTypeOptions: SelectOption[] = [
  { value: 'frei', label: 'Freie Verse' },
  { value: 'paarreim', label: 'Paarreim (AABB)' },
  { value: 'kreuzreim', label: 'Kreuzreim (ABAB)' },
  { value: 'umarmenderreim', label: 'Umarmender Reim (ABBA)' }
];

const VerseTypeField: React.FC<VerseTypeFieldProps> = ({ form }) => {
  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-medium">Versart</span>
      </div>
      
      <SelectField
        form={form}
        name="verseType"
        label=""
        hideLabel={true}
        options={verseTypeOptions}
        className="w-full"
      />
    </div>
  );
};

export default VerseTypeField;
