import type { ButtonProps } from './Button';

type ForbiddenButtonKeys = Extract<
  keyof ButtonProps,
  'state' | 'focusVisible' | 'showIcon' | 'size' | 'danger' | 'success'
>;

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;

export type ButtonForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenButtonKeys>;
export type ButtonChildrenMustRemainRequired = AssertTrue<IsRequired<ButtonProps, 'children'>>;
