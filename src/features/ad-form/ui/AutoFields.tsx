import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
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

  const renderLabel = (text: string, key: keyof AutoItemParams) => {
    const isModified = originalParams && params[key] !== originalParams[key];
    if (!isModified) return text;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        {text}
        <span style={{ fontSize: '10px', backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-secondary)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>изменено в черновике</span>
      </span>
    );
  };

  return (
    <>
      <Input
        label={renderLabel("Бренд", "brand")}
        value={params.brand ?? ''}
        onChange={(e) => update('brand', e.target.value)}
        onClear={() => update('brand', undefined)}
        placeholder="Бренд"
        warning={missingKeys.includes('brand')}
      />
      <Input
        label={renderLabel("Модель", "model")}
        value={params.model ?? ''}
        onChange={(e) => update('model', e.target.value)}
        onClear={() => update('model', undefined)}
        placeholder="Модель"
        warning={missingKeys.includes('model')}
      />
      <Input
        label={renderLabel("Год выпуска", "yearOfManufacture")}
        type="number"
        value={params.yearOfManufacture ?? ''}
        onChange={(e) => update('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('yearOfManufacture', undefined)}
        placeholder="Год выпуска"
        warning={missingKeys.includes('yearOfManufacture')}
      />
      <Select
        label={renderLabel("Коробка передач", "transmission")}
        value={params.transmission ?? ''}
        onChange={(e) => update('transmission', e.target.value as 'automatic' | 'manual' | undefined)}
        options={TRANSMISSION_OPTIONS}
        placeholder="Коробка передач"
        warning={missingKeys.includes('transmission')}
      />
      <Input
        label={renderLabel("Пробег (км)", "mileage")}
        type="number"
        value={params.mileage ?? ''}
        onChange={(e) => update('mileage', e.target.value ? Number(e.target.value) : undefined)}
        onClear={() => update('mileage', undefined)}
        placeholder="Пробег"
        warning={missingKeys.includes('mileage')}
      />
      <Input
        label={renderLabel("Мощность двигателя (л.с.)", "enginePower")}
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
