import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (name: string) =>
  readFileSync(resolve(process.cwd(), `src/components/${name}.stories.tsx`), 'utf8');

describe('Component Storybook evidence integrity', () => {
  it('does not hand-draw governed icons in Button, Icon Button, or Sidebar stories', () => {
    for (const name of ['Button', 'IconButton', 'Sidebar']) {
      expect(read(name), `${name} must use governed asset geometry`).not.toMatch(/<svg\b/);
    }

    expect(read('Button')).toContain('application-shell-view-chevron.svg');
    expect(read('IconButton')).toContain("packages/react/src/assets/x.svg");
    expect(read('Sidebar')).toContain('application-shell-sidebar-overview.svg');
    expect(read('Sidebar')).toContain('application-shell-sidebar-team.svg');
    expect(read('Sidebar')).toContain('application-shell-sidebar-settings.svg');
  });

  it('keeps Side Panel fixture typography connected to semantic typography tokens', () => {
    const source = read('SidePanel');
    expect(source).not.toMatch(/fontSize:\s*\d/);
    expect(source).toContain('--dse-typography-semantic-title-component-size');
    expect(source).toContain('--dse-typography-semantic-body-small-size');
    expect(source).toContain('--dse-typography-semantic-label-small-size');
    expect(source).toContain('--dse-typography-semantic-body-default-size');
  });

  it('keeps Sidebar footer typography connected to semantic typography tokens', () => {
    const source = read('Sidebar');
    expect(source).not.toMatch(/fontSize:\s*\d/);
    expect(source).toContain('--dse-typography-semantic-label-default-size');
    expect(source).toContain('--dse-typography-semantic-caption-default-size');
  });

  it('uses existing spacing and icon-size tokens where they already govern fixture values', () => {
    expect(read('Table')).toContain(
      "gap: 'var(--dse-spacing-primitive-space-300)'",
    );

    const topNavbar = read('TopNavbar');
    expect(topNavbar).toContain('--dse-icons-size-md');
    expect(topNavbar).toContain('--dse-spacing-semantic-gap-md');
    expect(topNavbar).toContain('--dse-spacing-primitive-space-300');
  });
});
