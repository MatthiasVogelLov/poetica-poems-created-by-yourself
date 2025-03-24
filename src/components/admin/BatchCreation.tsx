
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, FileUp, Wand2 } from 'lucide-react';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import BatchPoemsList from './BatchPoemsList';
import { supabase } from '@/integrations/supabase/client';
import { SelectField } from '@/components/poem/fields/SelectField';
import { toast } from 'sonner';

const BatchCreation = () => {
  const { toast: hookToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchPoems, setBatchPoems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for template-based generation
  const [templateData, setTemplateData] = useState({
    count: 5,
    audience: 'erwachsene' as Audience,
    occasion: 'geburtstag' as Occasion,
    contentType: 'liebe' as ContentType,
    style: 'klassisch' as Style,
    verseType: 'kreuzreim' as VerseType,
    length: 'mittel' as Length,
    keywords: ''
  });

  // State for the manual creation form
  const [manualPoemData, setManualPoemData] = useState({
    title: '',
    content: '',
    occasion: 'geburtstag' as Occasion,
    contentType: 'liebe' as ContentType
  });

  // Fetch batch poems on component mount
  useEffect(() => {
    fetchBatchPoems();
  }, []);

  const fetchBatchPoems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_poems')
        .select('*')
        .eq('batch_created', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBatchPoems(data || []);
    } catch (error) {
      console.error('Error fetching batch poems:', error);
      toast.error('Fehler beim Laden der Batch-Gedichte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (field: string, value: any) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualChange = (field: string, value: any) => {
    setManualPoemData(prev => ({ ...prev, [field]: value }));
  };

  const generateTemplatePoems = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an API that generates the poems
      // For now, we'll simulate creating a few poems based on the template
      
      for (let i = 0; i < templateData.count; i++) {
        const { data, error } = await supabase
          .from('user_poems')
          .insert({
            title: `Template Poem ${i + 1} - ${templateData.occasion}`,
            content: `This is a simulated poem based on template.\nKeywords: ${templateData.keywords}\nStyle: ${templateData.style}`,
            occasion: templateData.occasion,
            content_type: templateData.contentType,
            style: templateData.style,
            verse_type: templateData.verseType,
            length: templateData.length,
            batch_created: true,
            status: 'draft'
          })
          .select('*')
          .single();
          
        if (error) throw error;
      }
      
      toast.success(`${templateData.count} Gedichte wurden erstellt`);
      fetchBatchPoems();
    } catch (error) {
      console.error('Error generating poems:', error);
      toast.error('Fehler bei der Gedichterstellung');
    } finally {
      setIsGenerating(false);
    }
  };

  const createManualPoem = async () => {
    if (!manualPoemData.title || !manualPoemData.content) {
      toast.error('Bitte Titel und Inhalt eingeben');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_poems')
        .insert({
          title: manualPoemData.title,
          content: manualPoemData.content,
          occasion: manualPoemData.occasion,
          content_type: manualPoemData.contentType,
          batch_created: true,
          status: 'draft'
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      toast.success('Gedicht wurde erstellt');
      setManualPoemData({
        title: '',
        content: '',
        occasion: 'geburtstag',
        contentType: 'liebe'
      });
      fetchBatchPoems();
    } catch (error) {
      console.error('Error creating poem:', error);
      toast.error('Fehler bei der Gedichterstellung');
    }
  };

  const handleStatusChange = async (poemId: string, newStatus: 'published' | 'deleted') => {
    try {
      const { error } = await supabase
        .from('user_poems')
        .update({ status: newStatus })
        .eq('id', poemId);
        
      if (error) throw error;
      
      // Update local state to reflect the change
      setBatchPoems(prev => 
        prev.map(poem => 
          poem.id === poemId ? { ...poem, status: newStatus } : poem
        )
      );
      
      toast.success(`Gedicht ${newStatus === 'published' ? 'veröffentlicht' : 'gelöscht'}`);
    } catch (error) {
      console.error('Error updating poem status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Gedichterstellung</CardTitle>
          <CardDescription>
            Erstellen Sie mehrere Gedichte auf einmal oder manuell für PoemsLand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="template">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="template">Template-basiert</TabsTrigger>
              <TabsTrigger value="manual">Manuell</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Anzahl der Gedichte</label>
                  <input 
                    type="number" 
                    value={templateData.count} 
                    onChange={(e) => handleTemplateChange('count', parseInt(e.target.value) || 1)}
                    min="1"
                    max="20"
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Schlüsselwörter</label>
                  <input 
                    type="text" 
                    value={templateData.keywords} 
                    onChange={(e) => handleTemplateChange('keywords', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Komma-getrennte Keywords"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                  label="Zielgruppe"
                  options={[
                    { value: 'eltern', label: 'Eltern' },
                    { value: 'erwachsene', label: 'Erwachsene' },
                    { value: 'familie', label: 'Familie' },
                    { value: 'freunde', label: 'Freunde' },
                    { value: 'kinder', label: 'Kinder' },
                    { value: 'kollegen', label: 'Kollegen' },
                    { value: 'partner', label: 'Partner' }
                  ]}
                  value={templateData.audience}
                  onChange={(value) => handleTemplateChange('audience', value)}
                />
                
                <SelectField
                  label="Anlass"
                  options={[
                    { value: 'geburtstag', label: 'Geburtstag' },
                    { value: 'hochzeit', label: 'Hochzeit' },
                    { value: 'jubilaeum', label: 'Jubiläum' },
                    { value: 'valentinstag', label: 'Valentinstag' },
                    { value: 'weihnachten', label: 'Weihnachten' },
                    { value: 'ostern', label: 'Ostern' },
                    { value: 'andere', label: 'Andere' }
                  ]}
                  value={templateData.occasion}
                  onChange={(value) => handleTemplateChange('occasion', value)}
                />
                
                <SelectField
                  label="Thema"
                  options={[
                    { value: 'liebe', label: 'Liebe' },
                    { value: 'freundschaft', label: 'Freundschaft' },
                    { value: 'natur', label: 'Natur' },
                    { value: 'leben', label: 'Leben' },
                    { value: 'motivation', label: 'Motivation' },
                    { value: 'humor', label: 'Humor' },
                    { value: 'trauer', label: 'Trauer' }
                  ]}
                  value={templateData.contentType}
                  onChange={(value) => handleTemplateChange('contentType', value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                  label="Stil"
                  options={[
                    { value: 'klassisch', label: 'Klassisch' },
                    { value: 'modern', label: 'Modern' },
                    { value: 'romantisch', label: 'Romantisch' },
                    { value: 'humorvoll', label: 'Humorvoll' },
                    { value: 'experimentell', label: 'Experimentell' }
                  ]}
                  value={templateData.style}
                  onChange={(value) => handleTemplateChange('style', value)}
                />
                
                <SelectField
                  label="Reimschema"
                  options={[
                    { value: 'frei', label: 'Frei' },
                    { value: 'paarreim', label: 'Paarreim' },
                    { value: 'kreuzreim', label: 'Kreuzreim' },
                    { value: 'umarmenderreim', label: 'Umarmender Reim' }
                  ]}
                  value={templateData.verseType}
                  onChange={(value) => handleTemplateChange('verseType', value)}
                />
                
                <SelectField
                  label="Länge"
                  options={[
                    { value: 'mittel', label: 'Mittel' },
                    { value: 'lang', label: 'Lang' }
                  ]}
                  value={templateData.length}
                  onChange={(value) => handleTemplateChange('length', value)}
                />
              </div>
              
              <Button 
                onClick={generateTemplatePoems} 
                disabled={isGenerating}
                className="w-full mt-6"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generiere Gedichte...' : `${templateData.count} Gedichte generieren`}
              </Button>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Titel</label>
                <input 
                  type="text" 
                  value={manualPoemData.title} 
                  onChange={(e) => handleManualChange('title', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Gedichttitel"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Anlass"
                  options={[
                    { value: 'geburtstag', label: 'Geburtstag' },
                    { value: 'hochzeit', label: 'Hochzeit' },
                    { value: 'jubilaeum', label: 'Jubiläum' },
                    { value: 'valentinstag', label: 'Valentinstag' },
                    { value: 'weihnachten', label: 'Weihnachten' },
                    { value: 'ostern', label: 'Ostern' },
                    { value: 'andere', label: 'Andere' }
                  ]}
                  value={manualPoemData.occasion}
                  onChange={(value) => handleManualChange('occasion', value)}
                />
                
                <SelectField
                  label="Thema"
                  options={[
                    { value: 'liebe', label: 'Liebe' },
                    { value: 'freundschaft', label: 'Freundschaft' },
                    { value: 'natur', label: 'Natur' },
                    { value: 'leben', label: 'Leben' },
                    { value: 'motivation', label: 'Motivation' },
                    { value: 'humor', label: 'Humor' },
                    { value: 'trauer', label: 'Trauer' }
                  ]}
                  value={manualPoemData.contentType}
                  onChange={(value) => handleManualChange('contentType', value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Gedichtinhalt</label>
                <Textarea
                  value={manualPoemData.content}
                  onChange={(e) => handleManualChange('content', e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Geben Sie hier den Inhalt des Gedichts ein..."
                />
              </div>
              
              <Button 
                onClick={createManualPoem}
                className="w-full mt-6"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Gedicht erstellen
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <BatchPoemsList 
        poems={batchPoems} 
        isLoading={isLoading} 
        onStatusChange={handleStatusChange} 
        onRefresh={fetchBatchPoems}
      />
    </div>
  );
};

export default BatchCreation;
