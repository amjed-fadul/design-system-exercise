import { describe, expect, it } from 'vitest';

const storyModulePath = './Dialog.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Dialog Storybook contract', () => {
  it('exposes the governed visual/runtime controls without business-state controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.dialogMeta.argTypes ?? {};
    for (const publicControl of ['title', 'description', 'showClose', 'closeLabel']) {
      expect(argTypes).toHaveProperty(publicControl);
    }
    for (const forbidden of [
      'onSubmit',
      'requestStatus',
      'state',
      'pending',
      'validation',
      'dirty',
      'dismissOnBackdrop',
      'showDescription',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers Light/Dark × English/Arabic plus decision and title-only evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'InviteMember',
      'DarkInviteMember',
      'ArabicInviteMember',
      'DarkArabicInviteMember',
      'ConfirmDiscard',
      'WithoutDescription',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.DarkInviteMember.parameters?.presentation?.theme).toBe('dark');
    expect(module.ArabicInviteMember.parameters?.presentation?.language).toBe('arabic');
    expect(module.DarkArabicInviteMember.parameters?.presentation).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.ArabicInviteMember.args?.title).toMatch(/[\u0600-\u06FF]/);
    expect(module.WithoutDescription.args?.description).toBeUndefined();
  });

  it('documents modal behavior and workflow ownership', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.dialogMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.dialog@1\.0\.0/);
    expect(description).toMatch(/modal/i);
    expect(description).toMatch(/focus/i);
    expect(description).toMatch(/escape/i);
    expect(description).toMatch(/backdrop|outside/i);
    expect(description).toMatch(/onSubmit|requestStatus|business state/i);
    expect(description).toMatch(/pattern|workflow/i);
  });
});
