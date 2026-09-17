import { describe, expect, it } from 'vitest';

const storyModulePath = './TextField.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Text Field Storybook contract', () => {
  it('documents the supported semantic and native field controls without exposing internal representation axes', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.textFieldMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(
      [
        'defaultValue',
        'disabled',
        'errorMessage',
        'invalid',
        'label',
        'placeholder',
        'required',
        'supportingText',
      ].sort(),
    );
  });

  it('does not expose Figma-only or internal Text Field controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.textFieldMeta.argTypes ?? {};
    for (const forbidden of ['state', 'content', 'size', 'showSupportingText', 'children']) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('includes the required state, content, localization, and focus evidence stories', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Empty',
      'Filled',
      'Required',
      'Disabled',
      'Invalid',
      'InvalidFocused',
      'LongSupportingText',
      'ArabicEmail',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.InvalidFocused.play).toEqual(expect.any(Function));
    expect(module.ArabicEmail.args).toEqual(
      expect.objectContaining({
        label: 'البريد الإلكتروني',
        defaultValue: 'alex@example.com',
        dir: 'ltr',
      }),
    );
  });
});
