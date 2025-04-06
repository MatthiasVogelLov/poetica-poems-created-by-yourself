
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from '@/components/admin/StatsGrid';
import ContentEditor from '@/components/admin/ContentEditor';
import BatchCreation from '@/components/admin/BatchCreation';
import { useTranslations } from '@/hooks/use-translations';

interface ContentManagementTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ContentManagementTabs: React.FC<ContentManagementTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const { t, language } = useTranslations();
  
  // Get content from localStorage with language-specific key
  const getStoredContent = (section: string) => {
    return localStorage.getItem(`admin_${section}_${language}`) || '';
  };

  // Content sections based on language
  const contentSections = language === 'en' 
    ? ["help", "contact"] 
    : ["hilfe", "kontakt"];

  return (
    <Tabs defaultValue="stats" className="w-full" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="stats">{t('admin.statistics')}</TabsTrigger>
        <TabsTrigger value="batch">{t('admin.batchCreation')}</TabsTrigger>
        {contentSections.map(section => (
          <TabsTrigger key={section} value={section} className="capitalize">
            {section}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="stats" className="focus:outline-none">
        <StatsGrid />
      </TabsContent>
      
      <TabsContent value="batch" className="focus:outline-none">
        <BatchCreation />
      </TabsContent>
      
      {contentSections.map(section => (
        <TabsContent key={section} value={section} className="focus:outline-none">
          <ContentEditor 
            section={section} 
            initialContent={getStoredContent(section)} 
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ContentManagementTabs;
