import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar } from '../dist/index.js';

if (typeof Avatar !== 'function') {
  throw new Error('Avatar public export missing from built distribution');
}

const decorativeHtml = renderToStaticMarkup(React.createElement(Avatar, { initials: 'AF' }));
if (!decorativeHtml.includes('class="dse-avatar"')) throw new Error('Avatar root class missing');
if (!decorativeHtml.includes('data-size="sm"')) throw new Error('Avatar default sm size missing');
if (!decorativeHtml.includes('data-content="initials"')) throw new Error('Avatar initials content mapping missing');
if (!decorativeHtml.includes('aria-hidden="true"')) throw new Error('Avatar decorative semantics missing');
if (!decorativeHtml.includes('>AF</span>')) throw new Error('Avatar initials missing');

const fallbackHtml = renderToStaticMarkup(React.createElement(Avatar, {}));
if (!fallbackHtml.includes('data-content="fallback"')) throw new Error('Avatar fallback mapping missing');
if (!fallbackHtml.includes('>@</span>')) throw new Error('Avatar governed fallback glyph missing');

const labeledHtml = renderToStaticMarkup(
  React.createElement(Avatar, { initials: 'AF', size: 'lg', 'aria-label': 'Amjed Fadul' }),
);
if (!labeledHtml.includes('data-size="lg"')) throw new Error('Avatar lg size missing');
if (!labeledHtml.includes('role="img"')) throw new Error('Avatar labeled image-like semantics missing');
if (!labeledHtml.includes('aria-label="Amjed Fadul"')) throw new Error('Avatar labeled accessible name missing');
if (labeledHtml.includes('aria-hidden')) throw new Error('Avatar labeled form must not stay aria-hidden');

const cssUrl = new URL('../dist/styles.css', import.meta.url);
if (!existsSync(cssUrl)) throw new Error('React distribution stylesheet missing');
const css = readFileSync(cssUrl, 'utf8');
if (!css.includes('.dse-avatar')) throw new Error('Avatar CSS missing from built distribution');
if (!css.includes(".dse-avatar[data-size='lg']")) throw new Error('Avatar lg CSS missing from built distribution');
