import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/status-badge/StatusBadge.css');

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Status Badge visual contract', () => {
  it('matches the exact Figma height and logical padding while width remains content-driven', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-status-badge\s*\{[^}]*block-size:\s*28px;/s);
    expect(css).toMatch(/padding-block:\s*5px/);
    expect(css).toMatch(/padding-inline:\s*10px/);
    expect(css).not.toMatch(/inline-size:\s*\d+px/);
    expect(css).not.toContain('padding-left');
    expect(css).not.toContain('padding-right');
  });

  it('uses only the neutral Figma semantic surface, foreground, shape, and label/small typography bindings', () => {
    const css = readCss();

    for (const token of [
      '--dse-color-semantic-surface-section',
      '--dse-color-semantic-fg-primary',
      '--dse-radius-shape-surface',
      '--dse-typography-semantic-label-small-family',
      '--dse-typography-semantic-label-small-size',
      '--dse-typography-semantic-label-small-weight',
      '--dse-typography-semantic-label-small-line-height',
      '--dse-typography-semantic-label-small-letter-spacing',
    ]) {
      expect(css).toContain(`var(${token})`);
    }
  });

  it('keeps the compact label on one line and direction-independent', () => {
    const css = readCss();

    expect(css).toMatch(/display:\s*inline-flex/);
    expect(css).toMatch(/align-items:\s*center/);
    expect(css).toMatch(/white-space:\s*nowrap/);
    expect(css).not.toContain('margin-left');
    expect(css).not.toContain('margin-right');
  });
});
