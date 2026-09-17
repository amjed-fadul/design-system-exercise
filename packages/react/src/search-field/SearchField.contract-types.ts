import type { SearchFieldProps } from './SearchField';

type ForbiddenSearchFieldKeys = Extract<
  keyof SearchFieldProps,
  | 'state'
  | 'content'
  | 'size'
  | 'children'
  | 'type'
  | 'invalid'
  | 'aria-invalid'
  | 'loading'
  | 'results'
  | 'resultCount'
  | 'suggestions'
  | 'selectedPerson'
  | 'debounce'
>;

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

export type SearchFieldForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenSearchFieldKeys>;
export type SearchFieldAccessibleNameMustRemainRequired = AssertTrue<
  IsRequired<SearchFieldProps, 'aria-label'>
>;
export type SearchFieldClearButtonLabelMustRemainRequired = AssertTrue<
  IsRequired<SearchFieldProps, 'clearButtonLabel'>
>;
export type SearchFieldOnClearMustRemainPublic = AssertTrue<HasKey<SearchFieldProps, 'onClear'>>;
export type SearchFieldOnClearMustRemainOptional = AssertFalse<
  IsRequired<SearchFieldProps, 'onClear'>
>;
export type SearchFieldValueMustRemainNative = AssertTrue<HasKey<SearchFieldProps, 'value'>>;
export type SearchFieldDefaultValueMustRemainNative = AssertTrue<
  HasKey<SearchFieldProps, 'defaultValue'>
>;
export type SearchFieldOnChangeMustRemainNative = AssertTrue<HasKey<SearchFieldProps, 'onChange'>>;
export type SearchFieldPlaceholderMustRemainNative = AssertTrue<
  HasKey<SearchFieldProps, 'placeholder'>
>;
export type SearchFieldDisabledMustRemainNative = AssertTrue<HasKey<SearchFieldProps, 'disabled'>>;
