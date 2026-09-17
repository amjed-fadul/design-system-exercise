import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/inline-feedback/InlineFeedback.css');
const alertAssetPath = resolve(process.cwd(), 'src/assets/inline-feedback-alert.svg');
const checkAssetPath = resolve(process.cwd(), 'src/assets/inline-feedback-check.svg');

function read(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

describe('InlineFeedback visual contract', () => {
  it('uses governed feedback tokens and Figma spacing/shape values without fixed width or fixed height', () => {
    const css = read(cssPath);

    for (const token of [
      '--dse-color-semantic-feedback-negative-surface',
      '--dse-color-semantic-feedback-negative-fg',
      '--dse-color-semantic-feedback-negative-border',
      '--dse-color-semantic-feedback-positive-surface',
      '--dse-color-semantic-feedback-positive-fg',
      '--dse-color-semantic-feedback-positive-border',
      '--dse-radius-shape-surface',
      '--dse-icons-size-md',
    ]) {
      expect(css).toContain(`var(${token})`);
    }

    expect(css).toMatch(/padding:\s*var\(--dse-spacing-primitive-space-400\)/);
    expect(css).toMatch(/gap:\s*var\(--dse-spacing-primitive-space-200\)/);
    expect(css).toMatch(/dse-inline-feedback__text[\s\S]*gap:\s*var\(--dse-spacing-primitive-space-100\)/);
    expect(css).not.toMatch(/width:\s*464px/);
    expect(css).not.toMatch(/height:\s*96px/);
  });

  it('uses exact canonical Figma system-icon geometry as mask assets so semantic color can follow light/dark tokens', () => {
    const css = read(cssPath);
    const alertSvg = read(alertAssetPath);
    const checkSvg = read(checkAssetPath);

    expect(css).toContain('inline-feedback-alert.svg');
    expect(css).toContain('inline-feedback-check.svg');
    expect(css).toMatch(/mask(?:-image)?:/);

    expect(alertSvg).toContain('M9.99154 1.65527');
    expect(alertSvg).toContain('M10.0078 13.3333');
    expect(checkSvg).toContain('M17.7446 2.7446');
    expect(alertSvg).toContain('viewBox="0 0 20 20"');
    expect(checkSvg).toContain('viewBox="0 0 20 20"');
  });

  it('uses logical alignment and wrapping-safe text layout for RTL and long messages', () => {
    const css = read(cssPath);
    expect(css).toContain('min-width: 0');
    expect(css).toContain('overflow-wrap: anywhere');
    expect(css).not.toContain('margin-left');
    expect(css).not.toContain('margin-right');
  });
});
