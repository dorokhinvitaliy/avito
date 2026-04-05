import type { ItemCategory, ItemParams, AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '../../../entities/ad';
import { EXPECTED_PARAMS } from '../../../entities/ad';
import { AutoFields } from './AutoFields';
import { RealEstateFields } from './RealEstateFields';
import { ElectronicsFields } from './ElectronicsFields';

interface CategoryFieldsProps {
  category: ItemCategory;
  params: ItemParams;
  originalParams?: ItemParams;
  onChange: (params: ItemParams) => void;
}

export function CategoryFields({ category, params, originalParams, onChange }: CategoryFieldsProps) {
  const expectedKeys = EXPECTED_PARAMS[category] ?? [];
  const missingKeys = expectedKeys.filter((key) => {
    const value = (params as Record<string, unknown>)[key];
    return value === undefined || value === null || value === '';
  });

  switch (category) {
    case 'auto':
      return <AutoFields params={params as AutoItemParams} originalParams={originalParams as AutoItemParams} onChange={onChange} missingKeys={missingKeys} />;
    case 'real_estate':
      return <RealEstateFields params={params as RealEstateItemParams} originalParams={originalParams as RealEstateItemParams} onChange={onChange} missingKeys={missingKeys} />;
    case 'electronics':
      return <ElectronicsFields params={params as ElectronicsItemParams} originalParams={originalParams as ElectronicsItemParams} onChange={onChange} missingKeys={missingKeys} />;
    default:
      return null;
  }
}
