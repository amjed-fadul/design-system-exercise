import type { ReactNode } from 'react';
import type { PageHeadingProps } from './PageHeading';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type ExpectedPageHeadingProps = {
  title: string;
  description?: string;
  showDescription?: boolean;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
};

type _PageHeadingPublicApi = Expect<Equal<PageHeadingProps, ExpectedPageHeadingProps>>;

// @ts-expect-error heading level is fixed to the page h1 contract.
const forbiddenHeadingLevel: PageHeadingProps = { title: 'Team members', headingLevel: 2 };
// @ts-expect-error Search Field composition is outside Page Heading.
const forbiddenSearch: PageHeadingProps = { title: 'Team members', search: 'Search' };
// @ts-expect-error navigation is owned by the application shell.
const forbiddenNavigation: PageHeadingProps = { title: 'Team members', navigation: 'Primary' };
// @ts-expect-error theme is inherited from semantic tokens.
const forbiddenTheme: PageHeadingProps = { title: 'Team members', theme: 'dark' };
// @ts-expect-error generic children are not part of the governed composition API.
const forbiddenChildren: PageHeadingProps = { title: 'Team members', children: 'Extra' };
// @ts-expect-error native/class styling is deliberately not forwarded.
const forbiddenClassName: PageHeadingProps = { title: 'Team members', className: 'custom' };

void forbiddenHeadingLevel;
void forbiddenSearch;
void forbiddenNavigation;
void forbiddenTheme;
void forbiddenChildren;
void forbiddenClassName;
