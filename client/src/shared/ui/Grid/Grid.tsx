import type { ReactNode, ElementType, CSSProperties, ComponentPropsWithoutRef } from 'react';
import styles from './Grid.module.css';
import { type Responsive, BREAKPOINTS, getResponsiveValue } from '../types/responsive';

type GridProps<T extends ElementType> = {
  children: ReactNode;
  cols?: Responsive<number>;
  minColWidth?: Responsive<number | string>;
  autoMode?: 'auto-fill' | 'auto-fit';
  gap?: Responsive<number | string>;
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

  const cssVars: Record<string, string> = {};

  BREAKPOINTS.forEach((bp) => {
    const bpGap = getResponsiveValue(gap, bp);
    if (bpGap !== undefined) {
      cssVars[`--gap-${bp}`] = typeof bpGap === 'number' ? `var(--spacing-${bpGap})` : bpGap;
    }

    const bpCols = getResponsiveValue(cols, bp);
    const bpMinColWidth = getResponsiveValue(minColWidth, bp);

    if (bpMinColWidth !== undefined) {
      const min = typeof bpMinColWidth === 'number' ? `${bpMinColWidth}px` : bpMinColWidth;
      cssVars[`--cols-${bp}`] = `repeat(${autoMode}, minmax(${min}, 1fr))`;
    } else if (bpCols !== undefined) {
      cssVars[`--cols-${bp}`] = `repeat(${bpCols}, minmax(0, 1fr))`;
    }
  });

  const combinedStyle = { ...cssVars, ...style } as CSSProperties;

  return (
    <Component className={classes} style={combinedStyle} {...props}>
      {children}
    </Component>
  );
}
