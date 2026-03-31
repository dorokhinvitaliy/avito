import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import type { ElectronicsItemParams } from '../../../entities/ad';

interface ElectronicsFieldsProps {
  params: ElectronicsItemParams;
  onChange: (params: ElectronicsItemParams) => void;
  missingKeys: string[];
}

const TYPE_OPTIONS = [
  { value: 'phone', label: 'Телефон' },
  { value: 'laptop', label: 'Ноутбук' },
  { value: 'misc', label: 'Другое' },
];

const CONDITION_OPTIONS = [
  { value: 'new', label: 'Новый' },
  { value: 'used', label: 'Б/У' },
];

export function ElectronicsFields({ params, onChange, missingKeys }: ElectronicsFieldsProps) {
  const update = (key: keyof ElectronicsItemParams, value: string | undefined) => {
    onChange({ ...params, [key]: value || undefined });
  };

  return (
    <>
      <Select
        label="Тип"
        value={params.type ?? ''}
        onChange={(e) =>
          update('type', e.target.value as 'phone' | 'laptop' | 'misc' | undefined)
        }
        options={TYPE_OPTIONS}
        placeholder="Тип"
        warning={missingKeys.includes('type')}
      />
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
        label="Цвет"
        value={params.color ?? ''}
        onChange={(e) => update('color', e.target.value)}
        onClear={() => update('color', undefined)}
        placeholder="Цвет"
        warning={missingKeys.includes('color')}
      />
      <Select
        label="Состояние"
        value={params.condition ?? ''}
        onChange={(e) => update('condition', e.target.value as 'new' | 'used' | undefined)}
        options={CONDITION_OPTIONS}
        placeholder="Состояние"
        warning={missingKeys.includes('condition')}
      />
    </>
  );
}
