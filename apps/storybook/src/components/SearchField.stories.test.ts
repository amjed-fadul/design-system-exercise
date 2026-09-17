import { describe, expect, it } from 'vitest';

const storyModulePath = './SearchField.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Search Field Storybook contract', () => {
  it('documents only the approved public/native controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.searchFieldMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(
      [
        'aria-label',
        'clearButtonLabel',
        'defaultValue',
        'disabled',
        'onClear',
        'placeholder',
      ].sort(),
    );
    expect(argTypes.onClear).toEqual(expect.objectContaining({ control: false }));
  });

  it('does not expose Figma-only, validation, result, or internal Search Field controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.searchFieldMeta.argTypes ?? {};
    for (const forbidden of [
      'state',
      'content',
      'size',
      'children',
      'type',
      'invalid',
      'aria-invalid',
      'loading',
      'results',
      'resultCount',
      'suggestions',
      'debounce',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('includes empty, filled, real-focus, disabled, long-query, and RTL/localization evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Empty',
      'Filled',
      'FocusedEmpty',
      'FocusedFilled',
      'DisabledEmpty',
      'DisabledFilled',
      'LongQuery',
      'ArabicLatinEmail',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.FocusedEmpty.play).toEqual(expect.any(Function));
    expect(module.FocusedFilled.play).toEqual(expect.any(Function));
    expect(module.ArabicLatinEmail.args).toEqual(
      expect.objectContaining({
        'aria-label': 'البحث في الفريق',
        clearButtonLabel: 'مسح البحث',
        defaultValue: 'sara@example.com',
      }),
    );
  });

  it('keeps the live Figma evidence surface at the source width without making width a component prop', async () => {
    const module = await loadStories();
    if (!module) return;

    expect(module.searchFieldMeta.decorators).toEqual(expect.any(Array));
    expect(module.searchFieldMeta.parameters?.docs?.description?.component).toMatch(/112:1710/);
    expect(module.searchFieldMeta.parameters?.docs?.description?.component).toMatch(/40px/i);
    expect(module.searchFieldMeta.parameters?.docs?.description?.component).toMatch(/360px/i);
  });
});
