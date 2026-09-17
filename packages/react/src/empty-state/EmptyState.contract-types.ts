import type { EmptyStateProps } from './EmptyState';

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

type ForbiddenEmptyStateKeys = Extract<
  keyof EmptyStateProps,
  | 'loading'
  | 'error'
  | 'reason'
  | 'resultCount'
  | 'query'
  | 'onClear'
  | 'onRetry'
  | 'status'
  | 'tone'
  | 'state'
  | 'children'
  | 'role'
  | 'aria-live'
  | 'className'
  | 'style'
>;

export type EmptyStateForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenEmptyStateKeys>;
export type EmptyStateTitleMustRemainOptional = AssertFalse<IsRequired<EmptyStateProps, 'title'>>;
export type EmptyStateBodyMustRemainOptional = AssertFalse<IsRequired<EmptyStateProps, 'body'>>;
export type EmptyStateShowBodyMustRemainPublic = AssertTrue<HasKey<EmptyStateProps, 'showBody'>>;
export type EmptyStateIconMustRemainOptional = AssertFalse<IsRequired<EmptyStateProps, 'icon'>>;
export type EmptyStateShowIconMustRemainPublic = AssertTrue<HasKey<EmptyStateProps, 'showIcon'>>;
export type EmptyStateActionsMustRemainOptional = AssertFalse<IsRequired<EmptyStateProps, 'actions'>>;
