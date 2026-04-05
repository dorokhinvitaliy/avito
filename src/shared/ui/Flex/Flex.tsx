import type { ReactNode, ElementType, CSSProperties, ComponentPropsWithoutRef } from 'react';
import styles from './Flex.module.css';
import { type Responsive, BREAKPOINTS, getResponsiveValue } from '../types/responsive';

type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export type FlexProps<T extends ElementType> = {
  children: ReactNode;
  direction?: Responsive<Direction>;
  align?: Responsive<Align>;
  justify?: Responsive<Justify>;
  gap?: Responsive<number | string>;
  wrap?: Responsive<boolean>;
  fullWidth?: boolean;
  as?: T;
} & ComponentPropsWithoutRef<T>;


const ALIGN_MAP: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
};

const JUSTIFY_MAP: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export function Flex<T extends ElementType = 'div'>({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap,
  wrap = false,
  fullWidth = false,
  className = '',
  as,
  style,
  ...props
}: FlexProps<T>) {
  const Component = as || 'div';

  const classes = [styles.flex, fullWidth && styles.fullWidth, className].filter(Boolean).join(' ');

  const cssVars: Record<string, string> = {};

  BREAKPOINTS.forEach((bp) => {
    const bpDir = getResponsiveValue(direction, bp);
    if (bpDir !== undefined) cssVars[`--dir-${bp}`] = bpDir;

    const bpAlign = getResponsiveValue(align, bp);
    if (bpAlign !== undefined) cssVars[`--align-${bp}`] = ALIGN_MAP[bpAlign];

    const bpJustify = getResponsiveValue(justify, bp);
    if (bpJustify !== undefined) cssVars[`--just-${bp}`] = JUSTIFY_MAP[bpJustify];

    const bpGap = getResponsiveValue(gap, bp);
    if (bpGap !== undefined)
      cssVars[`--gap-${bp}`] = typeof bpGap === 'number' ? `var(--spacing-${bpGap})` : bpGap;

    const bpWrap = getResponsiveValue(wrap, bp);
    if (bpWrap !== undefined) cssVars[`--wrap-${bp}`] = bpWrap ? 'wrap' : 'nowrap';
  });

  const combinedStyle = { ...cssVars, ...style } as CSSProperties;

  return (
    <Component className={classes} style={combinedStyle} {...props}>
      {children}
    </Component>
  );
}
