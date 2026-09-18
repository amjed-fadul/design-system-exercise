import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './ConnectedProductPrototype.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module, 'Connected Product Prototype Storybook module must exist').not.toBeNull();
  return module;
}

describe('Connected Product Prototype Storybook entry', () => {
  it('lives under the Prototypes section and documents the live Figma source', async () => {
    const module = await loadStories();
    if (!module) return;

    expect(module.default.title).toBe('Prototypes/Connected Product Prototype');
    const description = module.default.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/199:10635/);
    expect(description).toMatch(/wide/i);
    expect(description).toMatch(/39/);
  });

  it('renders the governed Application Shell and the seven-person directory at the start', async () => {
    const module = await loadStories();
    if (!module) return;

    const html = renderToStaticMarkup(
      module.Connected.render?.(
        {} as never,
        { globals: { language: 'english', theme: 'light' } } as never,
      ),
    );
    expect(html).toContain('dse-application-shell');
    expect(html).toContain('Team members');
    expect(html).toContain('7 people');
    expect(html).toContain('Sara Ahmed');
    expect(html).toContain('Invite member');
  });

  it('uses the same single Connected story for toolbar-controlled Arabic + Dark mode', async () => {
    const module = await loadStories();
    if (!module) return;

    expect(module.Arabic).toBeUndefined();

    const html = renderToStaticMarkup(
      module.Connected.render?.(
        {} as never,
        { globals: { language: 'arabic', theme: 'dark' } } as never,
      ),
    );

    expect(html).toContain('dir="rtl"');
    expect(html).toContain('lang="ar"');
    expect(html).toContain('data-theme="dark"');
    expect(html).toContain('أعضاء الفريق');
    expect(html).toContain('سارة أحمد');
    expect(html).toContain('دعوة عضو');
    expect(html).toContain('الفريق والصلاحيات');
    expect(html).not.toContain('Team members');
  });

  it('keeps prototype-only behavior out of the reusable pattern API', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.default.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/storybook|demo/i);
    expect(description).toMatch(/P02|P03|P04|P05/);
    expect(description).toMatch(/not.*contract|does not.*contract/i);
  });
});
