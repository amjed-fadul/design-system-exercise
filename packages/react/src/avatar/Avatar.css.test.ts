import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/avatar/Avatar.css');

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Avatar visual contract', () => {
  it('uses the exact Figma sm/lg geometry and governed circular shape', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-avatar\s*\{[^}]*inline-size:\s*32px;[^}]*block-size:\s*32px;/s);
    expect(css).toMatch(/\.dse-avatar\[data-size=['"]lg['"]\]\s*\{[^}]*inline-size:\s*48px;[^}]*block-size:\s*48px;/s);
    expect(css).toContain('border-radius: var(--dse-radius-shape-rounded)');
  });

  it('uses the exact Figma semantic surface, foreground, and label/small typography bindings', () => {
    const css = readCss();

    for (const token of [
      '--dse-color-semantic-surface-section',
      '--dse-color-semantic-fg-secondary',
      '--dse-radius-shape-rounded',
      '--dse-typography-semantic-label-small-family',
      '--dse-typography-semantic-label-small-size',
      '--dse-typography-semantic-label-small-weight',
      '--dse-typography-semantic-label-small-line-height',
      '--dse-typography-semantic-label-small-letter-spacing',
    ]) {
      expect(css).toContain(`var(${token})`);
    }
  });

  it('centers content with direction-agnostic layout and prevents size collapse', () => {
    const css = readCss();

    expect(css).toMatch(/display:\s*inline-flex/);
    expect(css).toMatch(/align-items:\s*center/);
    expect(css).toMatch(/justify-content:\s*center/);
    expect(css).toMatch(/flex:\s*0\s+0\s+auto/);
    expect(css).not.toContain('margin-left');
    expect(css).not.toContain('margin-right');
    expect(css).not.toContain('padding-left');
    expect(css).not.toContain('padding-right');
  });
});
