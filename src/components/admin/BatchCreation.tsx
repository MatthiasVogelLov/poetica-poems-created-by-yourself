
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import BatchPoemsList from './BatchPoemsList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TemplateForm from './TemplateForm';
import ManualForm from './ManualForm';

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
            
            <TabsContent value="template">
              <TemplateForm 
                templateData={templateData}
                onFieldChange={handleTemplateChange}
                onGenerate={generateTemplatePoems}
                isGenerating={isGenerating}
              />
            </TabsContent>
            
            <TabsContent value="manual">
              <ManualForm 
                poemData={manualPoemData}
                onFieldChange={handleManualChange}
                onSubmit={createManualPoem}
              />
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
