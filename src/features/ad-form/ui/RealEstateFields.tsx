import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { ModifiedBadge } from '../../../shared/ui/ModifiedBadge';
import type { RealEstateItemParams } from '../../../entities/ad';

interface RealEstateFieldsProps {
  params: RealEstateItemParams;
  originalParams?: RealEstateItemParams;
  onChange: (params: RealEstateItemParams) => void;
  missingKeys: string[];
}

const TYPE_OPTIONS = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'room', label: 'Комната' },
];

export function RealEstateFields({ params, originalParams, onChange, missingKeys }: RealEstateFieldsProps) {
  const update = (key: keyof RealEstateItemParams, value: string | number | undefined) => {
    onChange({ ...params, [key]: value || undefined });
  };

  const renderLabel = (text: string) => {
    return text;
  };

  const renderModifiedSuffix = (key: keyof RealEstateItemParams) => {
    const isFieldModified = originalParams && params[key] !== originalParams[key];
    if (!isFieldModified) return null;

    return (
      <ModifiedBadge 
        originalValue={originalParams[key]} 
        onReset={() => update(key, originalParams[key])} 
      />
    );
  };

  return (
    <>
      <Select
        label={renderLabel("Тип")}
        suffix={renderModifiedSuffix("type")}
        value={params.type ?? ''}
        onChange={(e) => update('type', e.target.value as 'flat' | 'house' | 'room' | undefined)}
        options={TYPE_OPTIONS}
        warning={missingKeys.includes('type')}
      />
      <Input
        label={renderLabel("Адрес")}
        suffix={renderModifiedSuffix("address")}
        value={params.address ?? ''}
        onChange={(e) => update('address', e.target.value)}
        onClear={() => update('address', undefined)}
        warning={missingKeys.includes('address')}
      />
      <Input
        label={renderLabel("Площадь (м²)")}
        suffix={renderModifiedSuffix("area")}
        type="number"
        value={params.area ?? ''}
        onChange={(e) => update('area', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('area', undefined)}
        warning={missingKeys.includes('area')}
      />
      <Input
        label={renderLabel("Этаж")}
        suffix={renderModifiedSuffix("floor")}
        type="number"
        value={params.floor ?? ''}
        onChange={(e) => update('floor', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('floor', undefined)}
        warning={missingKeys.includes('floor')}
      />
    </>
  );
}
