import { describe, expect, it } from 'vitest';

const storyModulePath = './InlineFeedback.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Inline Feedback Storybook contract', () => {
  it('exposes only the approved public controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.inlineFeedbackMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(['intent', 'message', 'title'].sort());
    for (const forbidden of ['children', 'showTitle', 'action', 'dismissible', 'role', 'aria-live']) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('includes error, success, titleless, wrapping, and Light/Dark × English/Arabic evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Error',
      'Success',
      'WithoutTitle',
      'LongMessage',
      'DarkError',
      'DarkSuccess',
      'ArabicError',
      'ArabicSuccess',
      'DarkArabicError',
      'DarkArabicSuccess',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.DarkError.globals?.theme).toBe('dark');
    expect(module.DarkSuccess.globals?.theme).toBe('dark');
    expect(module.ArabicError.globals?.language).toBe('arabic');
    expect(module.ArabicSuccess.globals?.language).toBe('arabic');
    expect(module.DarkArabicError.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.DarkArabicSuccess.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
  });

  it('documents the exact Figma authority and semantic announcement boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.inlineFeedbackMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/127:30/);
    expect(description).toMatch(/role=alert|alert/i);
    expect(description).toMatch(/role=status|status/i);
    expect(description).toMatch(/showTitle.*derived|derived.*showTitle/i);
    expect(description).toMatch(/sibling.*Button|Button.*sibling/i);
  });
});
