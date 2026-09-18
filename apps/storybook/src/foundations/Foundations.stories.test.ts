import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { tokenDocumentation } from '@design-system-exercise/tokens';

const modules = {
  borders: () => import('./Borders.stories'),
  colors: () => import('./Colors.stories'),
  spacing: () => import('./Spacing.stories'),
  radius: () => import('./Radius.stories'),
  typography: () => import('./Typography.stories'),
  layout: () => import('./Layout.stories'),
  icons: () => import('./Icons.stories'),
  elevation: () => import('./Elevation.stories'),
};

describe('Foundation Storybook token architecture', () => {
  it('preserves alias relationships for semantic documentation', () => {
    expect(
      tokenDocumentation.find(
        (entry) => entry.path === 'border.role.base' && entry.mode === null,
      ),
    ).toMatchObject({
      layer: 'semantic',
      aliasOf: 'border.width.base',
    });
    expect(
      tokenDocumentation.find(
        (entry) => entry.path === 'spacing.semantic.gap.md' && entry.mode === null,
      ),
    ).toMatchObject({
      aliasOf: 'spacing.primitive.space.400',
    });
  });

  it('splits layered foundations into primitive and semantic stories', async () => {
    for (const name of ['borders', 'colors', 'spacing', 'radius', 'typography', 'layout'] as const) {
      const module = await modules[name]();
      expect(module.Primitives, `${name} primitives story`).toBeDefined();
      expect(module.Semantic, `${name} semantic story`).toBeDefined();
    }
  });

  it('does not invent semantic layers for icons or elevation', async () => {
    const icons = await modules.icons();
    const elevation = await modules.elevation();

    expect(icons.Size).toBeDefined();
    expect(icons.Stroke).toBeDefined();
    expect((icons as Record<string, unknown>).Semantic).toBeUndefined();
    expect(elevation.Planes).toBeDefined();
    expect((elevation as Record<string, unknown>).Semantic).toBeUndefined();
  });

  it('renders aliases separately from resolved semantic values', async () => {
    const borders = await modules.borders();
    const html = renderToStaticMarkup(
      borders.Semantic.render?.({} as never, { globals: {} } as never) as never,
    );

    expect(html).toContain('Alias');
    expect(html).toContain('border.role.base');
    expect(html).toContain('border.width.base');
    expect(html).toContain('1px');
  });

  it('renders layout modes as one semantic comparison instead of duplicate tables', async () => {
    const layout = await modules.layout();
    const html = renderToStaticMarkup(
      layout.Semantic.render?.({} as never, { globals: {} } as never) as never,
    );

    expect(html).toContain('Wide');
    expect(html).toContain('Narrow');
    expect(html).toContain('layout.semantic.nav.width');
    expect(html).toContain('layout.primitive.nav.expanded');
    expect(html).toContain('layout.primitive.nav.compact');
  });
});
