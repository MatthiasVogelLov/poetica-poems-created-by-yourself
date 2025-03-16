
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("impressum");
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState({
    impressum: localStorage.getItem('admin_impressum') || '',
    datenschutz: localStorage.getItem('admin_datenschutz') || '',
    agb: localStorage.getItem('admin_agb') || '',
    kontakt: localStorage.getItem('admin_kontakt') || ''
  });

  const handleTextChange = (section: string, value: string) => {
    setContents(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleSave = (section: string) => {
    setIsLoading(true);
    
    // Save to localStorage (in a real app, this would be a database call)
    localStorage.setItem(`admin_${section}`, contents[section]);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Gespeichert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-lg mb-6 sm:mb-10">Admin-Bereich</h1>
            
            <Tabs defaultValue="impressum" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="impressum">Impressum</TabsTrigger>
                <TabsTrigger value="datenschutz">Datenschutz</TabsTrigger>
                <TabsTrigger value="agb">AGB</TabsTrigger>
                <TabsTrigger value="kontakt">Kontakt</TabsTrigger>
              </TabsList>
              
              {["impressum", "datenschutz", "agb", "kontakt"].map((section) => (
                <TabsContent key={section} value={section} className="focus:outline-none">
                  <div className="p-4 sm:p-6 border rounded-lg">
                    <h2 className="text-xl font-medium mb-4 capitalize">{section}</h2>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Bearbeiten Sie hier den Inhalt für die {section}-Seite. Sie können HTML verwenden.
                    </p>
                    <Textarea 
                      value={contents[section]} 
                      onChange={(e) => handleTextChange(section, e.target.value)}
                      placeholder={`${section} Inhalt hier einfügen...`}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={() => handleSave(section)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Wird gespeichert...' : 'Speichern'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
