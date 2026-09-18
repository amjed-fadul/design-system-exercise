import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactPackage from '../dist/index.js';

const { TopNavbar } = ReactPackage;
if (typeof TopNavbar !== 'function') {
  throw new Error('TopNavbar public export missing from built distribution');
}

const html = renderToStaticMarkup(
  React.createElement(TopNavbar, {
    brand: React.createElement('span', null, 'Northstar'),
    account: React.createElement('span', null, 'Amal Hassan · Admin'),
  }),
);
if (!html.includes('<header')) throw new Error('TopNavbar did not render a native header');
if (!html.includes('class="dse-top-navbar"')) throw new Error('TopNavbar root class missing');
if (!html.includes('data-order="forward"')) throw new Error('TopNavbar forward DOM composition marker missing');
if (!html.includes('Workspace administration')) throw new Error('TopNavbar default context missing');
if (!html.includes('Northstar')) throw new Error('TopNavbar Brand content missing');
if (!html.includes('Amal Hassan · Admin')) throw new Error('TopNavbar Account content missing');
if (/dse-top-navbar__brand"[^>]*dir=/.test(html)) {
  throw new Error('TopNavbar Brand slot unexpectedly forced direction');
}
if (/dse-top-navbar__account"[^>]*dir=/.test(html)) {
  throw new Error('TopNavbar Account slot unexpectedly forced direction');
}

const hiddenContextHtml = renderToStaticMarkup(
  React.createElement(TopNavbar, {
    brand: React.createElement('span', null, 'Northstar'),
    account: React.createElement('span', null, 'Account'),
    showContext: false,
  }),
);
if (hiddenContextHtml.includes('dse-top-navbar__context')) {
  throw new Error('TopNavbar rendered context while showContext=false');
}

let blankContextRejected = false;
try {
  renderToStaticMarkup(React.createElement(TopNavbar, { contextLabel: '   ' }));
} catch (error) {
  if (error instanceof Error && /context/i.test(error.message)) blankContextRejected = true;
  else throw error;
}
if (!blankContextRejected) throw new Error('TopNavbar accepted a blank visible context label');

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const forbidden of ['direction: ltr', 'flex-direction: row-reverse']) {
  if (css.includes(forbidden)) {
    throw new Error(`TopNavbar distributed CSS must inherit logical direction; found: ${forbidden}`);
  }
}

for (const required of [
  '.dse-top-navbar',
  'block-size: 64px',
  'inline-size: 100%',
  'gap: 20px',
  'var(--dse-color-semantic-surface-default)',
  'var(--dse-color-semantic-border-subtle)',
  'var(--dse-typography-semantic-body-small-family)',
]) {
  if (!css.includes(required)) throw new Error(`TopNavbar distributed CSS missing: ${required}`);
}
