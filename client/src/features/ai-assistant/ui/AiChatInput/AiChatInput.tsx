import { 
  useLayoutEffect, 
  useCallback,
  useRef as useReactRef 
} from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui';
import styles from './AiChatInput.module.css';

interface AiChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function AiChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading, 
  placeholder = 'Спросите что-нибудь...' 
}: AiChatInputProps) {
  const textareaRef = useReactRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [textareaRef]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
      />
      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={styles.sendBtn}
          disabled={isLoading || !value.trim()}
          onClick={onSubmit}
          icon={<ArrowRight size={18} />}
        />
      </div>
    </div>
  );
}
