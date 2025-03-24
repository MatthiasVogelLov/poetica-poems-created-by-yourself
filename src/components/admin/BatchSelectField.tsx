
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface SelectOption {
  value: string;
  label: string;
}

interface BatchSelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const BatchSelectField: React.FC<BatchSelectFieldProps> = ({ 
  label, 
  options,
  value,
  onChange,
  className
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <Select 
        onValueChange={onChange} 
        value={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`${label} auswählen`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BatchSelectField;
