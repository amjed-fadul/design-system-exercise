import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './ApplicationShell.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module, 'Application Shell Storybook module must exist').not.toBeNull();
  return module;
}

describe('Application Shell Storybook contract', () => {
  it('covers the audited responsive, short-window, theme, and language evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Wide1440',
      'Narrow960',
      'Boundary1199',
      'Boundary1200',
      'ShortWindow',
      'Dark',
      'Arabic',
      'DarkArabic',
      'Zoom320',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.Boundary1199.args?.viewportMode).toBe('compact');
    expect(module.Boundary1199.parameters?.shellWidth).toBe(1199);
    expect(module.Boundary1200.args?.viewportMode).toBe('expanded');
    expect(module.Boundary1200.parameters?.shellWidth).toBe(1200);
    expect(module.ShortWindow.parameters?.shellHeight).toBe(720);
    expect(module.Zoom320.parameters?.shellWidth).toBe(320);
    expect(module.Dark.globals?.theme).toBe('dark');
    expect(module.Arabic.globals?.language).toBe('arabic');
    expect(module.DarkArabic.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
  });

  it('renders the governed header/nav/main composition without duplicating shell primitives', async () => {
    const module = await loadStories();
    if (!module) return;

    const html = renderToStaticMarkup(
      module.Wide1440.render(
        { ...module.applicationShellMeta.args, ...module.Wide1440.args },
        { globals: {} } as any,
      ),
    );

    expect(html).toContain('class="dse-application-shell"');
    expect(html).toContain('<header');
    expect(html).toContain('<nav');
    expect(html).toContain('<main');
    expect(html).toContain('data-mode="expanded"');
    expect(html).toContain('Team members');
    expect(html).toContain('Directory content');
  });

  it('documents the pattern contract, Figma authority, threshold, and state-ownership boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.applicationShellMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.pattern\.application-shell@1\.0\.0/);
    expect(description).toMatch(/68:494/);
    expect(description).toMatch(/1200/);
    expect(description).toMatch(/208/);
    expect(description).toMatch(/64/);
    expect(description).toMatch(/does not|must not/i);
    expect(description).toMatch(/query|draft|request/i);
  });
});
