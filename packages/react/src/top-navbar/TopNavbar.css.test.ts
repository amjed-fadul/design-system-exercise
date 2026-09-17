import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/top-navbar/TopNavbar.css');

describe('Top Navbar CSS boundary', () => {
  it('matches the reviewed 64px host-filling shell geometry and inherited semantic theming', () => {
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toContain('.dse-top-navbar');
    expect(css).toMatch(/block-size:\s*64px/);
    expect(css).toMatch(/inline-size:\s*100%/);
    expect(css).toContain('var(--dse-color-semantic-surface-default)');
    expect(css).toContain('var(--dse-color-semantic-border-subtle)');
    expect(css).toContain('var(--dse-spacing-primitive-space-500)');
    expect(css).toMatch(/gap:\s*20px/);
  });

  it('keeps the Figma forward composition physically left-to-right while allowing slot text to choose its own direction', () => {
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/\.dse-top-navbar\s*\{[\s\S]*direction:\s*ltr/);
    expect(css).not.toMatch(/\[dir=['"]rtl['"]\][^{]*\.dse-top-navbar/);
    expect(css).not.toMatch(/flex-direction:\s*row-reverse/);
  });

  it('styles only the owned context copy and leaves Brand and Account slot presentation to consumers', () => {
    const css = readFileSync(cssPath, 'utf8');

    for (const token of [
      '--dse-typography-semantic-body-small-family',
      '--dse-typography-semantic-body-small-size',
      '--dse-typography-semantic-body-small-weight',
      '--dse-typography-semantic-body-small-line-height',
      '--dse-typography-semantic-body-small-letter-spacing',
      '--dse-color-semantic-fg-secondary',
    ]) {
      expect(css).toContain(token);
    }

    expect(css).not.toMatch(/\.dse-top-navbar__brand\s*\{[\s\S]*font-/);
    expect(css).not.toMatch(/\.dse-top-navbar__account\s*\{[\s\S]*font-/);
  });
});
