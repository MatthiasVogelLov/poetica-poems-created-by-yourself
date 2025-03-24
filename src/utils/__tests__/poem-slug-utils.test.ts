
import { createSlug, getUniqueSlug, generatePoemSlugs } from '../poem-slug-utils';

describe('createSlug', () => {
  test('should convert title to lowercase', () => {
    expect(createSlug('TITLE')).toBe('title');
  });

  test('should replace spaces with dashes', () => {
    expect(createSlug('hello world')).toBe('hello-world');
  });

  test('should remove special characters', () => {
    expect(createSlug('hello@world!')).toBe('helloworld');
  });

  test('should remove accents', () => {
    expect(createSlug('héllò wörld')).toBe('hello-world');
  });

  test('should handle multiple spaces and dashes', () => {
    expect(createSlug('hello  --  world')).toBe('hello-world');
  });

  test('should handle empty string', () => {
    expect(createSlug('')).toBe('');
  });

  test('should handle complex title with mixed characters', () => {
    const complexTitle = 'Meine Schöne Gedicht: Mit § & % Zeichen!';
    expect(createSlug(complexTitle)).toBe('meine-schone-gedicht-mit-zeichen');
  });
});

describe('getUniqueSlug', () => {
  test('should return the base slug if no duplicates exist', () => {
    const existing = ['other-slug', 'another-slug'];
    expect(getUniqueSlug('my title', existing)).toBe('my-title');
  });

  test('should add a counter suffix when duplicate exists', () => {
    const existing = ['my-title', 'another-slug'];
    expect(getUniqueSlug('my title', existing)).toBe('my-title_1');
  });

  test('should increment counter until finding a unique slug', () => {
    const existing = ['my-title', 'my-title_1', 'my-title_2'];
    expect(getUniqueSlug('my title', existing)).toBe('my-title_3');
  });

  test('should handle empty existing slugs array', () => {
    expect(getUniqueSlug('my title', [])).toBe('my-title');
  });
});

describe('generatePoemSlugs', () => {
  test('should generate slugs for all poems', () => {
    const poems = [
      { id: '1', title: 'First Poem' },
      { id: '2', title: 'Second Poem' },
      { id: '3', title: 'Third Poem' }
    ];

    const result = generatePoemSlugs(poems);
    
    expect(Object.keys(result.poemSlugs)).toHaveLength(3);
    expect(Object.keys(result.slugToId)).toHaveLength(3);
    
    expect(result.poemSlugs['1']).toBe('first-poem');
    expect(result.poemSlugs['2']).toBe('second-poem');
    expect(result.poemSlugs['3']).toBe('third-poem');
    
    expect(result.slugToId['first-poem']).toBe('1');
    expect(result.slugToId['second-poem']).toBe('2');
    expect(result.slugToId['third-poem']).toBe('3');
  });

  test('should handle duplicate titles by creating unique slugs', () => {
    const poems = [
      { id: '1', title: 'My Poem' },
      { id: '2', title: 'My Poem' },
      { id: '3', title: 'My Poem' }
    ];

    const result = generatePoemSlugs(poems);
    
    expect(Object.keys(result.poemSlugs)).toHaveLength(3);
    
    // First one should be the base slug, then incremental counters
    expect(result.poemSlugs['1']).toBe('my-poem');
    expect(result.poemSlugs['2']).toBe('my-poem_1');
    expect(result.poemSlugs['3']).toBe('my-poem_2');
    
    expect(result.slugToId['my-poem']).toBe('1');
    expect(result.slugToId['my-poem_1']).toBe('2');
    expect(result.slugToId['my-poem_2']).toBe('3');
  });

  test('should handle empty input', () => {
    const result = generatePoemSlugs([]);
    
    expect(Object.keys(result.poemSlugs)).toHaveLength(0);
    expect(Object.keys(result.slugToId)).toHaveLength(0);
  });

  test('should handle special characters in titles', () => {
    const poems = [
      { id: '1', title: 'Poem with $ Special & Characters!' },
    ];

    const result = generatePoemSlugs(poems);
    
    expect(result.poemSlugs['1']).toBe('poem-with-special-characters');
    expect(result.slugToId['poem-with-special-characters']).toBe('1');
  });
});
