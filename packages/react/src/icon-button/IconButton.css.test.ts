import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cssUrl = new URL('./IconButton.css', import.meta.url);
const cssPath = fileURLToPath(cssUrl);

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('IconButton CSS contract', () => {
  it('uses public tokens for the 40px target, 20px icon, radius, foreground, and browser-derived states', () => {
    const css = readCss();

    expect(css).toContain('inline-size: var(--dse-spacing-primitive-space-700)');
    expect(css).toContain('block-size: var(--dse-spacing-primitive-space-700)');
    expect(css).toContain('inline-size: var(--dse-icons-size-md)');
    expect(css).toContain('block-size: var(--dse-icons-size-md)');
    expect(css).toContain('border-radius: var(--dse-radius-radius-sm)');
    expect(css).toContain('color: var(--dse-color-semantic-fg-primary)');
    expect(css).toContain('background: var(--dse-color-semantic-action-ghost-hover)');
    expect(css).toContain('background: var(--dse-color-semantic-action-ghost-pressed)');
    expect(css).toContain('outline: var(--dse-border-role-focus) solid var(--dse-color-semantic-focus-default)');
    expect(css).toContain('color: var(--dse-color-semantic-fg-disabled)');
  });

  it('does not hard-code color values', () => {
    const css = readCss();
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/\brgba?\(/i);
    expect(css).not.toMatch(/\bhsla?\(/i);
  });
});
