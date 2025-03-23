
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import PoemFilters from '@/components/poems-land/PoemFilters';
import PoemsList from '@/components/poems-land/PoemsList';
import SinglePoemView from '@/components/poems-land/SinglePoemView';
import { usePoems } from '@/hooks/use-poems';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';

const PoemsLand = () => {
  const {
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    handleDeletePoem,
    clearFilters,
    getUniqueOccasions,
    getUniqueContentTypes
  } = usePoems();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow px-4">
          {selectedPoemId ? (
            // Single poem view
            <SinglePoemView 
              poem={selectedPoem}
              goBack={() => setSelectedPoemId(null)}
              getOccasionDisplay={getOccasionDisplay}
              getContentTypeDisplay={getContentTypeDisplay}
            />
          ) : (
            // Poems list view
            <>
              <h1 className="text-3xl font-serif mb-8 text-center">PoemsLand</h1>
              
              <PoemFilters 
                occasionFilter={occasionFilter}
                contentTypeFilter={contentTypeFilter}
                setOccasionFilter={setOccasionFilter}
                setContentTypeFilter={setContentTypeFilter}
                clearFilters={clearFilters}
                occasions={getUniqueOccasions()}
                contentTypes={getUniqueContentTypes()}
                getOccasionDisplay={getOccasionDisplay}
                getContentTypeDisplay={getContentTypeDisplay}
              />
              
              <PoemsList 
                poems={filteredPoems}
                isLoading={isLoading}
                handleDeletePoem={handleDeletePoem}
                setSelectedPoemId={setSelectedPoemId}
                getOccasionDisplay={getOccasionDisplay}
                getContentTypeDisplay={getContentTypeDisplay}
              />
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PoemsLand;
