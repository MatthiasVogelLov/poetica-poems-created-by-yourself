
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';

export const usePoemDeletion = (
  setPoems: React.Dispatch<React.SetStateAction<Poem[]>>
) => {
  // Delete a poem from the database
  const handleDeletePoem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this poem?')) {
      try {
        await supabase.functions.invoke('manage-poem', {
          body: { action: 'delete', poemId: id }
        });
        
        setPoems(prevPoems => prevPoems.filter(poem => poem.id !== id));
        toast.success('Poem deleted successfully');
      } catch (error) {
        console.error('Error deleting poem:', error);
        toast.error('Error deleting the poem');
      }
    }
  };

  return { handleDeletePoem };
};
