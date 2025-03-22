
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<PoemFormData>;
  name: keyof PoemFormData;
  label: string;
  options: SelectOption[];
  className?: string;
  hideLabel?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ 
  form, 
  name, 
  label, 
  options,
  className,
  hideLabel = false
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {!hideLabel && (
            <FormLabel className="block text-sm font-medium mb-2">{label}</FormLabel>
          )}
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            required
          >
            <FormControl>
              <SelectTrigger className="form-select w-full">
                <SelectValue placeholder={`${label || name} auswählen`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
