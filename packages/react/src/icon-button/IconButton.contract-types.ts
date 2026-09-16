import type { IconButtonProps } from './IconButton';

type ForbiddenIconButtonKeys = Extract<
  keyof IconButtonProps,
  'children' | 'state' | 'focusVisible' | 'accessibleLabel' | 'loading' | 'success' | 'size'
>;

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;

export type IconButtonForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenIconButtonKeys>;
export type IconButtonIconMustRemainRequired = AssertTrue<IsRequired<IconButtonProps, 'icon'>>;
export type IconButtonAccessibleNameMustRemainRequired = AssertTrue<
  IsRequired<IconButtonProps, 'aria-label'>
>;
