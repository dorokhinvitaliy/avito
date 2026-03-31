import { useState, useCallback } from 'react';
import { Button } from '../../../shared/ui/Button';
import { AiTooltip } from './AiTooltip';
import { generateDescription } from '../api/ollamaApi';
import type { ItemCategory, ItemParams } from '../../../entities/ad';

type AiState = 'idle' | 'loading' | 'done' | 'error';

interface AiDescriptionButtonProps {
  title: string;
  category: ItemCategory;
  price: number | null;
  params: ItemParams;
  currentDescription?: string;
  onApply: (description: string) => void;
}

export function AiDescriptionButton({
  title,
  category,
  price,
  params,
  currentDescription,
  onApply,
}: AiDescriptionButtonProps) {
  const [state, setState] = useState<AiState>('idle');
  const [result, setResult] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const hasDescription = Boolean(currentDescription?.trim());

  const handleClick = useCallback(async () => {
    setState('loading');
    setShowTooltip(false);

    try {
      const text = await generateDescription(title, category, price, params, currentDescription);
      setResult(text);
      setState('done');
      setShowTooltip(true);
    } catch {
      setState('error');
      setShowTooltip(true);
    }
  }, [title, category, price, params, currentDescription]);

  const handleApply = () => {
    onApply(result);
    setShowTooltip(false);
    setState('idle');
  };

  const handleClose = () => {
    setShowTooltip(false);
  };

  const getButtonLabel = () => {
    if (state === 'loading') return 'Выполняется запрос';
    if (state === 'done' || state === 'error') return 'Повторить запрос';
    return hasDescription ? 'Улучшить описание' : 'Придумать описание';
  };

  const getButtonIcon = () => {
    if (state === 'done' || state === 'error') return '🔄';
    return '💡';
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant="ai"
        onClick={handleClick}
        isLoading={state === 'loading'}
        icon={<span>{getButtonIcon()}</span>}
      >
        {getButtonLabel()}
      </Button>

      {showTooltip && (
        <AiTooltip
          content={result}
          isError={state === 'error'}
          onApply={handleApply}
          onClose={handleClose}
          applyLabel="Применить"
        />
      )}
    </div>
  );
}
