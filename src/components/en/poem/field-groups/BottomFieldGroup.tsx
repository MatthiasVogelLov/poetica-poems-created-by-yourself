
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import KeywordsField from '@/components/poem/fields/KeywordsField';

interface BottomFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const BottomFieldGroup: React.FC<BottomFieldGroupProps> = ({ form }) => {
  return (
    <div>
      <KeywordsField form={form} />
    </div>
  );
};

export default BottomFieldGroup;
