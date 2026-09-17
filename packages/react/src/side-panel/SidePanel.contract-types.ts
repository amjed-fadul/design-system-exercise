import type { SidePanelProps } from './SidePanel';

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

type ForbiddenSidePanelKeys = Extract<
  keyof SidePanelProps,
  | 'open'
  | 'onOpenChange'
  | 'modal'
  | 'ariaModal'
  | 'dismissOnBackdrop'
  | 'initialFocusRef'
  | 'trapFocus'
  | 'restoreFocus'
  | 'escapeToClose'
  | 'requestStatus'
  | 'state'
  | 'pending'
  | 'validation'
  | 'dirty'
  | 'showHeader'
  | 'size'
>;

export type SidePanelForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenSidePanelKeys>;
export type SidePanelOnCloseMustRemainRequired = AssertTrue<
  IsRequired<SidePanelProps, 'onClose'>
>;
export type SidePanelEyebrowMustRemainOptional = AssertFalse<
  IsRequired<SidePanelProps, 'eyebrow'>
>;
export type SidePanelHeaderMustRemainOptional = AssertFalse<
  IsRequired<SidePanelProps, 'header'>
>;
export type SidePanelChildrenMustRemainOptional = AssertFalse<
  IsRequired<SidePanelProps, 'children'>
>;
export type SidePanelActionsMustRemainOptional = AssertFalse<
  IsRequired<SidePanelProps, 'actions'>
>;
export type SidePanelShowCloseMustRemainPublic = AssertTrue<
  HasKey<SidePanelProps, 'showClose'>
>;
export type SidePanelCloseLabelMustRemainPublic = AssertTrue<
  HasKey<SidePanelProps, 'closeLabel'>
>;
export type SidePanelClassNameMustRemainPublic = AssertTrue<
  HasKey<SidePanelProps, 'className'>
>;
export type SidePanelStyleMustRemainPublic = AssertTrue<HasKey<SidePanelProps, 'style'>>;
