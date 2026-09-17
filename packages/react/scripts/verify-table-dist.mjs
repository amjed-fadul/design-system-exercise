import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactPackage from '../dist/index.js';

const { Table } = ReactPackage;
if (typeof Table !== 'function') {
  throw new Error('Table public export missing from built distribution');
}
if ('TableHeader' in ReactPackage || 'TableRow' in ReactPackage) {
  throw new Error('Private Table helper leaked through public distribution exports');
}

const rows = [
  {
    id: 'sara',
    primary: 'Sara Ahmed',
    secondary: 'Admin',
    status: 'Active',
    action: React.createElement('button', { type: 'button', 'aria-label': 'View Sara Ahmed details' }, 'View'),
    selected: true,
  },
];

const html = renderToStaticMarkup(
  React.createElement(Table, {
    rows,
    footerText: '1 person shown',
  }),
);

for (const required of [
  '<table',
  '<thead',
  '<tbody',
  '<tfoot',
  'scope="col"',
  '>Person</th>',
  '>Role</th>',
  '>Status</th>',
  '>Details</th>',
  'data-selected="true"',
  '1 person shown',
  'aria-label="View Sara Ahmed details"',
]) {
  if (!html.includes(required)) throw new Error(`Table semantic distribution missing: ${required}`);
}
if (!/colspan="4"/i.test(html)) throw new Error('Table footer did not span all four columns');
if (html.includes('role="grid"')) throw new Error('Table distribution invented data-grid semantics');
if (html.includes('aria-selected=')) throw new Error('Table selected row invented grid/listbox selection semantics');
if (html.includes('type="checkbox"')) throw new Error('Table distribution invented bulk-selection checkbox');

const noFooterHtml = renderToStaticMarkup(React.createElement(Table, { rows }));
if (noFooterHtml.includes('<tfoot')) throw new Error('Table rendered a footer without supplied footerText');

for (const invalidCase of [
  { props: { rows: [] }, pattern: /1|one|row/i },
  {
    props: { rows: [{ ...rows[0], id: '   ' }] },
    pattern: /id/i,
  },
  {
    props: { rows: [{ ...rows[0], id: 'same' }, { ...rows[0], id: 'same' }] },
    pattern: /unique|duplicate|id/i,
  },
  {
    props: { rows, primaryLabel: '   ' },
    pattern: /label/i,
  },
]) {
  let rejected = false;
  try {
    renderToStaticMarkup(React.createElement(Table, invalidCase.props));
  } catch (error) {
    if (error instanceof Error && invalidCase.pattern.test(error.message)) rejected = true;
    else throw error;
  }
  if (!rejected) throw new Error('Table accepted invalid governed content');
}

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const required of [
  '.dse-table-shell',
  '.dse-table__header-cell',
  '.dse-table__row',
  'min-inline-size: 736px',
  'table-layout: fixed',
  'inline-size: 124px',
  'inline-size: 184px',
  'inline-size: 156px',
  'var(--dse-color-semantic-state-hover)',
  'var(--dse-color-semantic-state-selected)',
  'var(--dse-typography-semantic-label-default-family)',
  'var(--dse-typography-semantic-caption-default-family)',
]) {
  if (!css.includes(required)) throw new Error(`Table distributed CSS missing: ${required}`);
}
