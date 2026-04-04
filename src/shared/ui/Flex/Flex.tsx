import type { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import styles from './Flex.module.css';

export type FlexProps<T extends ElementType> = {
  children: ReactNode;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: number | string;
  wrap?: boolean;
  fullWidth?: boolean;
  as?: T;
} & ComponentPropsWithoutRef<T>;

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
  const classes = [
    styles.flex,
    styles[`direction-${direction}`],
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    wrap && styles.wrap,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const combinedStyle = {
    ...(gap ? { gap: typeof gap === 'number' ? `var(--spacing-${gap})` : gap } : {}),
    ...style,
  };

  return (
    <Component className={classes} style={combinedStyle} {...props}>
      {children}
    </Component>
  );
}
