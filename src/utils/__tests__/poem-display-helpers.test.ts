
import { getOccasionDisplay, getContentTypeDisplay } from '../poem-display-helpers';

describe('Poem Display Helpers', () => {
  describe('getOccasionDisplay', () => {
    test('returns correct display value for known occasions', () => {
      expect(getOccasionDisplay('geburtstag')).toBe('Geburtstag');
      expect(getOccasionDisplay('hochzeit')).toBe('Hochzeit');
      expect(getOccasionDisplay('valentinstag')).toBe('Valentinstag');
    });

    test('returns the original value for unknown occasions', () => {
      expect(getOccasionDisplay('unknown-occasion')).toBe('unknown-occasion');
    });
  });

  describe('getContentTypeDisplay', () => {
    test('returns correct display value for known content types', () => {
      expect(getContentTypeDisplay('liebe')).toBe('Liebe');
      expect(getContentTypeDisplay('freundschaft')).toBe('Freundschaft');
      expect(getContentTypeDisplay('natur')).toBe('Natur');
    });

    test('returns the original value for unknown content types', () => {
      expect(getContentTypeDisplay('unknown-type')).toBe('unknown-type');
    });
  });
});
