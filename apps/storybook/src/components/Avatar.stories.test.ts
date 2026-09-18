import { describe, expect, it } from 'vitest';

const storyModulePath = './Avatar.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Avatar Storybook contract', () => {
  it('exposes only the approved public controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.avatarMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(['aria-label', 'initials', 'size'].sort());
    expect(argTypes.size?.options).toEqual(['sm', 'lg']);
    for (const forbidden of [
      'content',
      'src',
      'alt',
      'photo',
      'presence',
      'online',
      'role',
      'status',
      'verified',
      'selected',
      'name',
      'onClick',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers sm, lg, and fallback across Light/Dark × English/Arabic', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'SmallInitials',
      'LargeInitials',
      'Fallback',
      'DarkSmallInitials',
      'DarkLargeInitials',
      'DarkFallback',
      'ArabicSmallInitials',
      'ArabicLargeInitials',
      'ArabicFallback',
      'DarkArabicSmallInitials',
      'DarkArabicLargeInitials',
      'DarkArabicFallback',
      'LabeledStandalone',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.LargeInitials.args?.size).toBe('lg');
    expect(module.Fallback.args?.initials).toBeUndefined();
    expect(module.DarkSmallInitials.globals?.theme).toBe('dark');
    expect(module.DarkLargeInitials.globals?.theme).toBe('dark');
    expect(module.DarkFallback.globals?.theme).toBe('dark');
    expect(module.ArabicSmallInitials.globals?.language).toBe('arabic');
    expect(module.ArabicLargeInitials.globals?.language).toBe('arabic');
    expect(module.ArabicFallback.globals?.language).toBe('arabic');
    expect(module.ArabicSmallInitials.args?.initials).toMatch(/[\u0600-\u06FF]/);
    expect(module.DarkArabicSmallInitials.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.DarkArabicLargeInitials.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.DarkArabicFallback.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
  });

  it('documents geometry, derived fallback, and accessibility boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.avatarMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/32.*48|48.*32/);
    expect(description).toMatch(/fallback.*@|@.*fallback/i);
    expect(description).toMatch(/aria-hidden/i);
    expect(description).toMatch(/role=img|image-like/i);
    expect(description).toMatch(/does not infer|never infer/i);
    expect(module.LabeledStandalone.args?.['aria-label']).toBeTruthy();
  });
});
