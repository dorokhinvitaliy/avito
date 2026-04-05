import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from './formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats price with currency', () => {
      const result = formatPrice(1000);
      expect(result).toContain('₽');
      expect(result.replace(/\s/g, ' ')).toContain('1 000 ₽');
    });

    it('formats large price correctly', () => {
      const result = formatPrice(1500000);
      expect(result).toContain('₽');
      expect(result.replace(/\s/g, ' ')).toContain('1 500 000 ₽');
    });

    it('formats zero', () => {
      expect(formatPrice(0)).toBe('0 ₽');
    });

    it('formats small number', () => {
      expect(formatPrice(1)).toBe('1 ₽');
    });
  });

  describe('formatDate', () => {
    it('formats date string and includes month', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('января');
    });
  });
});
