import { describe, it, expect } from 'vitest';
import { getMissingFields, doesItemNeedRevision } from './needsRevision';
import type { Item, ItemParams } from '../model/types';

describe('needsRevision', () => {
  const baseItem: Item = {
    id: 1,
    title: 'Test Item',
    description: 'Test description',
    price: 1000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    category: 'electronics',
    params: {},
  };

  describe('getMissingFields', () => {
    it('returns description in missing fields when description is empty', () => {
      const item = { ...baseItem, description: '' };
      expect(getMissingFields(item)).toContain('Описание');
    });

    it('returns no missing fields for valid item', () => {
      const item = {
        ...baseItem,
        params: {
          type: 'phone',
          brand: 'Apple',
          model: 'iPhone',
          condition: 'new',
          color: 'black',
        },
      };
      expect(getMissingFields(item)).toEqual([]);
    });
  });

  describe('doesItemNeedRevision', () => {
    it('returns true when description is missing', () => {
      expect(doesItemNeedRevision('electronics', undefined, {})).toBe(true);
    });

    it('returns true when description is empty', () => {
      expect(doesItemNeedRevision('electronics', '', {})).toBe(true);
    });

    it('returns true when required params are missing', () => {
      expect(doesItemNeedRevision('electronics', 'Description', {})).toBe(true);
    });

    it('returns false for electronics with all required params', () => {
      const params: ItemParams = {
        type: 'phone',
        brand: 'Apple',
        model: 'iPhone',
        condition: 'new',
        color: 'black',
      };
      expect(doesItemNeedRevision('electronics', 'Description', params)).toBe(false);
    });

    it('returns false for auto with all required params', () => {
      const params: ItemParams = {
        brand: 'Toyota',
        model: 'Camry',
        yearOfManufacture: 2020,
        transmission: 'automatic',
        mileage: 50000,
        enginePower: 150,
      };
      expect(doesItemNeedRevision('auto', 'Description', params)).toBe(false);
    });

    it('returns true for auto with missing params', () => {
      const params: ItemParams = {
        brand: 'Toyota',
      };
      expect(doesItemNeedRevision('auto', 'Description', params)).toBe(true);
    });

    it('returns false for real_estate with all required params', () => {
      const params: ItemParams = {
        type: 'flat',
        address: 'Moscow',
        area: 50,
        floor: 5,
      };
      expect(doesItemNeedRevision('real_estate', 'Description', params)).toBe(false);
    });
  });
});
