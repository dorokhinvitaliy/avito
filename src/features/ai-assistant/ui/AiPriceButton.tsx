import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { AiTooltip } from './AiTooltip';
import { suggestMarketPrice } from '../api/ollamaApi';
import type { ItemCategory, ItemParams } from '../../../entities/ad';
import { AnimatePresence } from 'framer-motion';

// Extract complex dependency to a variable for ESLint
const getParamsKey = (params: ItemParams) => JSON.stringify(params);

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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync state with props (Adjusting state while rendering)
  const [prevProps, setPrevProps] = useState({ title, category, params });

  // Extract complex dependency to a stable value for ESLint
  const paramsKey = useMemo(() => getParamsKey(params), [params]);

  if (
    title !== prevProps.title ||
    category !== prevProps.category ||
    paramsKey !== getParamsKey(prevProps.params)
  ) {
    setPrevProps({ title, category, params });
    setState('idle');
    setResult('');
    setShowTooltip(false);
    setState('idle');
    setResult('');
    setShowTooltip(false);
  }

  // Abort ongoing request when props change or on unmount
  useEffect(() => {
    abortControllerRef.current?.abort();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [title, category, paramsKey]);

  const handleClick = useCallback(async () => {
    setState('loading');
    setShowTooltip(false);

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const text = await suggestMarketPrice(title, category, params, abortController.signal);
      setResult(text);
      setState('done');
      setShowTooltip(true);
    } catch (err: unknown) {
      const error = err as { name?: string; code?: string };
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        return;
      }
      setState('error');
      setShowTooltip(true);
    }
  }, [title, category, params]);

  const handleApply = () => {
    // Убираем пробелы между цифрами (например "15 000" -> "15000")
    const textWithoutSpacedNumbers = result.replace(/(\d)\s+(?=\d)/g, '$1');
    const numbers = textWithoutSpacedNumbers.match(/\d+/g);

    if (numbers && numbers.length > 0) {
      // Ищем первое число, которое больше 2050 (чтобы пропустить года типа 2020),
      // либо берем просто первое найденное число
      const parsedNumbers = numbers.map((n) => parseInt(n, 10));
      let priceToApply = parsedNumbers.find((n) => n > 2050 && n <= 1000000000);

      if (!priceToApply) {
        priceToApply = parsedNumbers[0];
      }

      if (priceToApply && priceToApply > 0) {
        onApply(priceToApply);
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
    if (state === 'loading')
      return <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />;
    if (state === 'done' || state === 'error') return <RefreshCw size={16} />;
    return <Sparkles size={16} />;
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        type="button"
        variant="ai"
        onClick={handleClick}
        disabled={state === 'loading'}
        icon={getButtonIcon()}
      >
        {getButtonLabel()}
      </Button>
      <AnimatePresence>
        {showTooltip && (
          <AiTooltip
            content={result}
            isError={state === 'error'}
            onApply={handleApply}
            onClose={handleClose}
            applyLabel="Применить"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
