import { useState, useCallback } from 'react';
import { Button } from '../../../shared/ui/Button';
import { AiTooltip } from './AiTooltip';
import { suggestMarketPrice } from '../api/ollamaApi';
import type { ItemCategory, ItemParams } from '../../../entities/ad';

type AiState = 'idle' | 'loading' | 'done' | 'error';

interface AiPriceButtonProps {
  title: string;
  category: ItemCategory;
  params: ItemParams;
  onApply: (price: number) => void;
}

export function AiPriceButton({ title, category, params, onApply }: AiPriceButtonProps) {
  const [state, setState] = useState<AiState>('idle');
  const [result, setResult] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(async () => {
    setState('loading');
    setShowTooltip(false);

    try {
      const text = await suggestMarketPrice(title, category, params);
      setResult(text);
      setState('done');
      setShowTooltip(true);
    } catch {
      setState('error');
      setShowTooltip(true);
    }
  }, [title, category, params]);

  const handleApply = () => {
    // Try to parse a number from the AI response
    const numbers = result.match(/[\d\s]+/g);
    if (numbers) {
      const cleaned = numbers[0].replace(/\s/g, '');
      const parsed = parseInt(cleaned, 10);
      if (!isNaN(parsed) && parsed > 0) {
        onApply(parsed);
      }
    }
    setShowTooltip(false);
    setState('idle');
  };

  const handleClose = () => {
    setShowTooltip(false);
  };

  const getButtonLabel = () => {
    if (state === 'loading') return 'Выполняется запрос';
    if (state === 'done' || state === 'error') return 'Повторить запрос';
    return 'Узнать рыночную цену';
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
