import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/breadcrumbs/Breadcrumbs.css');

function readCss() {
  expect(existsSync(cssPath), 'Breadcrumbs CSS source must exist').toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Breadcrumbs CSS boundary', () => {
  it('matches the reviewed HUG root and horizontal 8px geometry without adding collapse behavior', () => {
    const css = readCss();

    expect(css).toContain('.dse-breadcrumbs');
    expect(css).toMatch(/\.dse-breadcrumbs\s*\{[^}]*inline-size:\s*fit-content/);
    expect(css).toMatch(/\.dse-breadcrumbs\s*\{[^}]*max-inline-size:\s*100%/);
    expect(css).toMatch(/\.dse-breadcrumbs__list\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.dse-breadcrumbs__list\s*\{[^}]*gap:\s*var\(--dse-spacing-semantic-gap-sm\)/);
    expect(css).toMatch(/\.dse-breadcrumb-link-item\s*\{[^}]*gap:\s*var\(--dse-spacing-semantic-gap-sm\)/);
    expect(css).not.toMatch(/text-overflow:\s*ellipsis/);
    expect(css).not.toMatch(/overflow:\s*hidden/);
  });

  it('uses Label/small typography plus semantic current and separator foreground tokens', () => {
    const css = readCss();

    for (const token of [
      '--dse-typography-semantic-label-small-family',
      '--dse-typography-semantic-label-small-size',
      '--dse-typography-semantic-label-small-weight',
      '--dse-typography-semantic-label-small-line-height',
      '--dse-typography-semantic-label-small-letter-spacing',
      '--dse-color-semantic-fg-secondary',
      '--dse-color-semantic-fg-tertiary',
    ]) {
      expect(css).toContain(token);
    }
  });

  it('inherits writing direction and keeps route units on one reviewed horizontal trail', () => {
    const css = readCss();

    expect(css).not.toMatch(/direction:\s*ltr/);
    expect(css).not.toMatch(/flex-direction:\s*row-reverse/);
    expect(css).toMatch(/\.dse-breadcrumbs__list\s*\{[^}]*flex-wrap:\s*nowrap/);
    expect(css).toMatch(/\.dse-breadcrumb-link-item\s+\.dse-link\s*\{[^}]*white-space:\s*nowrap/);
    expect(css).toMatch(/\.dse-breadcrumbs__current\s*\{[^}]*white-space:\s*nowrap/);
  });
});
