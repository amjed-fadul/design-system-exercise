import type { StatusBadgeProps } from './StatusBadge';

type AssertNever<T extends never> = T;
type UnexpectedPublicKey = Exclude<keyof StatusBadgeProps, 'label'>;
type MissingRequiredPublicKey = Exclude<'label', keyof StatusBadgeProps>;

export type StatusBadgeMustExposeOnlyLabel = AssertNever<UnexpectedPublicKey>;
export type StatusBadgeMustKeepLabelRequired = AssertNever<MissingRequiredPublicKey>;
