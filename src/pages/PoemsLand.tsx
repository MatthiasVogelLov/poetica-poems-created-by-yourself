
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Heart, X, Filter, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import PoemTitle from '@/components/poem-preview/PoemTitle';
import PoemContent from '@/components/poem-preview/PoemContent';

interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  created_at: string;
}

const PoemsLand = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [occasionFilter, setOccasionFilter] = useState<string>('');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the poems from Supabase
  useEffect(() => {
    const fetchPoems = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPoems(data || []);
        setFilteredPoems(data || []);
      } catch (error) {
        console.error('Error fetching poems:', error);
        toast.error('Fehler beim Laden der Gedichte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let result = [...poems];
    
    if (occasionFilter) {
      result = result.filter(poem => poem.occasion === occasionFilter);
    }
    
    if (contentTypeFilter) {
      result = result.filter(poem => poem.content_type === contentTypeFilter);
    }
    
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter]);

  // Fetch a single poem when selected
  useEffect(() => {
    if (selectedPoemId) {
      const fetchSinglePoem = async () => {
        try {
          const { data, error } = await supabase
            .from('user_poems')
            .select('*')
            .eq('id', selectedPoemId)
            .single();
          
          if (error) throw error;
          
          setSelectedPoem(data);
        } catch (error) {
          console.error('Error fetching poem:', error);
          toast.error('Fehler beim Laden des Gedichts');
        }
      };

      fetchSinglePoem();
    } else {
      setSelectedPoem(null);
    }
  }, [selectedPoemId]);

  const handleDeletePoem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Möchten Sie dieses Gedicht wirklich löschen?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_poems')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPoems(poems.filter(poem => poem.id !== id));
      toast.success('Gedicht wurde gelöscht');
      
      if (selectedPoemId === id) {
        setSelectedPoemId(null);
      }
    } catch (error) {
      console.error('Error deleting poem:', error);
      toast.error('Fehler beim Löschen des Gedichts');
    }
  };

  const clearFilters = () => {
    setOccasionFilter('');
    setContentTypeFilter('');
  };

  const getOccasionDisplay = (occasion: string) => {
    const occasionMap: Record<string, string> = {
      'geburtstag': 'Geburtstag',
      'hochzeit': 'Hochzeit',
      'jubilaeum': 'Jubiläum',
      'valentinstag': 'Valentinstag',
      'trauerfall': 'Trauerfall',
      'weihnachten': 'Weihnachten',
      'ostern': 'Ostern',
      // Add more mappings as needed
    };
    
    return occasionMap[occasion] || occasion;
  };

  const getContentTypeDisplay = (contentType: string) => {
    const contentTypeMap: Record<string, string> = {
      'liebe': 'Liebe',
      'freundschaft': 'Freundschaft',
      'natur': 'Natur',
      'leben': 'Leben',
      'motivation': 'Motivation',
      'humor': 'Humor',
      'trauer': 'Trauer',
      // Add more mappings as needed
    };
    
    return contentTypeMap[contentType] || contentType;
  };

  const getUniqueOccasions = () => {
    const occasions = new Set(poems.map(poem => poem.occasion).filter(Boolean));
    return Array.from(occasions);
  };

  const getUniqueContentTypes = () => {
    const contentTypes = new Set(poems.map(poem => poem.content_type).filter(Boolean));
    return Array.from(contentTypes);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow px-4">
          {selectedPoemId ? (
            // Single poem view
            <div className="animate-fade-in">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedPoemId(null)} 
                className="mb-6"
              >
                <ChevronLeft size={16} className="mr-2" />
                Zurück zu PoemsLand
              </Button>
              
              {selectedPoem ? (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <PoemTitle title={selectedPoem.title} />
                  <PoemContent poem={selectedPoem.content} isPaid={true} />
                  
                  <div className="flex justify-between items-center mt-6 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      {selectedPoem.occasion && (
                        <Badge variant="secondary">{getOccasionDisplay(selectedPoem.occasion)}</Badge>
                      )}
                      {selectedPoem.content_type && (
                        <Badge variant="outline">{getContentTypeDisplay(selectedPoem.content_type)}</Badge>
                      )}
                    </div>
                    <span>
                      {new Date(selectedPoem.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="animate-pulse">Gedicht wird geladen...</div>
                </div>
              )}
            </div>
          ) : (
            // Poems list view
            <>
              <h1 className="text-3xl font-serif mb-8 text-center">PoemsLand</h1>
              
              {/* Filters */}
              <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex items-center">
                  <Filter size={18} className="mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                
                <div className="flex flex-wrap gap-4 flex-1">
                  <Select value={occasionFilter} onValueChange={setOccasionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Anlass" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Alle Anlässe</SelectItem>
                      {getUniqueOccasions().map(occasion => (
                        <SelectItem key={occasion} value={occasion}>
                          {getOccasionDisplay(occasion)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Thema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Alle Themen</SelectItem>
                      {getUniqueContentTypes().map(contentType => (
                        <SelectItem key={contentType} value={contentType}>
                          {getContentTypeDisplay(contentType)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {(occasionFilter || contentTypeFilter) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Filter zurücksetzen
                    </Button>
                  )}
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-pulse">Gedichte werden geladen...</div>
                </div>
              ) : filteredPoems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPoems.map((poem) => (
                    <Card 
                      key={poem.id} 
                      className="relative cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedPoemId(poem.id)}
                    >
                      <CardContent className="pt-6 h-40 flex flex-col">
                        <div className="absolute top-4 left-4">
                          <Heart size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute top-4 right-4">
                          <X 
                            size={18} 
                            className="text-muted-foreground hover:text-destructive transition-colors" 
                            onClick={(e) => handleDeletePoem(poem.id, e)}
                          />
                        </div>
                        
                        <h3 className="font-medium font-serif text-center mt-4 flex-1 line-clamp-2">
                          {poem.title}
                        </h3>
                        
                        <div className="flex justify-between items-center mt-4 text-xs">
                          <div className="flex gap-2 flex-wrap">
                            {poem.occasion && (
                              <Badge variant="secondary" className="text-xs">
                                {getOccasionDisplay(poem.occasion)}
                              </Badge>
                            )}
                            {poem.content_type && (
                              <Badge variant="outline" className="text-xs">
                                {getContentTypeDisplay(poem.content_type)}
                              </Badge>
                            )}
                          </div>
                          <span className="text-muted-foreground">
                            {new Date(poem.created_at).toLocaleDateString('de-DE', { 
                              month: 'short', 
                              day: '2-digit' 
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <p className="text-muted-foreground mb-2">Keine Gedichte gefunden</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {poems.length > 0 
                      ? 'Versuchen Sie andere Filter oder setzen Sie die Filter zurück.' 
                      : 'Erstellen Sie Ihr erstes Gedicht, um es hier zu speichern.'}
                  </p>
                  {poems.length === 0 && (
                    <Button onClick={() => navigate('/generator')}>
                      Gedicht erstellen
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PoemsLand;
