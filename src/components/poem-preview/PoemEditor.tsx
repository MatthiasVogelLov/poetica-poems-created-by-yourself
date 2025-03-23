
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, X } from "lucide-react";

interface PoemEditorProps {
  initialPoem: string;
  onSave: (updatedPoem: string) => void;
  onCancel: () => void;
}

const PoemEditor: React.FC<PoemEditorProps> = ({ 
  initialPoem, 
  onSave, 
  onCancel 
}) => {
  const [editedPoem, setEditedPoem] = useState(initialPoem);
  
  // Reset the editor content when the initial poem changes
  useEffect(() => {
    setEditedPoem(initialPoem);
  }, [initialPoem]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPoem(e.target.value);
  };

  const handleSave = () => {
    onSave(editedPoem);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-primary gap-1">
          <PenLine size={18} />
          <span className="font-medium">Gedicht bearbeiten</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
          >
            <X size={16} className="mr-1" />
            Abbrechen
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
          >
            <Save size={16} className="mr-1" />
            Speichern
          </Button>
        </div>
      </div>
      <Textarea
        value={editedPoem}
        onChange={handleChange}
        className="min-h-[300px] font-serif whitespace-pre-line bg-gray-50"
        placeholder="Gedicht bearbeiten..."
      />
    </div>
  );
};

export default PoemEditor;
