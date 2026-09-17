import type { RadioGroupOption, RadioGroupProps } from './RadioGroup';

type ForbiddenRadioGroupKeys = Extract<
  keyof RadioGroupProps,
  | 'children'
  | 'state'
  | 'selected'
  | 'selectedValue'
  | 'showDescription'
  | 'invalid'
  | 'errorMessage'
  | 'role'
  | 'disabled'
>;

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

export type RadioGroupForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenRadioGroupKeys>;
export type RadioGroupLabelMustRemainRequired = AssertTrue<IsRequired<RadioGroupProps, 'label'>>;
export type RadioGroupNameMustRemainRequired = AssertTrue<IsRequired<RadioGroupProps, 'name'>>;
export type RadioGroupOptionsMustRemainRequired = AssertTrue<IsRequired<RadioGroupProps, 'options'>>;
export type RadioGroupOptionsMustRequireTwo = AssertTrue<
  RadioGroupProps['options'] extends readonly [
    RadioGroupOption,
    RadioGroupOption,
    ...RadioGroupOption[],
  ]
    ? true
    : false
>;
export type RadioGroupValueMustRemainPublic = AssertTrue<HasKey<RadioGroupProps, 'value'>>;
export type RadioGroupDefaultValueMustRemainPublic = AssertTrue<
  HasKey<RadioGroupProps, 'defaultValue'>
>;
export type RadioGroupOnValueChangeMustRemainPublic = AssertTrue<
  HasKey<RadioGroupProps, 'onValueChange'>
>;
export type RadioGroupRequiredMustRemainPublic = AssertTrue<HasKey<RadioGroupProps, 'required'>>;
