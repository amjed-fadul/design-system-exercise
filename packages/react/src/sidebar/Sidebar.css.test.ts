import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/sidebar/Sidebar.css');

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Sidebar CSS parity', () => {
  it('uses semantic surface/border tokens and logical edge placement', () => {
    const css = readCss();
    expect(css).toContain('var(--dse-color-semantic-surface-section)');
    expect(css).toContain('var(--dse-color-semantic-border-subtle)');
    expect(css).toMatch(/border-inline-end\s*:\s*var\(--dse-border-role-divider\)/);
    expect(css).not.toMatch(/border-right\s*:/);
    expect(css).not.toMatch(/border-left\s*:/);
  });

  it('matches the authoritative expanded and compact rail geometry with private layout values', () => {
    const css = readCss();
    expect(css).toMatch(/data-mode=['"]expanded['"]\][\s\S]*inline-size\s*:\s*var\(--dse-layout-primitive-nav-expanded\)/);
    expect(css).toMatch(/data-mode=['"]expanded['"]\][\s\S]*padding-block-start\s*:\s*30px/);
    expect(css).toMatch(/data-mode=['"]expanded['"]\][\s\S]*padding-block-end\s*:\s*var\(--dse-spacing-primitive-space-700\)/);
    expect(css).toMatch(/data-mode=['"]expanded['"]\][\s\S]*padding-inline\s*:\s*var\(--dse-spacing-primitive-space-300\)/);

    expect(css).toMatch(/data-mode=['"]compact['"]\][\s\S]*inline-size\s*:\s*var\(--dse-layout-primitive-nav-compact\)/);
    expect(css).toMatch(/data-mode=['"]compact['"]\][\s\S]*padding-block-start\s*:\s*var\(--dse-spacing-primitive-space-800\)/);
    expect(css).toMatch(/data-mode=['"]compact['"]\][\s\S]*padding-inline\s*:\s*10px/);

    expect(css).toMatch(/dse-sidebar__navigation-list[\s\S]*gap\s*:\s*var\(--dse-spacing-semantic-gap-sm\)/);
    expect(css).toMatch(/dse-sidebar__navigation-section[\s\S]*gap\s*:\s*18px/);
  });

  it('matches Navigation Item target geometry, icon size, typography, and logical padding', () => {
    const css = readCss();
    expect(css).toContain('var(--dse-radius-shape-control)');
    expect(css).toContain('var(--dse-icons-size-md)');
    expect(css).toContain('var(--dse-typography-semantic-label-default-family)');
    expect(css).toContain('var(--dse-typography-semantic-label-default-size)');
    expect(css).toContain('var(--dse-typography-semantic-label-default-weight)');
    expect(css).toContain('var(--dse-typography-semantic-label-default-line-height)');
    expect(css).toContain('var(--dse-typography-semantic-label-default-letter-spacing)');

    expect(css).toMatch(/data-mode=['"]expanded['"]\]\s*\.dse-navigation-item[\s\S]*min-block-size\s*:\s*40px/);
    expect(css).toMatch(/data-mode=['"]expanded['"]\]\s*\.dse-navigation-item[\s\S]*padding-inline-start\s*:\s*var\(--dse-spacing-primitive-space-300\)/);
    expect(css).toMatch(/data-mode=['"]expanded['"]\]\s*\.dse-navigation-item[\s\S]*padding-inline-end\s*:\s*10px/);
    expect(css).toMatch(/data-mode=['"]expanded['"]\]\s*\.dse-navigation-item[\s\S]*gap\s*:\s*var\(--dse-spacing-primitive-space-300\)/);

    expect(css).toMatch(/data-mode=['"]compact['"]\]\s*\.dse-navigation-item[\s\S]*inline-size\s*:\s*44px/);
    expect(css).toMatch(/data-mode=['"]compact['"]\]\s*\.dse-navigation-item[\s\S]*block-size\s*:\s*44px/);
    expect(css).toMatch(/dse-navigation-item__icon[\s\S]*inline-size\s*:\s*var\(--dse-icons-size-md\)/);
    expect(css).toMatch(/dse-navigation-item__icon[\s\S]*block-size\s*:\s*var\(--dse-icons-size-md\)/);
  });

  it('keeps the footer visible in constrained shell heights by scrolling only the navigation section', () => {
    const css = readCss();

    expect(css).toMatch(/\.dse-sidebar\s*\{[\s\S]*overflow:\s*hidden/);
    expect(css).toMatch(/\.dse-sidebar__navigation-section\s*\{[\s\S]*min-block-size:\s*0/);
    expect(css).toMatch(/\.dse-sidebar__navigation-section\s*\{[\s\S]*overflow-y:\s*auto/);
    expect(css).toMatch(/\.dse-sidebar__footer\s*\{[\s\S]*flex:\s*0\s+0\s+auto/);
  });

  it('maps current, hover, pressed, and focus-visible to the live semantic state tokens', () => {
    const css = readCss();
    expect(css).toContain('var(--dse-color-semantic-fg-secondary)');
    expect(css).toContain('var(--dse-color-semantic-fg-primary)');
    expect(css).toContain('var(--dse-color-semantic-state-hover)');
    expect(css).toContain('var(--dse-color-semantic-state-selected)');
    expect(css).toContain('var(--dse-color-semantic-focus-default)');
    expect(css).toContain('var(--dse-border-role-focus)');
    expect(css).toMatch(/dse-navigation-item\[data-current=['"]false['"]\]:hover/);
    expect(css).toMatch(/dse-navigation-item:active/);
    expect(css).toMatch(/dse-navigation-item:focus-visible/);
    expect(css).toMatch(/data-current=['"]true['"]/);
  });

  it('uses Label/small for the expanded group label and visually hides compact destination text without removing it', () => {
    const css = readCss();
    expect(css).toContain('var(--dse-color-semantic-fg-tertiary)');
    expect(css).toContain('var(--dse-typography-semantic-label-small-family)');
    expect(css).toContain('var(--dse-typography-semantic-label-small-size)');
    expect(css).toContain('var(--dse-typography-semantic-label-small-weight)');
    expect(css).toContain('var(--dse-typography-semantic-label-small-line-height)');
    expect(css).toContain('var(--dse-typography-semantic-label-small-letter-spacing)');

    expect(css).toMatch(/data-mode=['"]compact['"]\]\s*\.dse-navigation-item__label[\s\S]*position\s*:\s*absolute/);
    expect(css).toMatch(/data-mode=['"]compact['"]\]\s*\.dse-navigation-item__label[\s\S]*inline-size\s*:\s*1px/);
    expect(css).toMatch(/data-mode=['"]compact['"]\]\s*\.dse-navigation-item__label[\s\S]*overflow\s*:\s*hidden/);
    expect(css).not.toMatch(/data-mode=['"]compact['"]\]\s*\.dse-navigation-item__label[\s\S]*display\s*:\s*none/);
  });
});
