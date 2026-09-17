import type { AvatarProps } from './Avatar';

type ForbiddenAvatarKeys = Extract<
  keyof AvatarProps,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'onClick'
  | 'aria-hidden'
  | 'src'
  | 'alt'
  | 'photo'
  | 'online'
  | 'presence'
  | 'status'
  | 'verified'
  | 'selected'
  | 'name'
  | 'href'
>;

type AssertNever<T extends never> = T;

type ExpectedPublicKeys = Extract<keyof AvatarProps, 'initials' | 'size' | 'aria-label'>;
type MissingRequiredPublicKey = Exclude<'initials' | 'size' | 'aria-label', ExpectedPublicKeys>;

export type AvatarForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenAvatarKeys>;
export type AvatarRequiredPublicKeysMustRemainPresent = AssertNever<MissingRequiredPublicKey>;
