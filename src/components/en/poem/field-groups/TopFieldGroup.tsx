
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import OccasionField from '../fields/OccasionField';
import AudienceField from '../fields/AudienceField';

interface TopFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const TopFieldGroup: React.FC<TopFieldGroupProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <OccasionField form={form} />
      <AudienceField form={form} />
    </div>
  );
};

export default TopFieldGroup;
