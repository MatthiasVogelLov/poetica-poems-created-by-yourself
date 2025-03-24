
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TemplateForm from './batch-creation/TemplateForm';
import ManualForm from './batch-creation/ManualForm';
import BatchPoemsList from './BatchPoemsList';
import { useBatchPoems } from './batch-creation/useBatchPoems';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import { getRandomOption } from './batch-creation/poemUtils';

const BatchCreation = () => {
  const { toast: hookToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state for template-based generation
  const [templateData, setTemplateData] = useState({
    count: 5,
    audience: 'erwachsene' as Audience,
    occasion: 'geburtstag' as Occasion,
    contentType: 'liebe' as ContentType,
    style: 'klassisch' as Style,
    verseType: 'kreuzreim' as VerseType,
    length: 'mittel' as Length,
    keywords: '',
    useRandomOptions: false
  });

  // State for the manual creation form
  const [manualPoemData, setManualPoemData] = useState({
    title: '',
    content: '',
    audience: 'erwachsene' as Audience,
    occasion: 'geburtstag' as Occasion,
    contentType: 'liebe' as ContentType,
    style: 'klassisch' as Style,
    verseType: 'kreuzreim' as VerseType,
    length: 'mittel' as Length,
  });

  const { 
    batchPoems, 
    isLoading, 
    fetchBatchPoems, 
    handleStatusChange 
  } = useBatchPoems();

  const handleTemplateChange = (field, value) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualChange = (field, value) => {
    setManualPoemData(prev => ({ ...prev, [field]: value }));
  };

  const generateTemplatePoems = async () => {
    setIsGenerating(true);
    try {
      for (let i = 0; i < templateData.count; i++) {
        // Use either the selected values or random values based on useRandomOptions
        const audience = templateData.useRandomOptions ? 
          getRandomOption('audience') : templateData.audience;
        const occasion = templateData.useRandomOptions ? 
          getRandomOption('occasion') : templateData.occasion;
        const contentType = templateData.useRandomOptions ? 
          getRandomOption('contentType') : templateData.contentType;
        const style = templateData.useRandomOptions ? 
          getRandomOption('style') : templateData.style;
        const verseType = templateData.useRandomOptions ? 
          getRandomOption('verseType') : templateData.verseType;
        const length = templateData.useRandomOptions ? 
          getRandomOption('length') : templateData.length;

        // Call the generate-poem edge function to create a real poem
        const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
          body: {
            audience: audience,
            occasion: occasion,
            contentType: contentType,
            style: style,
            verseType: verseType,
            length: length,
            keywords: templateData.keywords
          }
        });
        
        if (generationError) {
          console.error('Error generating poem:', generationError);
          throw generationError;
        }
        
        // Save the generated poem to the database
        const { data, error } = await supabase
          .from('user_poems')
          .insert({
            title: generationResult.title || `Gedicht - ${occasion}`,
            content: generationResult.poem,
            occasion: occasion,
            content_type: contentType,
            style: style,
            verse_type: verseType,
            length: length,
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
      toast.error('Fehler bei der Gedichterstellung: ' + (error.message || 'Unbekannter Fehler'));
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
          style: manualPoemData.style,
          verse_type: manualPoemData.verseType,
          length: manualPoemData.length,
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
        audience: 'erwachsene' as Audience,
        occasion: 'geburtstag' as Occasion,
        contentType: 'liebe' as ContentType,
        style: 'klassisch' as Style,
        verseType: 'kreuzreim' as VerseType,
        length: 'mittel' as Length,
      });
      fetchBatchPoems();
    } catch (error) {
      console.error('Error creating poem:', error);
      toast.error('Fehler bei der Gedichterstellung');
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
