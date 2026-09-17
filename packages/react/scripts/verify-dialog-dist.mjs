import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Dialog } from '../dist/index.js';

if (typeof Dialog !== 'function') {
  throw new Error('Dialog public export missing from built distribution');
}

const closedHtml = renderToStaticMarkup(
  React.createElement(Dialog, {
    open: false,
    onOpenChange: () => {},
    title: 'Invite a member',
    description: 'Send an invitation to join Northstar.',
    children: React.createElement('p', null, 'Body'),
  }),
);
if (closedHtml !== '') throw new Error('Closed Dialog must not emit surface markup during SSR');

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const selector of [
  '.dse-dialog__backdrop',
  '.dse-dialog__surface',
  '.dse-dialog__header',
  '.dse-dialog__body',
  '.dse-dialog__actions',
]) {
  if (!css.includes(selector)) throw new Error(`Dialog CSS missing selector ${selector}`);
}
if (!css.includes('max-inline-size: 520px')) {
  throw new Error('Dialog 520px surface geometry missing from built distribution');
}
if (!css.includes('var(--dse-color-semantic-surface-overlay)')) {
  throw new Error('Dialog modal backdrop token missing from built distribution');
}
if (!css.includes('var(--dse-color-semantic-surface-elevated)')) {
  throw new Error('Dialog elevated surface token missing from built distribution');
}
if (!css.includes('var(--dse-radius-shape-overlay)')) {
  throw new Error('Dialog overlay radius token missing from built distribution');
}
if (!css.includes("url('./assets/x.svg')")) {
  throw new Error('Dialog close icon asset reference missing from built distribution');
}

const xAssetUrl = new URL('../dist/assets/x.svg', import.meta.url);
if (!existsSync(xAssetUrl)) throw new Error('Dialog close icon asset missing from built distribution');
