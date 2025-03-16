
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

interface OccasionFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const OccasionField: React.FC<OccasionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="occasion"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium mb-2">Anlass</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            required
          >
            <FormControl>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Anlass auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="geburtstag">Geburtstag</SelectItem>
              <SelectItem value="hochzeit">Hochzeit</SelectItem>
              <SelectItem value="jubilaeum">Jubiläum</SelectItem>
              <SelectItem value="trauerfall">Trauerfall</SelectItem>
              <SelectItem value="weihnachten">Weihnachten</SelectItem>
              <SelectItem value="valentinstag">Valentinstag</SelectItem>
              <SelectItem value="andere">Andere</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OccasionField;
