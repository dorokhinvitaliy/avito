import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { ModifiedBadge } from '../../../shared/ui/ModifiedBadge';
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

  const renderLabel = (text: string) => {
    return text;
  };

  const renderModifiedSuffix = (key: keyof ElectronicsItemParams) => {
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
        onChange={(e) =>
          update('type', e.target.value as 'phone' | 'laptop' | 'misc' | undefined)
        }
        options={TYPE_OPTIONS}
        warning={missingKeys.includes('type')}
      />
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
        label={renderLabel("Цвет")}
        suffix={renderModifiedSuffix("color")}
        value={params.color ?? ''}
        onChange={(e) => update('color', e.target.value)}
        onClear={() => update('color', undefined)}
        warning={missingKeys.includes('color')}
      />
      <Select
        label={renderLabel("Состояние")}
        suffix={renderModifiedSuffix("condition")}
        value={params.condition ?? ''}
        onChange={(e) => update('condition', e.target.value as 'new' | 'used' | undefined)}
        options={CONDITION_OPTIONS}
        warning={missingKeys.includes('condition')}
      />
    </>
  );
}
