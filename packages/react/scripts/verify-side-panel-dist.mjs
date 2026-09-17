import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SidePanel } from '../dist/index.js';

if (typeof SidePanel !== 'function') {
  throw new Error('Side Panel public export missing from built distribution');
}

const html = renderToStaticMarkup(
  React.createElement(
    SidePanel,
    {
      onClose: () => {},
      header: React.createElement('h2', null, 'Amira Hassan'),
      actions: React.createElement('button', null, 'Save changes'),
    },
    React.createElement('p', null, 'Member details'),
  ),
);
if (!html.includes('role="region"')) throw new Error('Side Panel region semantics missing from distribution');
if (!html.includes('MEMBER DETAILS')) throw new Error('Side Panel default eyebrow missing from distribution');
if (html.includes('aria-modal')) throw new Error('Side Panel incorrectly exposes modal semantics');
if (!html.includes('class="dse-icon-button"')) throw new Error('Side Panel governed close Icon Button missing');

const emptySlotsHtml = renderToStaticMarkup(
  React.createElement(SidePanel, { onClose: () => {}, header: null, actions: null }),
);
for (const selector of [
  'dse-side-panel__header',
  'dse-side-panel__header-divider',
  'dse-side-panel__body',
  'dse-side-panel__footer-divider',
  'dse-side-panel__actions',
]) {
  if (!emptySlotsHtml.includes(selector)) {
    throw new Error(`Side Panel structural anatomy missing ${selector} from built distribution`);
  }
}

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const selector of [
  '.dse-side-panel',
  '.dse-side-panel__top-bar',
  '.dse-side-panel__header',
  '.dse-side-panel__body',
  '.dse-side-panel__actions',
]) {
  if (!css.includes(selector)) throw new Error(`Side Panel CSS missing selector ${selector}`);
}
if (!css.includes('var(--dse-layout-primitive-detail-inline-width)')) {
  throw new Error('Side Panel 408px governed width token missing from built distribution');
}
if (!css.includes('block-size: 612px')) {
  throw new Error('Side Panel 612px default surface height missing from built distribution');
}
if (!css.includes('min-block-size: 240px')) {
  throw new Error('Side Panel 240px Body minimum missing from built distribution');
}
if (!css.includes('var(--dse-color-semantic-surface-raised)')) {
  throw new Error('Side Panel raised surface token missing from built distribution');
}
if (!css.includes('var(--dse-radius-shape-surface)')) {
  throw new Error('Side Panel surface radius token missing from built distribution');
}
if (!css.includes("url('./assets/x.svg')")) {
  throw new Error('Side Panel close icon asset reference missing from built distribution');
}

const xAssetUrl = new URL('../dist/assets/x.svg', import.meta.url);
if (!existsSync(xAssetUrl)) throw new Error('Side Panel close icon asset missing from built distribution');
