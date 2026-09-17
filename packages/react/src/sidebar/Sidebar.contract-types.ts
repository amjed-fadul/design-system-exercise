import type { SidebarItem, SidebarProps } from './Sidebar';

type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

type ForbiddenSidebarKeys = Extract<
  keyof SidebarProps,
  | 'children'
  | 'navigation'
  | 'state'
  | 'selected'
  | 'collapsed'
  | 'open'
  | 'placement'
  | 'breakpoint'
  | 'onNavigate'
  | 'routeConfig'
  | 'role'
  | 'className'
  | 'style'
>;

export type SidebarForbiddenPropsMustRemainAbsent = AssertNever<ForbiddenSidebarKeys>;
export type SidebarModeMustRemainOptional = AssertFalse<IsRequired<SidebarProps, 'mode'>>;
export type SidebarLabelMustRemainOptional = AssertFalse<IsRequired<SidebarProps, 'label'>>;
export type SidebarItemsMustRemainRequired = AssertTrue<IsRequired<SidebarProps, 'items'>>;
export type SidebarCurrentIdMustRemainRequired = AssertTrue<IsRequired<SidebarProps, 'currentId'>>;
export type SidebarFooterMustRemainOptional = AssertFalse<IsRequired<SidebarProps, 'footer'>>;

export type SidebarItemIdMustRemainPublic = AssertTrue<HasKey<SidebarItem, 'id'>>;
export type SidebarItemLabelMustRemainPublic = AssertTrue<HasKey<SidebarItem, 'label'>>;
export type SidebarItemHrefMustRemainPublic = AssertTrue<HasKey<SidebarItem, 'href'>>;
export type SidebarItemIconMustRemainPublic = AssertTrue<HasKey<SidebarItem, 'icon'>>;
