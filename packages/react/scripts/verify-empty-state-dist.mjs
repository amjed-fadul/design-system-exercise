import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmptyState } from '../dist/index.js';

if (typeof EmptyState !== 'function') {
  throw new Error('Empty State public export missing from built distribution');
}

const defaultHtml = renderToStaticMarkup(React.createElement(EmptyState));
if (!defaultHtml.includes('<section')) throw new Error('Empty State did not render a section');
if (!defaultHtml.includes('class="dse-empty-state"')) throw new Error('Empty State root class missing');
if (!defaultHtml.includes('aria-labelledby=')) throw new Error('Empty State accessible-name binding missing');
if (!defaultHtml.includes('aria-describedby=')) throw new Error('Empty State body description binding missing');
if (!defaultHtml.includes('role="status"')) throw new Error('Empty State polite status semantics missing');
if (!defaultHtml.includes('aria-atomic="true"')) throw new Error('Empty State atomic status semantics missing');
if (!defaultHtml.includes('No people found')) throw new Error('Empty State default title missing');
if (!defaultHtml.includes('No names or email addresses match')) throw new Error('Empty State default body missing');
if (!defaultHtml.includes('aria-hidden="true"')) throw new Error('Empty State decorative icon semantics missing');
if (!defaultHtml.includes('dse-empty-state__default-icon')) throw new Error('Empty State default search icon missing');
if (defaultHtml.includes('dse-empty-state__actions')) throw new Error('Empty State invented default actions');

const compactHtml = renderToStaticMarkup(
  React.createElement(EmptyState, {
    title: 'Nothing saved yet',
    showIcon: false,
    showBody: false,
    actions: React.createElement('button', null, 'Create a view'),
  }),
);
if (!compactHtml.includes('Nothing saved yet')) throw new Error('Empty State custom title missing');
if (compactHtml.includes('dse-empty-state__icon')) throw new Error('Empty State ignored showIcon=false');
if (compactHtml.includes('dse-empty-state__body')) throw new Error('Empty State ignored showBody=false');
if (!compactHtml.includes('dse-empty-state__actions')) throw new Error('Empty State actions region missing');
if (!compactHtml.includes('Create a view')) throw new Error('Empty State authored action missing');

const lockedHtml = renderToStaticMarkup(
  React.createElement(EmptyState, {
    loading: true,
    error: 'Failed',
    resultCount: 0,
    query: 'zoe',
    role: 'alert',
    'aria-live': 'assertive',
    children: React.createElement('span', null, 'Injected child'),
  }),
);
if (lockedHtml.includes('role="alert"')) throw new Error('Empty State leaked an untyped root role override');
if (lockedHtml.includes('aria-live="assertive"')) throw new Error('Empty State leaked an untyped live-region override');
if (lockedHtml.includes('Injected child')) throw new Error('Empty State leaked untyped children');
if (lockedHtml.includes('data-loading')) throw new Error('Empty State invented loading state');
if (lockedHtml.includes('data-error')) throw new Error('Empty State invented error state');
if (lockedHtml.includes('data-result-count')) throw new Error('Empty State invented result-count state');
if (lockedHtml.includes('data-query')) throw new Error('Empty State invented query state');

for (const invalidProps of [{ title: '   ' }, { body: '   ' }]) {
  let rejected = false;
  try {
    renderToStaticMarkup(React.createElement(EmptyState, invalidProps));
  } catch (error) {
    if (error instanceof Error && /non-empty (title|body)/i.test(error.message)) rejected = true;
    else throw error;
  }
  if (!rejected) throw new Error('Empty State accepted invalid visible copy');
}

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
if (!css.includes('.dse-empty-state')) throw new Error('Empty State CSS missing from built distribution');
if (!css.includes('min-block-size: 440px')) throw new Error('Empty State 440px minimum geometry missing');
if (!css.includes('max-inline-size: 680px')) throw new Error('Empty State 680px content cap missing');
if (!css.includes('var(--dse-spacing-primitive-space-300)')) throw new Error('Empty State 12px spacing token missing');
if (!css.includes('var(--dse-icons-size-lg)')) throw new Error('Empty State 24px icon token missing');
if (!css.includes('var(--dse-color-semantic-fg-tertiary)')) throw new Error('Empty State muted icon tone missing');
if (!css.includes('var(--dse-typography-semantic-title-component-family)')) throw new Error('Empty State title typography missing');
if (!css.includes('var(--dse-typography-semantic-body-small-family)')) throw new Error('Empty State body typography missing');
