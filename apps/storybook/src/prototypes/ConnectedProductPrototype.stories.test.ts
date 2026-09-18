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

    expect(module.prototypeMeta.title).toBe('Prototypes/Connected Product Prototype');
    const description = module.prototypeMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/199:10635/);
    expect(description).toMatch(/wide/i);
    expect(description).toMatch(/39/);
  });

  it('renders the governed Application Shell and the seven-person directory at the start', async () => {
    const module = await loadStories();
    if (!module) return;

    const html = renderToStaticMarkup(module.Connected.render?.({} as never, {} as never));
    expect(html).toContain('dse-application-shell');
    expect(html).toContain('Team members');
    expect(html).toContain('7 people');
    expect(html).toContain('Sara Ahmed');
    expect(html).toContain('Invite member');
  });

  it('keeps prototype-only behavior out of the reusable pattern API', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.prototypeMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/storybook|demo/i);
    expect(description).toMatch(/P02|P03|P04|P05/);
    expect(description).toMatch(/not.*contract|does not.*contract/i);
  });
});
