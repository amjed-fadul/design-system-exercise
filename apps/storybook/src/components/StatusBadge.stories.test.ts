import { describe, expect, it } from 'vitest';

const storyModulePath = './StatusBadge.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Status Badge Storybook contract', () => {
  it('exposes only the approved label control', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.statusBadgeMeta.argTypes ?? {};
    expect(Object.keys(argTypes)).toEqual(['label']);
    for (const forbidden of [
      'status',
      'tone',
      'size',
      'selected',
      'icon',
      'dismissible',
      'onClick',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers product labels across Light/Dark × English/Arabic intersections', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Active',
      'InvitationPending',
      'DarkActive',
      'DarkInvitationPending',
      'ArabicActive',
      'ArabicInvitationPending',
      'DarkArabicActive',
      'DarkArabicInvitationPending',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.Active.args?.label).toBe('Active');
    expect(module.InvitationPending.args?.label).toBe('Invitation pending');
    expect(module.DarkActive.parameters?.presentation?.theme).toBe('dark');
    expect(module.DarkInvitationPending.parameters?.presentation?.theme).toBe('dark');
    expect(module.ArabicActive.parameters?.presentation?.language).toBe('arabic');
    expect(module.ArabicInvitationPending.parameters?.presentation?.language).toBe('arabic');
    expect(module.ArabicActive.args?.label).toMatch(/[\u0600-\u06FF]/);
    expect(module.ArabicInvitationPending.args?.label).toMatch(/[\u0600-\u06FF]/);
    expect(module.DarkArabicActive.parameters?.presentation).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.DarkArabicInvitationPending.parameters?.presentation).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
  });

  it('documents the neutral visual and accessibility boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.statusBadgeMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/28px|28 px/i);
    expect(description).toMatch(/5px.*10px|10px.*5px/i);
    expect(description).toMatch(/neutral/i);
    expect(description).toMatch(/no tone|tone.*not.*variant|no.*status enum/i);
    expect(description).toMatch(/not an alert|no.*live region|static.*alert/i);
    expect(description).toMatch(/product.*owns|product-supplied/i);
  });
});
