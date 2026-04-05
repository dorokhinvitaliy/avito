import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react';
import styles from './Typography.module.css';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';
export type TypographySize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'error'
  | 'warning'
  | 'success'
  | 'inherit';
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

interface TypographyBaseProps {
  children: ReactNode;
  variant?: TypographyVariant;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  noMargin?: boolean;
  className?: string;
}

type TypographyProps<T extends ElementType = 'span'> = TypographyBaseProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof TypographyBaseProps | 'as'>;

const variantMapping: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body1: 'p',
  body2: 'p',
  caption: 'span',
};

export function Typography<T extends ElementType = 'span'>({
  children,
  variant = 'body1',
  size,
  weight,
  color = 'primary',
  align = 'left',
  as,
  noMargin = true,
  className = '',
  ...props
}: TypographyProps<T>) {
  const Component = as || variantMapping[variant];

  const classes = [
    styles.typography,
    styles[`variant-${variant}`],
    size ? styles[`size-${size}`] : '',
    weight ? styles[`weight-${weight}`] : '',
    color ? styles[`color-${color}`] : '',
    align ? styles[`align-${align}`] : '',
    noMargin ? styles.noMargin : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
