import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './PageHeading.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module, 'Page Heading Storybook module must exist').not.toBeNull();
  return module;
}

describe('Page Heading Storybook contract', () => {
  it('exposes title/description visibility controls and keeps Breadcrumbs/Actions as content slots', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.pageHeadingMeta.argTypes ?? {};
    expect(argTypes).toHaveProperty('title');
    expect(argTypes).toHaveProperty('description');
    expect(argTypes).toHaveProperty('showDescription');
    expect(argTypes.breadcrumbs?.control).toBe(false);
    expect(argTypes.actions?.control).toBe(false);

    for (const forbidden of [
      'headingLevel',
      'search',
      'searchField',
      'navigation',
      'theme',
      'onNavigate',
      'onAction',
      'children',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers description visibility, two actions, and Light/Dark × English/Arabic', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Default',
      'WithoutDescription',
      'WithTwoActions',
      'WithBreadcrumbs',
      'Dark',
      'Arabic',
      'DarkArabic',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.WithoutDescription.args?.showDescription).toBe(false);
    expect(module.Dark.globals?.theme).toBe('dark');
    expect(module.Arabic.globals?.language).toBe('arabic');
    expect(module.DarkArabic.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.Arabic.args?.title).toMatch(/[\u0600-\u06FF]/);
  });

  it('composes the real governed Breadcrumbs component after C16', async () => {
    const module = await loadStories();
    if (!module) return;

    const breadcrumbHtml = renderToStaticMarkup(module.pageHeadingMeta.args?.breadcrumbs);
    expect(breadcrumbHtml).toContain('class="dse-breadcrumbs"');
    expect(breadcrumbHtml).toContain('aria-label="Breadcrumbs"');
    expect(breadcrumbHtml).toContain('href="#workspace"');
    expect(breadcrumbHtml).toContain('aria-current="page"');
    expect(breadcrumbHtml).toContain('class="dse-breadcrumb-link-item__separator"');
  });

  it('documents slot limits and the implemented Breadcrumbs dependency', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.pageHeadingMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.page-heading@1\.0\.0/);
    expect(description).toMatch(/Breadcrumbs/i);
    expect(description).toMatch(/dse\.breadcrumbs@1\.0\.0|C16/i);
    expect(description).not.toMatch(/not yet implemented|future C16|story-only fixture/i);
    expect(description).toMatch(/up to two|at most two/i);
    expect(description).toMatch(/Application Shell|Shell/i);
    expect(description).toMatch(/Search Field|search/i);
  });
});
