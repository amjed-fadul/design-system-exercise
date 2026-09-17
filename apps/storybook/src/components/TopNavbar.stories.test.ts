import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './TopNavbar.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Top Navbar Storybook contract', () => {
  it('exposes only the governed context controls while keeping content slots non-control data', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.topNavbarMeta.argTypes ?? {};
    expect(argTypes).toHaveProperty('contextLabel');
    expect(argTypes).toHaveProperty('showContext');
    expect(argTypes.brand?.control).toBe(false);
    expect(argTypes.account?.control).toBe(false);

    for (const forbidden of [
      'order',
      'theme',
      'navigation',
      'pageTitle',
      'actions',
      'accountMenu',
      'appearance',
      'onAppearanceChange',
      'children',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers default, hidden context, Light/Dark × English/Arabic, and the fixed physical composition', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Default',
      'WithoutContext',
      'Dark',
      'Arabic',
      'DarkArabic',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.WithoutContext.args?.showContext).toBe(false);
    expect(module.Dark.globals?.theme).toBe('dark');
    expect(module.Arabic.globals?.language).toBe('arabic');
    expect(module.DarkArabic.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.Arabic.args?.contextLabel).toMatch(/[\u0600-\u06FF]/);
  });

  it('composes the Figma appearance control inside the product-owned Account slot without adding it to Top Navbar API', async () => {
    const module = await loadStories();
    if (!module) return;

    const accountHtml = renderToStaticMarkup(module.topNavbarMeta.args?.account ?? null);
    expect(accountHtml).toContain('<button');
    expect(accountHtml).toContain('aria-label="Switch to dark mode"');
    expect(accountHtml).toContain('Amal Hassan · Admin');
  });

  it('documents the Figma authority and shell/product/page ownership split', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.topNavbarMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.top-navbar@1\.0\.0/);
    expect(description).toMatch(/228:18954/);
    expect(description).toMatch(/64/);
    expect(description).toMatch(/Brand/i);
    expect(description).toMatch(/Account/i);
    expect(description).toMatch(/fixed.*left-to-right|left-to-right.*fixed/i);
    expect(description).toMatch(/Application Shell/i);
    expect(description).toMatch(/Product/i);
    expect(description).toMatch(/page/i);
    expect(description).toMatch(/order/i);
    expect(description).toMatch(/theme/i);
  });
});
