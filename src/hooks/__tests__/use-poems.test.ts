
import { renderHook, act } from '@testing-library/react-hooks';
import { usePoems } from '../use-poems';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  }
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('usePoems Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values', () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: [], error: null })
    });

    const { result } = renderHook(() => usePoems());
    
    expect(result.current.poems).toEqual([]);
    expect(result.current.filteredPoems).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.selectedPoemId).toBe(null);
    expect(result.current.selectedPoem).toBe(null);
    expect(result.current.occasionFilter).toBe('all');
    expect(result.current.contentTypeFilter).toBe('all');
  });

  test('fetches poems on mount', async () => {
    const mockPoems = [
      { id: '1', title: 'Poem 1', content: 'Content 1', occasion: 'hochzeit', content_type: 'liebe' },
      { id: '2', title: 'Poem 2', content: 'Content 2', occasion: 'geburtstag', content_type: 'freundschaft' }
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: mockPoems, error: null })
    });

    const { result, waitForNextUpdate } = renderHook(() => usePoems());
    
    await waitForNextUpdate();
    
    expect(result.current.poems).toEqual(mockPoems);
    expect(result.current.filteredPoems).toEqual(mockPoems);
    expect(result.current.isLoading).toBe(false);
  });

  test('filters poems correctly when filters change', async () => {
    const mockPoems = [
      { id: '1', title: 'Poem 1', content: 'Content 1', occasion: 'hochzeit', content_type: 'liebe' },
      { id: '2', title: 'Poem 2', content: 'Content 2', occasion: 'geburtstag', content_type: 'freundschaft' }
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: mockPoems, error: null })
    });

    const { result, waitForNextUpdate } = renderHook(() => usePoems());
    
    await waitForNextUpdate();
    
    // Apply occasion filter
    act(() => {
      result.current.setOccasionFilter('hochzeit');
    });
    
    expect(result.current.filteredPoems).toEqual([mockPoems[0]]);
    
    // Apply content type filter
    act(() => {
      result.current.setContentTypeFilter('liebe');
    });
    
    expect(result.current.filteredPoems).toEqual([mockPoems[0]]);
    
    // Clear filters
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.occasionFilter).toBe('all');
    expect(result.current.contentTypeFilter).toBe('all');
    expect(result.current.filteredPoems).toEqual(mockPoems);
  });

  test('handles poem deletion', async () => {
    const mockPoems = [
      { id: '1', title: 'Poem 1', content: 'Content 1' },
      { id: '2', title: 'Poem 2', content: 'Content 2' }
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: mockPoems, error: null }),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis()
    });

    // Mock confirm to return true (user confirms deletion)
    global.confirm = jest.fn().mockReturnValue(true);
    
    // Mock successful deletion
    (supabase.from('user_poems').delete().eq('id', '1') as any) = { error: null };

    const { result, waitForNextUpdate } = renderHook(() => usePoems());
    
    await waitForNextUpdate();
    
    const mockEvent = { stopPropagation: jest.fn() } as unknown as React.MouseEvent;
    
    act(() => {
      result.current.handleDeletePoem('1', mockEvent);
    });
    
    // Check that event propagation was stopped
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    
    // Check toast was shown
    expect(toast.success).toHaveBeenCalledWith('Gedicht wurde gelöscht');
  });

  test('gets unique occasions and content types', async () => {
    const mockPoems = [
      { id: '1', title: 'Poem 1', content: 'Content 1', occasion: 'hochzeit', content_type: 'liebe' },
      { id: '2', title: 'Poem 2', content: 'Content 2', occasion: 'geburtstag', content_type: 'freundschaft' },
      { id: '3', title: 'Poem 3', content: 'Content 3', occasion: 'hochzeit', content_type: 'natur' }
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: mockPoems, error: null })
    });

    const { result, waitForNextUpdate } = renderHook(() => usePoems());
    
    await waitForNextUpdate();
    
    expect(result.current.getUniqueOccasions()).toEqual(['hochzeit', 'geburtstag']);
    expect(result.current.getUniqueContentTypes()).toEqual(['liebe', 'freundschaft', 'natur']);
  });
});
