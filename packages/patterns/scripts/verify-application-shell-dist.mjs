import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PageHeading, Sidebar, TopNavbar } from '@design-system-exercise/react';
import { ApplicationShell } from '../dist/index.js';

if (typeof ApplicationShell !== 'function') {
  throw new Error('ApplicationShell public export missing from packed distribution');
}

const sidebar = React.createElement(Sidebar, {
  items: [
    {
      id: 'overview',
      label: 'Overview',
      href: '#overview',
      icon: React.createElement('span', { 'aria-hidden': true }, '•'),
    },
  ],
  currentId: 'overview',
});

const html = renderToStaticMarkup(
  React.createElement(
    ApplicationShell,
    {
      sidebar,
      topNavbar: React.createElement(TopNavbar),
      pageHeading: React.createElement(PageHeading, { title: 'Overview' }),
    },
    React.createElement('p', null, 'Pattern content'),
  ),
);

for (const required of [
  'class="dse-application-shell"',
  '<header',
  '<nav',
  '<main',
  'data-mode="expanded"',
  'data-layout="wide"',
  'Pattern content',
]) {
  if (!html.includes(required)) {
    throw new Error(`ApplicationShell packed SSR evidence missing: ${required}`);
  }
}

const stylesUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(stylesUrl)) throw new Error('ApplicationShell packaged stylesheet missing');

const css = readFileSync(stylesUrl, 'utf8');
for (const required of [
  '.dse-application-shell',
  '--dse-layout-semantic-top-height',
  '--dse-layout-semantic-page-inset',
  '--dse-layout-semantic-region-gap',
  'overflow: auto',
]) {
  if (!css.includes(required)) {
    throw new Error(`ApplicationShell packaged stylesheet drifted: ${required}`);
  }
}
