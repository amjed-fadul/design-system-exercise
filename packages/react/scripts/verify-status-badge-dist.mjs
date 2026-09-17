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
  React.createElement(StatusBadge, {
    label: 'Invitation pending',
    role: 'alert',
    'aria-live': 'assertive',
    tabIndex: 0,
    children: 'Injected',
    tone: 'positive',
  }),
);
if (!pendingHtml.includes('Invitation pending')) throw new Error('Status Badge must preserve product-supplied label text');
if (pendingHtml.includes('role=')) throw new Error('Status Badge leaked an untyped role override');
if (pendingHtml.includes('aria-live=')) throw new Error('Status Badge leaked an untyped live-region override');
if (pendingHtml.includes('tabindex=')) throw new Error('Status Badge leaked an untyped focus override');
if (pendingHtml.includes('Injected')) throw new Error('Status Badge leaked untyped children');
if (pendingHtml.includes('data-tone=')) throw new Error('Status Badge invented a tone variant');

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
if (!css.includes('padding-block: 5px')) throw new Error('Status Badge 5px block padding missing from built distribution');
if (!css.includes('padding-inline: 10px')) throw new Error('Status Badge 10px logical padding missing from built distribution');
if (!css.includes('var(--dse-color-semantic-surface-section)')) {
  throw new Error('Status Badge neutral surface token missing from built distribution');
}
if (!css.includes('var(--dse-color-semantic-fg-primary)')) {
  throw new Error('Status Badge neutral foreground token missing from built distribution');
}
if (!css.includes('var(--dse-radius-shape-surface)')) {
  throw new Error('Status Badge shape token missing from built distribution');
}
