import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { ModifiedBadge } from '../../../shared/ui/ModifiedBadge';
import type { AutoItemParams } from '../../../entities/ad';

interface AutoFieldsProps {
  params: AutoItemParams;
  originalParams?: AutoItemParams;
  onChange: (params: AutoItemParams) => void;
  missingKeys: string[];
}

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Автоматическая' },
  { value: 'manual', label: 'Механическая' },
];

export function AutoFields({ params, originalParams, onChange, missingKeys }: AutoFieldsProps) {
  const update = (key: keyof AutoItemParams, value: string | number | undefined) => {
    onChange({ ...params, [key]: value || undefined });
  };

  const renderLabel = (text: string) => {
    return text;
  };

  const renderModifiedSuffix = (key: keyof AutoItemParams) => {
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
      <Input
        label={renderLabel("Бренд")}
        suffix={renderModifiedSuffix("brand")}
        value={params.brand ?? ''}
        onChange={(e) => update('brand', e.target.value)}
        onClear={() => update('brand', undefined)}
        warning={missingKeys.includes('brand')}
      />
      <Input
        label={renderLabel("Модель")}
        suffix={renderModifiedSuffix("model")}
        value={params.model ?? ''}
        onChange={(e) => update('model', e.target.value)}
        onClear={() => update('model', undefined)}
        warning={missingKeys.includes('model')}
      />
      <Input
        label={renderLabel("Год выпуска")}
        suffix={renderModifiedSuffix("yearOfManufacture")}
        type="number"
        value={params.yearOfManufacture ?? ''}
        onChange={(e) => update('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('yearOfManufacture', undefined)}
        warning={missingKeys.includes('yearOfManufacture')}
      />
      <Select
        label={renderLabel("Коробка передач")}
        suffix={renderModifiedSuffix("transmission")}
        value={params.transmission ?? ''}
        onChange={(e) => update('transmission', e.target.value as 'automatic' | 'manual' | undefined)}
        options={TRANSMISSION_OPTIONS}
        warning={missingKeys.includes('transmission')}
      />
      <Input
        label={renderLabel("Пробег (км)")}
        suffix={renderModifiedSuffix("mileage")}
        type="number"
        value={params.mileage ?? ''}
        onChange={(e) => update('mileage', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('mileage', undefined)}
        warning={missingKeys.includes('mileage')}
      />
      <Input
        label={renderLabel("Мощность двигателя (л.с.)")}
        suffix={renderModifiedSuffix("enginePower")}
        type="number"
        value={params.enginePower ?? ''}
        onChange={(e) => update('enginePower', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('enginePower', undefined)}
        warning={missingKeys.includes('enginePower')}
      />
    </>
  );
}
