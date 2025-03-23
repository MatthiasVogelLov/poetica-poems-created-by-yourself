
import React from 'react';
import { Button } from "@/components/ui/button";
import { PenLine, Save, X, RefreshCw } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface EditorControlsProps {
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({ 
  onSave, 
  onCancel,
  onReset
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center text-primary gap-1">
        <PenLine size={18} />
        <span className={isMobile ? "sr-only" : "font-medium"}>Gedicht bearbeiten</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          title="Zurücksetzen"
        >
          <RefreshCw size={16} />
          {!isMobile && <span className="ml-1">Zurücksetzen</span>}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          title="Abbrechen"
        >
          <X size={16} />
          {!isMobile && <span className="ml-1">Abbrechen</span>}
        </Button>
        <Button 
          size="sm" 
          onClick={onSave}
          title="Speichern"
        >
          <Save size={16} />
          {!isMobile && <span className="ml-1">Speichern</span>}
        </Button>
      </div>
    </div>
  );
};

export default EditorControls;
