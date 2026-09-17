import type { ReactNode } from 'react';
import type { TopNavbarProps } from './TopNavbar';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type ExpectedTopNavbarProps = {
  brand?: ReactNode;
  contextLabel?: string;
  showContext?: boolean;
  account?: ReactNode;
};

type _TopNavbarPublicApi = Expect<Equal<TopNavbarProps, ExpectedTopNavbarProps>>;

// @ts-expect-error order is a Figma render selector, not a public runtime option.
const forbiddenOrder: TopNavbarProps = { order: 'forward' };
// @ts-expect-error theme is inherited from semantic tokens.
const forbiddenTheme: TopNavbarProps = { theme: 'dark' };
// @ts-expect-error page-specific task actions do not belong to Top Navbar.
const forbiddenActions: TopNavbarProps = { actions: 'Save' };
// @ts-expect-error account menu behavior is product-owned.
const forbiddenAccountMenu: TopNavbarProps = { accountMenu: true };
// @ts-expect-error native/class styling is deliberately not forwarded.
const forbiddenClassName: TopNavbarProps = { className: 'custom' };

void forbiddenOrder;
void forbiddenTheme;
void forbiddenActions;
void forbiddenAccountMenu;
void forbiddenClassName;
