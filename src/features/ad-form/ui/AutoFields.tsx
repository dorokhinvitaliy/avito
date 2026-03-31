import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import type { AutoItemParams } from '../../../entities/ad';

interface AutoFieldsProps {
  params: AutoItemParams;
  onChange: (params: AutoItemParams) => void;
  missingKeys: string[];
}

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Автоматическая' },
  { value: 'manual', label: 'Механическая' },
];

export function AutoFields({ params, onChange, missingKeys }: AutoFieldsProps) {
  const update = (key: keyof AutoItemParams, value: string | number | undefined) => {
    onChange({ ...params, [key]: value || undefined });
  };

  return (
    <>
      <Input
        label="Бренд"
        value={params.brand ?? ''}
        onChange={(e) => update('brand', e.target.value)}
        onClear={() => update('brand', undefined)}
        placeholder="Бренд"
        warning={missingKeys.includes('brand')}
      />
      <Input
        label="Модель"
        value={params.model ?? ''}
        onChange={(e) => update('model', e.target.value)}
        onClear={() => update('model', undefined)}
        placeholder="Модель"
        warning={missingKeys.includes('model')}
      />
      <Input
        label="Год выпуска"
        type="number"
        value={params.yearOfManufacture ?? ''}
        onChange={(e) => update('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('yearOfManufacture', undefined)}
        placeholder="Год выпуска"
        warning={missingKeys.includes('yearOfManufacture')}
      />
      <Select
        label="Коробка передач"
        value={params.transmission ?? ''}
        onChange={(e) => update('transmission', e.target.value as 'automatic' | 'manual' | undefined)}
        options={TRANSMISSION_OPTIONS}
        placeholder="Коробка передач"
        warning={missingKeys.includes('transmission')}
      />
      <Input
        label="Пробег (км)"
        type="number"
        value={params.mileage ?? ''}
        onChange={(e) => update('mileage', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('mileage', undefined)}
        placeholder="Пробег"
        warning={missingKeys.includes('mileage')}
      />
      <Input
        label="Мощность двигателя (л.с.)"
        type="number"
        value={params.enginePower ?? ''}
        onChange={(e) => update('enginePower', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('enginePower', undefined)}
        placeholder="Мощность двигателя"
        warning={missingKeys.includes('enginePower')}
      />
    </>
  );
}
