
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import AudienceField from '../fields/AudienceField';
import OccasionField from '../fields/OccasionField';

interface TopFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const TopFieldGroup: React.FC<TopFieldGroupProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AudienceField form={form} />
      <OccasionField form={form} />
    </div>
  );
};

export default TopFieldGroup;
