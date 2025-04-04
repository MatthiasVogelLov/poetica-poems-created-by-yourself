
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/use-translations';

interface ContentEditorProps {
  section: string;
  initialContent: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ section, initialContent }) => {
  const { toast } = useToast();
  const { t, language } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleTextChange = (value: string) => {
    setContent(value);
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Save to localStorage (in a real app, this would be a database call)
    localStorage.setItem(`admin_${section}_${language}`, content);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: language === 'en' ? "Saved" : "Gespeichert",
        description: language === 'en' 
          ? "The changes have been successfully saved." 
          : "Die Änderungen wurden erfolgreich gespeichert.",
      });
    }, 500);
  };

  return (
    <div className="p-4 sm:p-6 border rounded-lg">
      <h2 className="text-xl font-medium mb-4 capitalize">{section}</h2>
      <p className="mb-4 text-muted-foreground text-sm">
        {language === 'en' 
          ? `Edit content for the ${section} page here. You can use HTML.` 
          : `Bearbeiten Sie hier den Inhalt für die ${section}-Seite. Sie können HTML verwenden.`}
      </p>
      <Textarea 
        value={content} 
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={language === 'en' 
          ? `Insert ${section} content here...` 
          : `${section} Inhalt hier einfügen...`}
        className="min-h-[400px] font-mono text-sm"
      />
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading 
            ? (language === 'en' ? 'Saving...' : 'Wird gespeichert...') 
            : (language === 'en' ? 'Save' : 'Speichern')}
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
