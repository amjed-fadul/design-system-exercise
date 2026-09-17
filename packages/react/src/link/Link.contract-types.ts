import type { LinkProps } from './Link';

type ForbiddenLinkKeys = Extract<
  keyof LinkProps,
  'state' | 'disabled' | 'visited' | 'icon' | 'size' | 'loading'
>;

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;

export type LinkForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenLinkKeys>;
export type LinkChildrenMustRemainRequired = AssertTrue<IsRequired<LinkProps, 'children'>>;
