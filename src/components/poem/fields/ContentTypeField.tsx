
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

interface ContentTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const ContentTypeField: React.FC<ContentTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="contentType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium mb-2">Inhalt</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            required
          >
            <FormControl>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Inhalt auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="liebe">Liebe</SelectItem>
              <SelectItem value="freundschaft">Freundschaft</SelectItem>
              <SelectItem value="natur">Natur</SelectItem>
              <SelectItem value="leben">Leben</SelectItem>
              <SelectItem value="motivation">Motivation</SelectItem>
              <SelectItem value="humor">Humor</SelectItem>
              <SelectItem value="trauer">Trauer</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ContentTypeField;
