import type { TextFieldProps } from './TextField';

type ForbiddenTextFieldKeys = Extract<
  keyof TextFieldProps,
  'state' | 'content' | 'size' | 'showSupportingText' | 'children'
>;

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;

type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

export type TextFieldForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenTextFieldKeys>;
export type TextFieldLabelMustRemainRequired = AssertTrue<IsRequired<TextFieldProps, 'label'>>;
export type TextFieldSupportingTextMustRemainPublic = AssertTrue<
  HasKey<TextFieldProps, 'supportingText'>
>;
export type TextFieldInvalidMustRemainPublic = AssertTrue<HasKey<TextFieldProps, 'invalid'>>;
export type TextFieldErrorMessageMustRemainPublic = AssertTrue<
  HasKey<TextFieldProps, 'errorMessage'>
>;
export type TextFieldInvalidMustRemainOptional = AssertFalse<
  IsRequired<TextFieldProps, 'invalid'>
>;
