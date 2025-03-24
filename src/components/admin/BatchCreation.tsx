
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateForm from './batch-creation/TemplateForm';
import ManualForm from './batch-creation/ManualForm';
import BatchPoemsList from './BatchPoemsList';
import { useBatchPoems } from './batch-creation/useBatchPoems';
import { useTemplateGeneration } from './batch-creation/useTemplateGeneration';
import { useManualPoemCreation } from './batch-creation/useManualPoemCreation';
import BatchCreationErrorBoundary from './batch-creation/BatchCreationErrorBoundary';

const BatchCreation = () => {
  const { 
    batchPoems, 
    isLoading, 
    fetchBatchPoems, 
    handleStatusChange,
    publishing 
  } = useBatchPoems();

  const {
    templateData,
    isGenerating,
    handleTemplateChange,
    generateTemplatePoems
  } = useTemplateGeneration(fetchBatchPoems);

  const {
    manualPoemData,
    handleManualChange,
    createManualPoem
  } = useManualPoemCreation(fetchBatchPoems);

  return (
    <div className="space-y-6">
      <BatchCreationErrorBoundary>
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
          publishingState={publishing}
        />
      </BatchCreationErrorBoundary>
    </div>
  );
};

export default BatchCreation;
