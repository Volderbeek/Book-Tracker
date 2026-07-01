import { formatDate, getValidGenresFromSubjects, cleanGenres, extractDescription } from '../../utils/helpers';

describe('helpers utility functions', () => {
  describe('formatDate', () => {
    it('should return "Not started" if isoString is not provided or empty', () => {
      expect(formatDate()).toBe('Not started');
      expect(formatDate(undefined)).toBe('Not started');
    });

    it('should format a valid ISO string to a localized date string', () => {
      const isoString = '2026-06-30T12:00:00Z';
      const result = formatDate(isoString);
      expect(result).not.toBe('Not started');
      expect(typeof result).toBe('string');
      // Verify that it contains year-like numbers (2026)
      expect(result).toContain('2026');
    });
  });

  describe('getValidGenresFromSubjects', () => {
    it('should return ["Fiction"] for empty or undefined subjects', () => {
      expect(getValidGenresFromSubjects([])).toEqual(['Fiction']);
      // @ts-expect-error testing null input runtime safety
      expect(getValidGenresFromSubjects(null)).toEqual(['Fiction']);
    });

    it('should map standard subjects to standard genres', () => {
      expect(getValidGenresFromSubjects(['fantasy'])).toEqual(['Fantasy']);
      expect(getValidGenresFromSubjects(['sci-fi', 'magic'])).toEqual(['Science Fiction / Sci-Fi', 'Fantasy']);
      expect(getValidGenresFromSubjects(['murder mystery', 'crime'])).toEqual(['Mystery / Detective']);
    });

    it('should clean and deduplicate mapped genres', () => {
      const subjects = ['fantasy', 'magic', 'supernatural', 'gothic horror'];
      const result = getValidGenresFromSubjects(subjects);
      expect(result).toContain('Fantasy');
      expect(result).toContain('Horror');
      expect(result.length).toBe(2);
    });

    it('should fall back to Fiction or Non-Fiction when no keywords match', () => {
      expect(getValidGenresFromSubjects(['some random thing'])).toEqual(['Fiction']);
      expect(getValidGenresFromSubjects(['nonfiction truth'])).toEqual(['Non-Fiction', 'Fiction']);
      expect(getValidGenresFromSubjects(['novel stories'])).toEqual(['Fiction']);
    });
  });

  describe('cleanGenres', () => {
    it('should map, deduplicate, and join up to 3 genres', () => {
      const subjects = ['sci-fi', 'magic', 'gothic', 'crime drama', 'history'];
      const result = cleanGenres(subjects);
      
      // Expected genres mapped:
      // - sci-fi -> Science Fiction / Sci-Fi
      // - magic -> Fantasy
      // - gothic -> Horror
      // - crime drama -> Mystery / Detective, Drama / Plays
      // - history -> History
      // Total mapped: ['Science Fiction / Sci-Fi', 'Fantasy', 'Horror', 'Mystery / Detective', 'Drama / Plays', 'History']
      // Sliced to 3, joined by ', '
      const parts = result.split(', ');
      expect(parts.length).toBe(3);
      expect(parts[0]).toBe('Science Fiction / Sci-Fi');
      expect(parts[1]).toBe('Fantasy');
      expect(parts[2]).toBe('Horror');
    });

    it('should return Fiction if subjects list is empty', () => {
      expect(cleanGenres([])).toBe('Fiction');
    });
  });

  describe('extractDescription', () => {
    it('should return empty string if workData or description is missing', () => {
      expect(extractDescription(null)).toBe('');
      expect(extractDescription(undefined)).toBe('');
      expect(extractDescription({})).toBe('');
      expect(extractDescription({ someOtherField: 'value' })).toBe('');
    });

    it('should return description if description is a string', () => {
      const workData = { description: 'This is a description.' };
      expect(extractDescription(workData)).toBe('This is a description.');
    });

    it('should extract value if description is an object containing value', () => {
      const workData = { description: { type: '/type/text', value: 'Object description.' } };
      expect(extractDescription(workData)).toBe('Object description.');
    });

    it('should return empty string if description object does not contain value', () => {
      const workData = { description: { type: '/type/text' } };
      expect(extractDescription(workData)).toBe('');
    });
  });
});
