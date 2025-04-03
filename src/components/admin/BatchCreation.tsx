
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
import MassUploadForm from './batch-creation/MassUploadForm';
import { useMassUpload } from './batch-creation/useMassUpload';

const BatchCreation = () => {
  const { 
    batchPoems, 
    isLoading, 
    fetchBatchPoems, 
    handleStatusChange,
    publishing,
    hiding,
    page,
    totalCount,
    visibleCount,
    hasMore,
    nextPage,
    prevPage,
    poemsPerPage
  } = useBatchPoems();

  const {
    templateData,
    isGenerating: isGeneratingTemplate,
    handleTemplateChange,
    generateTemplatePoems
  } = useTemplateGeneration(fetchBatchPoems);

  const {
    manualPoemData,
    handleManualChange,
    createManualPoem,
    generatePoemContent,
    isGenerating: isGeneratingManual
  } = useManualPoemCreation(fetchBatchPoems);

  const {
    massUploadData,
    isGenerating: isGeneratingMassUpload,
    handleStyleChange,
    handleVerseTypeChange,
    handleLengthChange,
    handleRandomOptionsChange,
    handlePublishToPoemsLandChange,
    handlePoemEntryChange,
    generateMassUploadPoems
  } = useMassUpload(fetchBatchPoems);

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
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="template">Template-basiert</TabsTrigger>
                <TabsTrigger value="manual">Manuell</TabsTrigger>
                <TabsTrigger value="massupload">Mass Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="template">
                <TemplateForm 
                  templateData={templateData}
                  onFieldChange={handleTemplateChange}
                  onGenerate={generateTemplatePoems}
                  isGenerating={isGeneratingTemplate}
                />
              </TabsContent>
              
              <TabsContent value="manual">
                <ManualForm 
                  poemData={manualPoemData}
                  onFieldChange={handleManualChange}
                  onSubmit={createManualPoem}
                  onGenerateContent={generatePoemContent}
                  isGenerating={isGeneratingManual}
                />
              </TabsContent>

              <TabsContent value="massupload">
                <MassUploadForm 
                  style={massUploadData.style}
                  verseType={massUploadData.verseType}
                  length={massUploadData.length}
                  useRandomOptions={massUploadData.useRandomOptions}
                  publishToPoemsLand={massUploadData.publishToPoemsLand}
                  poemEntries={massUploadData.poemEntries}
                  onStyleChange={handleStyleChange}
                  onVerseTypeChange={handleVerseTypeChange}
                  onLengthChange={handleLengthChange}
                  onRandomOptionsChange={handleRandomOptionsChange}
                  onPublishToPoemsLandChange={handlePublishToPoemsLandChange}
                  onPoemEntryChange={handlePoemEntryChange}
                  onGenerate={generateMassUploadPoems}
                  isGenerating={isGeneratingMassUpload}
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
          hidingState={hiding}
          page={page}
          totalCount={totalCount}
          visibleCount={visibleCount}
          hasMore={hasMore}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          poemsPerPage={poemsPerPage}
        />
      </BatchCreationErrorBoundary>
    </div>
  );
};

export default BatchCreation;
