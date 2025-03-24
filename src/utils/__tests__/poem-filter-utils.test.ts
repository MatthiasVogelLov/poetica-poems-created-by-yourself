
import { filterPoems, getUniqueValues } from '../poem-filter-utils';
import { Poem } from '../../types/poem-types';

describe('filterPoems', () => {
  const mockPoems: Poem[] = [
    {
      id: '1',
      title: 'Birthday Poem',
      content: 'Happy birthday to you',
      occasion: 'birthday',
      content_type: 'congratulation',
      created_at: '2023-01-01',
    },
    {
      id: '2',
      title: 'Wedding Poem',
      content: 'Congratulations on your wedding',
      occasion: 'wedding',
      content_type: 'congratulation',
      created_at: '2023-01-02',
    },
    {
      id: '3',
      title: 'Christmas Poem',
      content: 'Merry Christmas',
      occasion: 'christmas',
      content_type: 'holiday',
      created_at: '2023-01-03',
    }
  ];

  test('should return all poems when no filters are applied', () => {
    const result = filterPoems(mockPoems, '', '');
    expect(result).toHaveLength(3);
    expect(result).toEqual(mockPoems);
  });

  test('should return all poems when filters are set to "all"', () => {
    const result = filterPoems(mockPoems, 'all', 'all');
    expect(result).toHaveLength(3);
    expect(result).toEqual(mockPoems);
  });

  test('should filter poems by occasion', () => {
    const result = filterPoems(mockPoems, 'birthday', '');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('should filter poems by content type', () => {
    const result = filterPoems(mockPoems, '', 'congratulation');
    expect(result).toHaveLength(2);
    expect(result.map(p => p.id).sort()).toEqual(['1', '2']);
  });

  test('should filter poems by both occasion and content type', () => {
    const result = filterPoems(mockPoems, 'wedding', 'congratulation');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('should return empty array when no poems match filters', () => {
    const result = filterPoems(mockPoems, 'graduation', 'holiday');
    expect(result).toHaveLength(0);
  });
});

describe('getUniqueValues', () => {
  const mockData = [
    { id: '1', category: 'A', tag: 'tag1' },
    { id: '2', category: 'B', tag: 'tag2' },
    { id: '3', category: 'A', tag: 'tag3' },
    { id: '4', category: 'C', tag: 'tag1' },
    { id: '5', category: null as any, tag: 'tag4' },
    { id: '6', category: undefined as any, tag: 'tag5' },
  ];

  test('should extract unique values for a field', () => {
    const result = getUniqueValues(mockData, 'category');
    expect(result).toHaveLength(3);
    expect(result.sort()).toEqual(['A', 'B', 'C']);
  });

  test('should handle different fields', () => {
    const result = getUniqueValues(mockData, 'tag');
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
  });

  test('should handle empty arrays', () => {
    const result = getUniqueValues([], 'category');
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  test('should filter out null and undefined values', () => {
    // The implementation already filters out null/undefined with the Boolean filter
    const result = getUniqueValues(mockData, 'category');
    expect(result).toHaveLength(3);
    expect(result).not.toContain(null);
    expect(result).not.toContain(undefined);
  });
});
