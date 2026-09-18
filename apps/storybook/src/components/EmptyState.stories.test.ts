import { describe, expect, it } from 'vitest';

const storyModulePath = './EmptyState.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Empty State Storybook contract', () => {
  it('exposes only the governed presentation controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.emptyStateMeta.argTypes ?? {};
    for (const publicControl of ['title', 'body', 'showIcon', 'showBody']) {
      expect(argTypes).toHaveProperty(publicControl);
    }
    for (const forbidden of [
      'loading',
      'error',
      'reason',
      'resultCount',
      'query',
      'onClear',
      'onRetry',
      'status',
      'tone',
      'state',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers Light/Dark × English/Arabic and the optional-content boundaries', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'NoResults',
      'DarkNoResults',
      'ArabicNoResults',
      'DarkArabicNoResults',
      'WithoutBody',
      'WithoutIcon',
      'TwoActions',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.DarkNoResults.globals?.theme).toBe('dark');
    expect(module.ArabicNoResults.globals?.language).toBe('arabic');
    expect(module.DarkArabicNoResults.globals).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.ArabicNoResults.args?.title).toMatch(/[\u0600-\u06FF]/);
    expect(module.WithoutBody.args?.showBody).toBe(false);
    expect(module.WithoutIcon.args?.showIcon).toBe(false);
  });

  it('documents status semantics and ownership boundaries', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.emptyStateMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.empty-state@1\.0\.0/);
    expect(description).toMatch(/status|announce|live/i);
    expect(description).toMatch(/focus/i);
    expect(description).toMatch(/loading/i);
    expect(description).toMatch(/error/i);
    expect(description).toMatch(/query|filter/i);
    expect(description).toMatch(/pattern|workflow|product/i);
    expect(description).toMatch(/two|2.*actions?/i);
  });
});
