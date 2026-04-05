import type { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import styles from './Card.module.css';

type CardProps<T extends ElementType> = {
  children: ReactNode;
  padding?: number | string;
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Card<T extends ElementType = 'div'>({
  children,
  padding = 10,
  as,
  className = '',
  style,
  ...props
}: CardProps<T>) {
  const Component = as || 'div';
  const combinedStyle = {
    padding: typeof padding === 'number' ? `var(--spacing-${padding})` : padding,
    ...style,
  };

  return (
    <Component className={`${styles.card} ${className}`} style={combinedStyle} {...props}>
      {children}
    </Component>
  );
}
