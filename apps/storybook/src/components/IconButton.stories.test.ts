import { describe, expect, it } from 'vitest';

const storyModulePath = './IconButton.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Icon Button Storybook contract', () => {
  it('documents only the intended Icon Button controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.iconButtonMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(['aria-label', 'disabled', 'icon']);
  });

  it('does not expose Figma-only or unsupported Icon Button controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.iconButtonMeta.argTypes ?? {};
    for (const forbidden of [
      'state',
      'focusVisible',
      'accessibleLabel',
      'loading',
      'success',
      'size',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });
});
