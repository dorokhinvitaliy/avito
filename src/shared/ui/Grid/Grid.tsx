import type { ReactNode, ElementType, CSSProperties, ComponentPropsWithoutRef } from 'react';
import styles from './Grid.module.css';

type GridProps<T extends ElementType> = {
  children: ReactNode;
  cols?: number;
  minColWidth?: number | string;
  autoMode?: 'auto-fill' | 'auto-fit';
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'between';
  fullWidth?: boolean;
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Grid<T extends ElementType = 'div'>({
  children,
  cols = 1,
  minColWidth,
  autoMode = 'auto-fill',
  gap,
  align = 'stretch',
  justify = 'stretch',
  fullWidth = false,
  className = '',
  as,
  style,
  ...props
}: GridProps<T>) {
  const Component = as || 'div';

  const classes = [
    styles.grid,
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  let gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  if (minColWidth) {
    const minWidth = typeof minColWidth === 'number' ? `${minColWidth}px` : minColWidth;
    gridTemplateColumns = `repeat(${autoMode}, minmax(${minWidth}, 1fr))`;
  }

  const combinedStyle: CSSProperties = {
    gridTemplateColumns,
    gap: typeof gap === 'number' ? `var(--spacing-${gap})` : gap,
    ...style,
  };

  return (
    <Component className={classes} style={combinedStyle} {...props}>
      {children}
    </Component>
  );
}
