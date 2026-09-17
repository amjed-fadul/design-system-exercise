import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/dialog/Dialog.css');

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Dialog visual contract', () => {
  it('matches the Figma 520px overlay surface, 16px shape, backdrop, and exact elevation', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-dialog__surface\s*\{[^}]*max-inline-size:\s*520px;/s);
    expect(css).toContain('background: var(--dse-color-semantic-surface-elevated)');
    expect(css).toContain('border-radius: var(--dse-radius-shape-overlay)');
    expect(css).toContain('background: var(--dse-color-semantic-surface-overlay)');
    expect(css).toMatch(/box-shadow:\s*0 12px 32px -4px rgba\(0,\s*0,\s*0,\s*0\.14\),\s*0 2px 8px -2px rgba\(0,\s*0,\s*0,\s*0\.06\)/);
  });

  it('matches Figma logical header, body, divider, and actions geometry', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-dialog__header\s*\{[^}]*padding-block-start:\s*var\(--dse-spacing-primitive-space-500\);[^}]*padding-block-end:\s*var\(--dse-spacing-primitive-space-200\);[^}]*padding-inline:\s*28px;[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\);/s);
    expect(css).toMatch(/\.dse-dialog__body\s*\{[^}]*padding-block-start:\s*var\(--dse-spacing-primitive-space-400\);[^}]*padding-block-end:\s*20px;[^}]*padding-inline:\s*28px;[^}]*gap:\s*var\(--dse-spacing-primitive-space-400\);/s);
    expect(css).toMatch(/\.dse-dialog__divider\s*\{[^}]*block-size:\s*1px;[^}]*background:\s*var\(--dse-color-semantic-border-subtle\)/s);
    expect(css).toMatch(/\.dse-dialog__actions\s*\{[^}]*padding-block:\s*20px;[^}]*padding-inline:\s*28px;[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\);/s);
  });

  it('uses governed Figma foreground, spacing, and typography tokens', () => {
    const css = readCss();

    for (const token of [
      '--dse-color-semantic-fg-primary',
      '--dse-color-semantic-fg-secondary',
      '--dse-spacing-primitive-space-100',
      '--dse-spacing-primitive-space-200',
      '--dse-spacing-primitive-space-300',
      '--dse-spacing-primitive-space-400',
      '--dse-spacing-primitive-space-500',
      '--dse-typography-semantic-title-component-family',
      '--dse-typography-semantic-title-component-size',
      '--dse-typography-semantic-title-component-weight',
      '--dse-typography-semantic-title-component-line-height',
      '--dse-typography-semantic-title-component-letter-spacing',
      '--dse-typography-semantic-body-small-family',
      '--dse-typography-semantic-body-small-size',
      '--dse-typography-semantic-body-small-weight',
      '--dse-typography-semantic-body-small-line-height',
      '--dse-typography-semantic-body-small-letter-spacing',
    ]) {
      expect(css).toContain(`var(${token})`);
    }
  });

  it('uses logical layout for LTR and RTL and allows content-driven height', () => {
    const css = readCss();

    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
    expect(css).not.toMatch(/\.dse-dialog__surface\s*\{[^}]*height:\s*\d+px/s);
    expect(css).not.toMatch(/\.dse-dialog__surface\s*\{[^}]*block-size:\s*\d+px/s);
  });
});
