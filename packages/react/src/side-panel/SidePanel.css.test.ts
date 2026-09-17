import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/side-panel/SidePanel.css');

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('SidePanel visual contract', () => {
  it('matches the Figma raised 408px × 612px surface and 12px surface shape', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-side-panel\s*\{[^}]*inline-size:\s*var\(--dse-layout-primitive-detail-inline-width\);/s);
    expect(css).toMatch(/\.dse-side-panel\s*\{[^}]*block-size:\s*612px;[^}]*min-block-size:\s*612px;/s);
    expect(css).toContain('background: var(--dse-color-semantic-surface-raised)');
    expect(css).toContain('border: 1px solid var(--dse-color-semantic-border-subtle)');
    expect(css).toContain('border-radius: var(--dse-radius-shape-surface)');
  });

  it('matches the 64px clipping top bar and single-line label-small eyebrow geometry', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-side-panel__top-bar\s*\{[^}]*block-size:\s*64px;[^}]*padding-block:\s*var\(--dse-spacing-primitive-space-300\);[^}]*padding-inline-start:\s*var\(--dse-spacing-primitive-space-500\);[^}]*padding-inline-end:\s*var\(--dse-spacing-primitive-space-400\);[^}]*overflow:\s*hidden;/s);
    expect(css).toMatch(/\.dse-side-panel__eyebrow\s*\{[^}]*overflow:\s*hidden;/s);
    expect(css).toMatch(/\.dse-side-panel__eyebrow\s*\{[^}]*white-space:\s*nowrap;/s);
    expect(css).toMatch(/\.dse-side-panel__eyebrow\s*\{[^}]*text-overflow:\s*ellipsis;/s);
    for (const token of [
      '--dse-color-semantic-fg-secondary',
      '--dse-typography-semantic-label-small-family',
      '--dse-typography-semantic-label-small-size',
      '--dse-typography-semantic-label-small-weight',
      '--dse-typography-semantic-label-small-line-height',
      '--dse-typography-semantic-label-small-letter-spacing',
    ]) {
      expect(css).toContain(`var(${token})`);
    }
  });

  it('keeps Body flexible and scrollable while Header and Actions remain non-shrinking', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-side-panel__body\s*\{[^}]*flex:\s*1 0 0;[^}]*min-block-size:\s*240px;[^}]*overflow-x:\s*hidden;[^}]*overflow-y:\s*auto;/s);
    expect(css).toMatch(/\.dse-side-panel__body\s*\{[^}]*padding-block:\s*20px;[^}]*padding-inline:\s*var\(--dse-spacing-primitive-space-500\);[^}]*gap:\s*20px;/s);
    expect(css).toMatch(/\.dse-side-panel__header\s*\{[^}]*flex:\s*0 0 auto;/s);
    expect(css).toMatch(/\.dse-side-panel__actions\s*\{[^}]*flex:\s*0 0 auto;[^}]*align-items:\s*center;[^}]*justify-content:\s*space-between;[^}]*block-size:\s*80px;[^}]*padding-block:\s*var\(--dse-spacing-primitive-space-400\);[^}]*padding-inline:\s*var\(--dse-spacing-primitive-space-500\);[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\);/s);
    expect(css).not.toMatch(/\.dse-side-panel__actions\s*\{[^}]*flex-wrap:/s);
    expect(css).toMatch(/\.dse-side-panel__(header|footer)-divider[^}]*\{[^}]*block-size:\s*1px;[^}]*background:\s*var\(--dse-color-semantic-border-subtle\)/s);
  });

  it('uses logical geometry for LTR and RTL and the exact governed close asset', () => {
    const css = readCss();

    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/(^|[;{]\s*)(left|right)\s*:/im);
    expect(css).toMatch(/\.dse-side-panel__close-icon\s*\{[^}]*inline-size:\s*var\(--dse-icons-size-md\);[^}]*block-size:\s*var\(--dse-icons-size-md\);/s);
    expect(css).toContain("mask-image: url('./assets/x.svg')");
  });
});
