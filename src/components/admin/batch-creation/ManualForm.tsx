
import React from 'react';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';

// Import section components
import TitleInputSection from './form-sections/TitleInputSection';
import AudienceOccasionSection from './form-sections/AudienceOccasionSection';
import StyleRhymeSection from './form-sections/StyleRhymeSection';
import KeywordsSection from './form-sections/KeywordsSection';
import OptionsSection from './form-sections/OptionsSection';
import PoemContentSection from './form-sections/PoemContentSection';
import SubmitButtonSection from './form-sections/SubmitButtonSection';

interface ManualPoemData {
  title: string;
  content: string;
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords?: string;
  generateContent?: boolean;
  publishAfterCreation?: boolean;
}

interface ManualFormProps {
  poemData: ManualPoemData;
  onFieldChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onGenerateContent?: () => void;
  isGenerating?: boolean;
}

const ManualForm: React.FC<ManualFormProps> = ({
  poemData,
  onFieldChange,
  onSubmit,
  onGenerateContent,
  isGenerating = false
}) => {
  return (
    <div className="space-y-4">
      {/* Title Input */}
      <TitleInputSection 
        title={poemData.title} 
        onTitleChange={(value) => onFieldChange('title', value)} 
      />
      
      {/* Audience, Occasion and Theme Section */}
      <AudienceOccasionSection 
        audience={poemData.audience}
        occasion={poemData.occasion}
        contentType={poemData.contentType}
        onFieldChange={onFieldChange}
      />
      
      {/* Style, Rhyme and Length Section */}
      <StyleRhymeSection 
        style={poemData.style}
        verseType={poemData.verseType}
        length={poemData.length}
        onFieldChange={onFieldChange}
      />
      
      {/* Keywords Section */}
      <KeywordsSection 
        keywords={poemData.keywords || ''}
        onKeywordsChange={(value) => onFieldChange('keywords', value)}
      />
      
      {/* Options Section */}
      <OptionsSection 
        generateContent={!!poemData.generateContent}
        publishAfterCreation={!!poemData.publishAfterCreation}
        onOptionChange={onFieldChange}
      />
      
      {/* Poem Content Section */}
      <PoemContentSection 
        content={poemData.content}
        onContentChange={(value) => onFieldChange('content', value)}
        onGenerateClick={onGenerateContent}
        isGenerating={isGenerating}
        shouldGenerateContent={!!poemData.generateContent}
      />
      
      {/* Submit Button */}
      <SubmitButtonSection 
        onSubmit={onSubmit}
        isGenerating={isGenerating}
        publishAfterCreation={!!poemData.publishAfterCreation}
      />
    </div>
  );
};

export default ManualForm;
