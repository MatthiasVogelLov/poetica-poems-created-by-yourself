
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface VerseTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const verseTypeOptions: SelectOption[] = [
  { value: 'frei', label: 'Free Verse' },
  { value: 'paarreim', label: 'Couplet (AABB)' },
  { value: 'kreuzreim', label: 'Alternating Rhyme (ABAB)' },
  { value: 'umarmenderreim', label: 'Enclosed Rhyme (ABBA)' }
];

const VerseTypeField: React.FC<VerseTypeFieldProps> = ({ form }) => {
  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-medium">Verse Type</span>
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
