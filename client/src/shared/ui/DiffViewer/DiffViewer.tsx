import { useMemo } from 'react';
import styles from './DiffViewer.module.css';
import { Stack, Typography } from '@/shared/ui';

interface DiffViewerProps {
  oldText: string;
  newText: string;
  title?: string;
  variant?: 'side-by-side' | 'inline';
}

interface DiffToken {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export function DiffViewer({ oldText, newText, title, variant = 'side-by-side' }: DiffViewerProps) {
  const diff = useMemo(() => {
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    const tokens: DiffToken[] = [];

    let i = 0;
    let j = 0;

    while (i < oldWords.length || j < newWords.length) {
      if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
        tokens.push({ type: 'unchanged', value: oldWords[i] });
        i++;
        j++;
      } else if (j < newWords.length && !oldWords.includes(newWords[j], i)) {
        tokens.push({ type: 'added', value: newWords[j] });
        j++;
      } else if (i < oldWords.length) {
        tokens.push({ type: 'removed', value: oldWords[i] });
        i++;
      } else {
        // Fallback for unbalanced arrays
        if (j < newWords.length) {
          tokens.push({ type: 'added', value: newWords[j] });
          j++;
        }
      }
    }
    return tokens;
  }, [oldText, newText]);

  if (variant === 'inline') {
    return (
      <Stack gap={2}>
        {title && <Typography variant="body2" weight="bold">{title}</Typography>}
        <div className={styles.inlineBox}>
          {diff.map((token, index) => (
            <span
              key={index}
              className={
                token.type === 'added'
                  ? styles.addedInline
                  : token.type === 'removed'
                  ? styles.removedInline
                  : undefined
              }
            >
              {token.value}
            </span>
          ))}
        </div>
      </Stack>
    );
  }

  return (
    <Stack gap={3} className={styles.container}>
      {title && <Typography variant="h4">{title}</Typography>}
      <div className={styles.grid}>
        <Stack gap={1}>
          <Typography variant="body2" color="tertiary" weight="semibold" className={styles.label}>
            БЫЛО
          </Typography>
          <div className={styles.pane}>
            {diff.map((token, index) => 
              token.type !== 'added' && (
                <span
                  key={index}
                  className={token.type === 'removed' ? styles.removedInline : undefined}
                >
                  {token.value}
                </span>
              )
            )}
          </div>
        </Stack>
        <Stack gap={1}>
          <Typography variant="body2" color="secondary" weight="semibold" className={styles.label}>
            СТАЛО
          </Typography>
          <div className={styles.pane}>
            {diff.map((token, index) => 
              token.type !== 'removed' && (
                <span
                  key={index}
                  className={token.type === 'added' ? styles.addedInline : undefined}
                >
                  {token.value}
                </span>
              )
            )}
          </div>
        </Stack>
      </div>
    </Stack>
  );
}
