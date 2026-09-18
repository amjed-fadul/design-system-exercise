import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactPackage from '../dist/index.js';

const { Breadcrumbs } = ReactPackage;
if (typeof Breadcrumbs !== 'function') {
  throw new Error('Breadcrumbs public export missing from built distribution');
}
if ('BreadcrumbLinkItem' in ReactPackage) {
  throw new Error('Private BreadcrumbLinkItem leaked through public distribution exports');
}

const html = renderToStaticMarkup(
  React.createElement(Breadcrumbs, {
    ancestors: [{ label: 'Workspace', href: '/workspace' }],
    currentLabel: 'Team & access',
  }),
);
if (!html.includes('<nav')) throw new Error('Breadcrumbs did not render a native nav');
if (!html.includes('aria-label="Breadcrumbs"')) throw new Error('Breadcrumbs default navigation label missing');
if (!html.includes('<ol')) throw new Error('Breadcrumbs ordered hierarchy missing');
if (!html.includes('href="/workspace"')) throw new Error('Breadcrumbs ancestor destination missing');
if (!html.includes('>Workspace</a>')) throw new Error('Breadcrumbs ancestor label missing');
if (!html.includes('aria-current="page"')) throw new Error('Breadcrumbs current location semantics missing');
if (!html.includes('Team &amp; access')) throw new Error('Breadcrumbs current label missing');
if (!html.includes('aria-hidden="true"')) throw new Error('Breadcrumbs decorative separator semantics missing');

const localizedHtml = renderToStaticMarkup(
  React.createElement(Breadcrumbs, {
    ariaLabel: 'مسار التنقل',
    ancestors: [{ label: 'مساحة العمل', href: '/workspace' }],
    currentLabel: 'الفريق والصلاحيات',
  }),
);
if (!localizedHtml.includes('aria-label="مسار التنقل"')) {
  throw new Error('Breadcrumbs localized navigation label missing');
}

for (const invalidCase of [
  { props: { ancestors: [], currentLabel: 'Team' }, pattern: /ancestor/i },
  {
    props: { ancestors: [{ label: '   ', href: '/workspace' }], currentLabel: 'Team' },
    pattern: /label/i,
  },
  {
    props: { ancestors: [{ label: 'Workspace', href: '   ' }], currentLabel: 'Team' },
    pattern: /href|destination/i,
  },
  {
    props: { ancestors: [{ label: 'Workspace', href: '/workspace' }], currentLabel: '   ' },
    pattern: /current/i,
  },
  {
    props: {
      ancestors: [{ label: 'Workspace', href: '/workspace' }],
      currentLabel: 'Team',
      ariaLabel: '   ',
    },
    pattern: /aria|navigation label/i,
  },
]) {
  let rejected = false;
  try {
    renderToStaticMarkup(React.createElement(Breadcrumbs, invalidCase.props));
  } catch (error) {
    if (error instanceof Error && invalidCase.pattern.test(error.message)) rejected = true;
    else throw error;
  }
  if (!rejected) throw new Error('Breadcrumbs accepted invalid governed content');
}

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const required of [
  '.dse-breadcrumbs',
  '.dse-breadcrumb-link-item',
  'inline-size: fit-content',
  'max-inline-size: 100%',
  'var(--dse-spacing-semantic-gap-sm)',
  'flex-wrap: nowrap',
  'white-space: nowrap',
  'var(--dse-color-semantic-fg-secondary)',
  'var(--dse-color-semantic-fg-tertiary)',
  'var(--dse-typography-semantic-label-small-family)',
]) {
  if (!css.includes(required)) throw new Error(`Breadcrumbs distributed CSS missing: ${required}`);
}
if (/text-overflow:\s*ellipsis/.test(css.match(/\.dse-breadcrumbs[^]*$/)?.[0] ?? '')) {
  throw new Error('Breadcrumbs distribution invented ellipsis behavior');
}
