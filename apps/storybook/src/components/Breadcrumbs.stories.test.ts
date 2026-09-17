import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './Breadcrumbs.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module, 'Breadcrumbs Storybook module must exist').not.toBeNull();
  return module;
}

describe('Breadcrumbs Storybook contract', () => {
  it('exposes only the governed route-hierarchy controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.breadcrumbsMeta.argTypes ?? {};
    expect(argTypes).toHaveProperty('ancestors');
    expect(argTypes).toHaveProperty('currentLabel');
    expect(argTypes).toHaveProperty('ariaLabel');

    for (const forbidden of [
      'separator',
      'collapse',
      'overflow',
      'currentHref',
      'disabled',
      'visited',
      'theme',
      'children',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers one ancestor, multiple ancestors, Page Heading integration, and Light/Dark × English/Arabic', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Default',
      'MultipleAncestors',
      'InPageHeading',
      'Dark',
      'Arabic',
      'DarkArabic',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.MultipleAncestors.args?.ancestors).toHaveLength(3);
    expect(module.Dark.globals?.theme).toBe('dark');
    expect(module.Arabic.globals?.language).toBe('arabic');
    expect(module.DarkArabic.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.Arabic.args?.ariaLabel).toMatch(/[\u0600-\u06FF]/);
    expect(module.Arabic.args?.currentLabel).toMatch(/[\u0600-\u06FF]/);
  });

  it('renders the Figma semantics without a current-page link or interactive separator', async () => {
    const module = await loadStories();
    if (!module) return;

    const html = renderToStaticMarkup(
      module.Default.render(module.breadcrumbsMeta.args, { globals: {} } as any),
    );
    expect(html).toContain('<nav');
    expect(html).toContain('aria-label="Breadcrumbs"');
    expect(html).toContain('href="#workspace"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('href="#team-access"');
  });

  it('documents the public/internal Figma authorities and deliberate no-overflow boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.breadcrumbsMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.breadcrumbs@1\.0\.0/);
    expect(description).toMatch(/139:20/);
    expect(description).toMatch(/139:16/);
    expect(description).toMatch(/Link/i);
    expect(description).toMatch(/plain text/i);
    expect(description).toMatch(/no.*collapse|collapse.*not|no.*overflow|overflow.*not/i);
  });
});
