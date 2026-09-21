import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = (component: string, file: string) =>
  readFileSync(resolve(process.cwd(), `src/${component}/${file}.css`), 'utf8');

describe('core DS token connectivity', () => {
  it('binds reviewed spacing relationships to existing spacing tokens', () => {
    expect(css('breadcrumbs', 'Breadcrumbs')).toContain(
      'gap: var(--dse-spacing-semantic-gap-sm)',
    );

    const pageHeading = css('page-heading', 'PageHeading');
    expect(pageHeading).toContain(
      'gap: var(--dse-spacing-semantic-stack-sm)',
    );
    expect(pageHeading).toContain(
      'gap: var(--dse-spacing-primitive-space-300)',
    );

    const sidebar = css('sidebar', 'Sidebar');
    expect(sidebar).toContain(
      'gap: var(--dse-spacing-semantic-gap-sm)',
    );
    expect(sidebar).toContain(
      'padding-block-end: var(--dse-spacing-primitive-space-700)',
    );
    expect(sidebar).toContain(
      'padding-block-start: var(--dse-spacing-primitive-space-800)',
    );
  });

  it('binds divider/container thickness and rounded shape to semantic roles', () => {
    expect(css('dialog', 'Dialog')).toContain(
      'block-size: var(--dse-border-role-divider)',
    );

    const sidePanel = css('side-panel', 'SidePanel');
    expect(sidePanel).toContain(
      'border: var(--dse-border-role-container) solid',
    );
    expect(sidePanel).toContain(
      'block-size: var(--dse-border-role-divider)',
    );

    expect(css('radio-group', 'RadioGroup')).not.toContain(
      'border-radius: 999px',
    );
    expect(css('radio-group', 'RadioGroup')).toContain(
      'border-radius: var(--dse-radius-shape-rounded)',
    );
  });

  it('binds shell dimensions to the existing layout foundations', () => {
    const sidebar = css('sidebar', 'Sidebar');
    expect(sidebar).toContain(
      'inline-size: var(--dse-layout-primitive-nav-expanded)',
    );
    expect(sidebar).toContain(
      'inline-size: var(--dse-layout-primitive-nav-compact)',
    );

    expect(css('top-navbar', 'TopNavbar')).toContain(
      'block-size: var(--dse-layout-primitive-top-height)',
    );
  });

  it('keeps table border and exact scale spacing connected without tokenizing component-specific geometry', () => {
    const table = css('table', 'Table');
    expect(table).toContain('var(--dse-border-role-container)');
    expect(table).toContain('var(--dse-border-role-divider)');
    expect(table).toContain('var(--dse-spacing-primitive-space-500)');
    expect(table).toContain('var(--dse-spacing-primitive-space-200)');
    expect(table).toContain('var(--dse-spacing-primitive-space-300)');
    expect(table).toContain('var(--dse-spacing-primitive-space-400)');

    expect(table).toContain('min-inline-size: 736px');
    expect(table).toContain('inline-size: 124px');
    expect(table).toContain('inline-size: 184px');
    expect(table).toContain('inline-size: 156px');
  });
});
