import { describe, expect, it } from 'vitest';

const storyModulePath = './Link.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Link Storybook contract', () => {
  it('documents only visible content and core native navigation controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.linkMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(['children', 'href']);
  });

  it('does not expose Figma-only or unsupported Link controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.linkMeta.argTypes ?? {};
    for (const forbidden of ['state', 'disabled', 'visited', 'icon', 'size', 'loading']) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('includes the required navigational evidence stories', async () => {
    const module = await loadStories();
    if (!module) return;

    expect(module.Playground).toBeDefined();
    expect(module.LongLabel).toBeDefined();
    expect(module.ArabicLabel).toBeDefined();
    expect(module.ExternalTarget).toBeDefined();
    expect(module.ExternalTarget.args).toEqual(
      expect.objectContaining({
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    );
  });
});
