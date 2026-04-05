export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export type Responsive<T> = T | { [key in Breakpoint]?: T };

export const BREAKPOINTS: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

export function getResponsiveValue<T>(val: Responsive<T> | undefined, bp: Breakpoint): T | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
    return (val as Record<string, T>)[bp];
  }
  return bp === 'base' ? (val as T) : undefined;
}
