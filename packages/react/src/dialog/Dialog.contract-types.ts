import type { DialogProps } from './Dialog';

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

type ForbiddenDialogKeys = Extract<
  keyof DialogProps,
  | 'onSubmit'
  | 'requestStatus'
  | 'state'
  | 'pending'
  | 'validation'
  | 'dirty'
  | 'dismissOnBackdrop'
  | 'showDescription'
>;

export type DialogForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenDialogKeys>;
export type DialogOpenMustRemainRequired = AssertTrue<IsRequired<DialogProps, 'open'>>;
export type DialogOnOpenChangeMustRemainRequired = AssertTrue<
  IsRequired<DialogProps, 'onOpenChange'>
>;
export type DialogTitleMustRemainRequired = AssertTrue<IsRequired<DialogProps, 'title'>>;
export type DialogChildrenMustRemainRequired = AssertTrue<IsRequired<DialogProps, 'children'>>;
export type DialogDescriptionMustRemainOptional = AssertFalse<
  IsRequired<DialogProps, 'description'>
>;
export type DialogActionsMustRemainOptional = AssertFalse<IsRequired<DialogProps, 'actions'>>;
export type DialogShowCloseMustRemainPublic = AssertTrue<HasKey<DialogProps, 'showClose'>>;
export type DialogCloseLabelMustRemainPublic = AssertTrue<HasKey<DialogProps, 'closeLabel'>>;
export type DialogInitialFocusRefMustRemainPublic = AssertTrue<
  HasKey<DialogProps, 'initialFocusRef'>
>;
