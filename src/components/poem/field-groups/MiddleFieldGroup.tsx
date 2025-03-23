
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import ContentTypeField from '../fields/ContentTypeField';
import StyleField from '../fields/StyleField';
import VerseTypeField from '../fields/VerseTypeField';
import LengthField from '../fields/LengthField';

interface MiddleFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const MiddleFieldGroup: React.FC<MiddleFieldGroupProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ContentTypeField form={form} />
        <StyleField form={form} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <VerseTypeField form={form} />
        <LengthField form={form} />
      </div>
    </div>
  );
};

export default MiddleFieldGroup;
