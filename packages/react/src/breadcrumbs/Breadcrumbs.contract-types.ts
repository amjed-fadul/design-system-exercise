import type { BreadcrumbAncestor, BreadcrumbsProps } from './Breadcrumbs';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type ExpectedBreadcrumbAncestor = {
  label: string;
  href: string;
};

type ExpectedBreadcrumbsProps = {
  ancestors: readonly BreadcrumbAncestor[];
  currentLabel: string;
  ariaLabel?: string;
};

type _BreadcrumbAncestorApi = Expect<Equal<BreadcrumbAncestor, ExpectedBreadcrumbAncestor>>;
type _BreadcrumbsPublicApi = Expect<Equal<BreadcrumbsProps, ExpectedBreadcrumbsProps>>;

// @ts-expect-error generic children are not part of the governed hierarchy API.
const forbiddenChildren: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', children: 'Extra' };
// @ts-expect-error separator is fixed decorative anatomy.
const forbiddenSeparator: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', separator: '>' };
// @ts-expect-error collapse is not established by the reviewed source.
const forbiddenCollapse: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', collapse: true };
// @ts-expect-error overflow behavior is deliberately not invented.
const forbiddenOverflow: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', overflow: true };
// @ts-expect-error current route remains plain text and has no href API.
const forbiddenCurrentHref: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', currentHref: '/team' };
// @ts-expect-error theme is inherited from semantic tokens.
const forbiddenTheme: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', theme: 'dark' };
// @ts-expect-error native/class styling is deliberately not forwarded.
const forbiddenClassName: BreadcrumbsProps = { ancestors: [], currentLabel: 'Team', className: 'custom' };

void forbiddenChildren;
void forbiddenSeparator;
void forbiddenCollapse;
void forbiddenOverflow;
void forbiddenCurrentHref;
void forbiddenTheme;
void forbiddenClassName;
