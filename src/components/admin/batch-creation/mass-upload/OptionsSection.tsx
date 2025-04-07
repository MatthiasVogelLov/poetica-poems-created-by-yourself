
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface OptionsSectionProps {
  useRandomOptions: boolean;
  onRandomOptionsChange: (useRandom: boolean) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({ 
  useRandomOptions, 
  onRandomOptionsChange 
}) => {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch
        id="random-options"
        checked={useRandomOptions}
        onCheckedChange={onRandomOptionsChange}
      />
      <Label htmlFor="random-options">Optionen zufällig wählen</Label>
    </div>
  );
};

export default OptionsSection;
