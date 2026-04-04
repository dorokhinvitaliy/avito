import type { ElementType } from 'react';
import { Flex, type FlexProps } from '../Flex';

type StackProps<T extends ElementType> = Omit<FlexProps<T>, 'direction'>;

export function Stack<T extends ElementType = 'div'>({ children, ...props }: StackProps<T>) {
  return (
    <Flex direction="column" {...(props as FlexProps<T>)}>
      {children}
    </Flex>
  );
}
