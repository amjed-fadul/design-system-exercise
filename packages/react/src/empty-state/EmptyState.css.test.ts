import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/empty-state/EmptyState.css');

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('EmptyState visual contract', () => {
  it('fills the host surface, preserves the 440px minimum, and centers a 680px content stack', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-empty-state\s*\{[^}]*inline-size:\s*100%;[^}]*min-block-size:\s*440px;/s);
    expect(css).toContain('background: var(--dse-color-semantic-surface-default)');
    expect(css).toMatch(/\.dse-empty-state__content\s*\{[^}]*inline-size:\s*100%;[^}]*max-inline-size:\s*680px;[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\);/s);
    expect(css).toMatch(/\.dse-empty-state__content\s*\{[^}]*align-items:\s*center;[^}]*justify-content:\s*center;/s);
  });

  it('matches the centered 40px icon region with the exact 24px governed search glyph', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-empty-state__icon\s*\{[^}]*inline-size:\s*40px;[^}]*block-size:\s*40px;/s);
    expect(css).toMatch(/\.dse-empty-state__default-icon\s*\{[^}]*inline-size:\s*var\(--dse-icons-size-lg\);[^}]*block-size:\s*var\(--dse-icons-size-lg\);/s);
    expect(css).toContain('mask-image: var(--dse-empty-state-icon-image)');
    expect(css).toContain('background-color: var(--dse-color-semantic-fg-secondary)');
  });

  it('uses the exact title/component and body/small semantic typography from Figma', () => {
    const css = readCss();

    for (const token of [
      '--dse-color-semantic-fg-primary',
      '--dse-typography-semantic-title-component-family',
      '--dse-typography-semantic-title-component-size',
      '--dse-typography-semantic-title-component-weight',
      '--dse-typography-semantic-title-component-line-height',
      '--dse-typography-semantic-title-component-letter-spacing',
      '--dse-color-semantic-fg-secondary',
      '--dse-typography-semantic-body-small-family',
      '--dse-typography-semantic-body-small-size',
      '--dse-typography-semantic-body-small-weight',
      '--dse-typography-semantic-body-small-line-height',
      '--dse-typography-semantic-body-small-letter-spacing',
    ]) {
      expect(css).toContain(`var(${token})`);
    }
    expect(css).toMatch(/\.dse-empty-state__title\s*\{[^}]*text-align:\s*center;/s);
    expect(css).toMatch(/\.dse-empty-state__body\s*\{[^}]*text-align:\s*center;[^}]*white-space:\s*pre-line;/s);
  });

  it('keeps message and actions centered with logical, RTL-safe geometry', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-empty-state__message\s*\{[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\);/s);
    expect(css).toMatch(/\.dse-empty-state__actions\s*\{[^}]*justify-content:\s*center;[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\);/s);
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/(^|[;{]\s*)(left|right)\s*:/im);
  });
});
