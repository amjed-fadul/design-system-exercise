import type { ButtonProps } from './Button';

type ForbiddenButtonKeys = Extract<
  keyof ButtonProps,
  'state' | 'focusVisible' | 'showIcon' | 'size' | 'danger' | 'success'
>;

type AssertNever<T extends never> = T;

export type ButtonForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenButtonKeys>;
