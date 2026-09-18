import { describe, expect, it } from 'vitest';

const storyModulePath = './Sidebar.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Sidebar Storybook contract', () => {
  it('exposes only the governed public presentation controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.sidebarMeta.argTypes ?? {};
    expect(argTypes).toHaveProperty('mode');
    expect(argTypes).toHaveProperty('label');

    for (const forbidden of [
      'state',
      'selected',
      'collapsed',
      'open',
      'placement',
      'breakpoint',
      'onNavigate',
      'routeConfig',
      'children',
      'navigation',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers expanded/compact plus Light/Dark × English/Arabic and footer boundaries', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Expanded',
      'Compact',
      'DarkExpanded',
      'ArabicExpanded',
      'DarkArabicExpanded',
      'WithoutFooter',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.Compact.args?.mode).toBe('compact');
    expect(module.DarkExpanded.globals?.theme).toBe('dark');
    expect(module.ArabicExpanded.globals?.language).toBe('arabic');
    expect(module.DarkArabicExpanded.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.ArabicExpanded.args?.label).toMatch(/[\u0600-\u06FF]/);
    expect(module.WithoutFooter.args?.footer).toBeUndefined();
  });

  it('documents the public/internal contract split and responsive ownership boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.sidebarMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.sidebar@1\.0\.0/);
    expect(description).toMatch(/dse\._navigation-item@1\.0\.0/);
    expect(description).toMatch(/aria-current|current route/i);
    expect(description).toMatch(/native link|anchor/i);
    expect(description).toMatch(/compact|expanded/i);
    expect(description).toMatch(/Application Shell|responsive/i);
    expect(description).toMatch(/router|product/i);
    expect(description).toMatch(/internal|private/i);
  });
});
