
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import ContentTypeField from '../fields/ContentTypeField';
import VerseTypeField from '../fields/VerseTypeField';

interface MiddleFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const MiddleFieldGroup: React.FC<MiddleFieldGroupProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ContentTypeField form={form} />
      <VerseTypeField form={form} />
    </div>
  );
};

export default MiddleFieldGroup;
