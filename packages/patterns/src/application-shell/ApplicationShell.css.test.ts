import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  fileURLToPath(new URL('./ApplicationShell.css', import.meta.url)),
  'utf8',
);

describe('ApplicationShell CSS boundary', () => {
  it('uses governed semantic layout tokens instead of copying shell widths or breakpoints', () => {
    expect(css).toContain('var(--dse-layout-semantic-top-height)');
    expect(css).toContain('var(--dse-layout-semantic-page-inset)');
    expect(css).toContain('var(--dse-layout-semantic-region-gap)');
    expect(css).not.toMatch(/\b208px\b/);
    expect(css).not.toMatch(/\b64px\b/);
    expect(css).not.toMatch(/\b1200px\b/);
  });

  it('keeps placement logical and makes the main region the short-window scroll owner', () => {
    expect(css).toContain('overflow: auto');
    expect(css).toContain('margin-block-end');
    expect(css).not.toMatch(/margin-(left|right)/);
    expect(css).not.toMatch(/padding-(left|right)/);
    expect(css).not.toMatch(/border-(left|right)/);
  });
});
