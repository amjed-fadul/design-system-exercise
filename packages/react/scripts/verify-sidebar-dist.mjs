import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactPackage from '../dist/index.js';

const { Sidebar } = ReactPackage;
if (typeof Sidebar !== 'function') {
  throw new Error('Sidebar public export missing from built distribution');
}
if ('NavigationItem' in ReactPackage) {
  throw new Error('Private NavigationItem leaked through public package exports');
}

const icon = React.createElement('svg', { viewBox: '0 0 20 20', 'aria-hidden': 'true' });
const items = [
  { id: 'overview', label: 'Overview', href: '/overview', icon },
  { id: 'team', label: 'Team & access', href: '/team', icon },
];

const expandedHtml = renderToStaticMarkup(
  React.createElement(Sidebar, {
    items,
    currentId: 'team',
    footer: React.createElement('span', null, 'Acme workspace'),
  }),
);
if (!expandedHtml.includes('<nav')) throw new Error('Sidebar did not render a native nav');
if (!expandedHtml.includes('class="dse-sidebar"')) throw new Error('Sidebar root class missing');
if (!expandedHtml.includes('aria-label="WORKSPACE"')) throw new Error('Sidebar default accessible label missing');
if (!expandedHtml.includes('data-mode="expanded"')) throw new Error('Sidebar default expanded mode missing');
if (!expandedHtml.includes('href="/overview"')) throw new Error('Sidebar first native destination missing');
if (!expandedHtml.includes('href="/team"')) throw new Error('Sidebar current native destination missing');
if (!expandedHtml.includes('aria-current="page"')) throw new Error('Sidebar current-route semantics missing');
if (!expandedHtml.includes('Team &amp; access')) throw new Error('Sidebar destination label missing');
if (!expandedHtml.includes('dse-sidebar__footer')) throw new Error('Sidebar expanded footer missing');

const compactHtml = renderToStaticMarkup(
  React.createElement(Sidebar, {
    mode: 'compact',
    label: 'Workspace navigation',
    items,
    currentId: 'overview',
    footer: React.createElement('span', null, 'Should not render'),
  }),
);
if (!compactHtml.includes('data-mode="compact"')) throw new Error('Sidebar compact mode missing');
if (!compactHtml.includes('aria-label="Workspace navigation"')) throw new Error('Sidebar compact accessible name missing');
if (!compactHtml.includes('Overview')) throw new Error('Sidebar compact destination accessible text missing');
if (compactHtml.includes('dse-sidebar__footer')) throw new Error('Sidebar rendered footer in compact mode');

for (const props of [
  { items: [], currentId: 'overview' },
  { items, currentId: 'missing' },
]) {
  let rejected = false;
  try {
    renderToStaticMarkup(React.createElement(Sidebar, props));
  } catch (error) {
    if (error instanceof Error && /Sidebar/i.test(error.message)) rejected = true;
    else throw error;
  }
  if (!rejected) throw new Error('Sidebar accepted an invalid governed boundary');
}

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const required of [
  '.dse-sidebar',
  '.dse-navigation-item',
  'var(--dse-layout-primitive-nav-expanded)',
  'var(--dse-layout-primitive-nav-compact)',
  'var(--dse-color-semantic-surface-section)',
  'var(--dse-color-semantic-border-subtle)',
  'var(--dse-border-role-divider)',
  'var(--dse-spacing-semantic-gap-sm)',
  'var(--dse-spacing-primitive-space-700)',
  'var(--dse-spacing-primitive-space-800)',
  'var(--dse-color-semantic-state-selected)',
  'var(--dse-color-semantic-focus-default)',
]) {
  if (!css.includes(required)) throw new Error(`Sidebar distributed CSS missing: ${required}`);
}
