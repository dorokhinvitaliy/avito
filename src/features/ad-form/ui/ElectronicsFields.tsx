import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import type { ElectronicsItemParams } from '../../../entities/ad';

interface ElectronicsFieldsProps {
  params: ElectronicsItemParams;
  originalParams?: ElectronicsItemParams;
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

export function ElectronicsFields({ params, originalParams, onChange, missingKeys }: ElectronicsFieldsProps) {
  const update = (key: keyof ElectronicsItemParams, value: string | undefined) => {
    onChange({ ...params, [key]: value || undefined });
  };

  const renderLabel = (text: string, key: keyof ElectronicsItemParams) => {
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
      <Select
        label={renderLabel("Тип", "type")}
        value={params.type ?? ''}
        onChange={(e) =>
          update('type', e.target.value as 'phone' | 'laptop' | 'misc' | undefined)
        }
        options={TYPE_OPTIONS}
        placeholder="Тип"
        warning={missingKeys.includes('type')}
      />
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
        label={renderLabel("Цвет", "color")}
        value={params.color ?? ''}
        onChange={(e) => update('color', e.target.value)}
        onClear={() => update('color', undefined)}
        placeholder="Цвет"
        warning={missingKeys.includes('color')}
      />
      <Select
        label={renderLabel("Состояние", "condition")}
        value={params.condition ?? ''}
        onChange={(e) => update('condition', e.target.value as 'new' | 'used' | undefined)}
        options={CONDITION_OPTIONS}
        placeholder="Состояние"
        warning={missingKeys.includes('condition')}
      />
    </>
  );
}
