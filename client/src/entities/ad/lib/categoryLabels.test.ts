import { describe, it, expect } from 'vitest';
import {
  CATEGORY_LABELS,
  translateParamValue,
  TRANSMISSION_LABELS,
  CONDITION_LABELS,
} from './categoryLabels';
import type { ItemCategory } from '../model/types';

describe('categoryLabels', () => {
  describe('CATEGORY_LABELS', () => {
    it('returns label for electronics', () => {
      expect(CATEGORY_LABELS['electronics']).toBe('Электроника');
    });

    it('returns label for real_estate', () => {
      expect(CATEGORY_LABELS['real_estate']).toBe('Недвижимость');
    });

    it('returns label for auto', () => {
      expect(CATEGORY_LABELS['auto']).toBe('Авто');
    });
  });

  describe('translateParamValue', () => {
    it('translates transmission value', () => {
      expect(translateParamValue('auto' as ItemCategory, 'transmission', 'automatic')).toBe(
        'Автоматическая',
      );
    });

    it('translates condition value', () => {
      expect(translateParamValue('electronics' as ItemCategory, 'condition', 'new')).toBe('Новый');
    });

    it('translates mileage with formatting', () => {
      const result = translateParamValue('auto' as ItemCategory, 'mileage', 150000);
      expect(result).toContain('км');
      expect(result.replace(/\s/g, ' ')).toContain('150 000 км');
    });

    it('translates enginePower with formatting', () => {
      expect(translateParamValue('auto' as ItemCategory, 'enginePower', 150)).toBe('150 л.с.');
    });

    it('translates area with formatting', () => {
      expect(translateParamValue('real_estate' as ItemCategory, 'area', 50)).toBe('50 м²');
    });

    it('returns empty string for null value', () => {
      expect(translateParamValue('electronics' as ItemCategory, 'brand', null)).toBe('');
    });

    it('returns empty string for undefined value', () => {
      expect(translateParamValue('electronics' as ItemCategory, 'brand', undefined)).toBe('');
    });

    it('returns empty string for empty string value', () => {
      expect(translateParamValue('electronics' as ItemCategory, 'brand', '')).toBe('');
    });

    it('returns original value if translation not found', () => {
      expect(translateParamValue('electronics' as ItemCategory, 'brand', 'unknown')).toBe(
        'unknown',
      );
    });
  });

  describe('TRANSMISSION_LABELS', () => {
    it('translates automatic', () => {
      expect(TRANSMISSION_LABELS['automatic']).toBe('Автоматическая');
    });

    it('translates manual', () => {
      expect(TRANSMISSION_LABELS['manual']).toBe('Механическая');
    });
  });

  describe('CONDITION_LABELS', () => {
    it('translates new', () => {
      expect(CONDITION_LABELS['new']).toBe('Новый');
    });

    it('translates used', () => {
      expect(CONDITION_LABELS['used']).toBe('Б/У');
    });
  });
});
