import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatusBadge } from '../dist/index.js';

if (typeof StatusBadge !== 'function') {
  throw new Error('Status Badge public export missing from built distribution');
}

const activeHtml = renderToStaticMarkup(React.createElement(StatusBadge, { label: 'Active' }));
if (!activeHtml.includes('<span')) throw new Error('Status Badge did not render a native span');
if (!activeHtml.includes('class="dse-status-badge"')) throw new Error('Status Badge root class missing');
if (!activeHtml.includes('>Active</span>')) throw new Error('Status Badge visible label missing');
if (activeHtml.includes('role=')) throw new Error('Status Badge must not invent an ARIA role');
if (activeHtml.includes('aria-live=')) throw new Error('Status Badge must not create a live region');
if (activeHtml.includes('tabindex=')) throw new Error('Status Badge must not become focusable');

const pendingHtml = renderToStaticMarkup(
  React.createElement(StatusBadge, { label: 'Invitation pending', dir: 'rtl', 'data-testid': 'status' }),
);
if (!pendingHtml.includes('Invitation pending')) throw new Error('Status Badge must preserve product-supplied label text');
if (!pendingHtml.includes('dir="rtl"')) throw new Error('Status Badge ordinary span attributes are not forwarded');
if (!pendingHtml.includes('data-testid="status"')) throw new Error('Status Badge data attributes are not forwarded');

let rejectedWhitespace = false;
try {
  renderToStaticMarkup(React.createElement(StatusBadge, { label: '   ' }));
} catch (error) {
  if (error instanceof Error && /non-empty label/i.test(error.message)) rejectedWhitespace = true;
  else throw error;
}
if (!rejectedWhitespace) throw new Error('Status Badge accepted a whitespace-only label');

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
if (!css.includes('.dse-status-badge')) throw new Error('Status Badge CSS missing from built distribution');
if (!css.includes('block-size: 28px')) throw new Error('Status Badge 28px geometry missing from built distribution');
if (!css.includes('padding-inline: var(--dse-spacing-primitive-space-200)')) {
  throw new Error('Status Badge logical padding missing from built distribution');
}
if (!css.includes('var(--dse-color-semantic-surface-section)')) {
  throw new Error('Status Badge neutral surface token missing from built distribution');
}
if (!css.includes('var(--dse-color-semantic-fg-secondary)')) {
  throw new Error('Status Badge neutral foreground token missing from built distribution');
}
