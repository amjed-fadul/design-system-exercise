import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactPackage from '../dist/index.js';

const { PageHeading } = ReactPackage;
if (typeof PageHeading !== 'function') {
  throw new Error('PageHeading public export missing from built distribution');
}

const html = renderToStaticMarkup(
  React.createElement(PageHeading, {
    title: 'Team members',
    description: 'Manage members and pending invitations in your workspace.',
    breadcrumbs: React.createElement('nav', { 'aria-label': 'Breadcrumbs' }, 'Team & access'),
    actions: React.createElement('button', { type: 'button' }, 'Invite member'),
  }),
);
if (!html.includes('class="dse-page-heading"')) throw new Error('PageHeading root class missing');
if (!html.includes('<h1')) throw new Error('PageHeading did not render a native h1');
if (!html.includes('Team members')) throw new Error('PageHeading title missing');
if (!html.includes('Manage members and pending invitations')) throw new Error('PageHeading description missing');
if (!html.includes('aria-label="Breadcrumbs"')) throw new Error('PageHeading Breadcrumbs composition missing');
if (!html.includes('Invite member')) throw new Error('PageHeading Actions composition missing');

const hiddenDescriptionHtml = renderToStaticMarkup(
  React.createElement(PageHeading, {
    title: 'Team members',
    description: 'Hide me',
    showDescription: false,
  }),
);
if (hiddenDescriptionHtml.includes('Hide me')) {
  throw new Error('PageHeading rendered description while showDescription=false');
}

let blankTitleRejected = false;
try {
  renderToStaticMarkup(React.createElement(PageHeading, { title: '   ' }));
} catch (error) {
  if (error instanceof Error && /title/i.test(error.message)) blankTitleRejected = true;
  else throw error;
}
if (!blankTitleRejected) throw new Error('PageHeading accepted a blank title');

let threeActionsRejected = false;
try {
  renderToStaticMarkup(
    React.createElement(PageHeading, {
      title: 'Team members',
      actions: React.createElement(
        React.Fragment,
        null,
        React.createElement('button', { type: 'button' }, 'One'),
        React.createElement('button', { type: 'button' }, 'Two'),
        React.createElement('button', { type: 'button' }, 'Three'),
      ),
    }),
  );
} catch (error) {
  if (error instanceof Error && /actions/i.test(error.message)) threeActionsRejected = true;
  else throw error;
}
if (!threeActionsRejected) throw new Error('PageHeading accepted more than two rendered Actions children');

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
for (const required of [
  '.dse-page-heading',
  'inline-size: 100%',
  'gap: 10px',
  'justify-content: space-between',
  'gap: 4px',
  'gap: 12px',
  'var(--dse-color-semantic-fg-primary)',
  'var(--dse-color-semantic-fg-secondary)',
  'var(--dse-typography-semantic-headline-page-family)',
  'var(--dse-typography-semantic-body-small-family)',
]) {
  if (!css.includes(required)) throw new Error(`PageHeading distributed CSS missing: ${required}`);
}
const rowBlock = css.match(/\.dse-page-heading__row\s*\{[^}]*\}/)?.[0] ?? '';
if (/gap:\s*24px/.test(rowBlock)) {
  throw new Error('PageHeading distributed CSS incorrectly activates the inactive Figma 24px row spacing');
}
