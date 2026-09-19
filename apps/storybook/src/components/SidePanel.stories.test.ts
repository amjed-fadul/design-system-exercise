import { describe, expect, it } from 'vitest';

const storyModulePath = './SidePanel.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Side Panel Storybook contract', () => {
  it('exposes the governed presentation controls without modal or workflow-state controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.sidePanelMeta.argTypes ?? {};
    for (const publicControl of ['eyebrow', 'showClose', 'closeLabel']) {
      expect(argTypes).toHaveProperty(publicControl);
    }
    for (const slot of ['header', 'children', 'actions', 'onClose', 'className', 'style']) {
      expect(argTypes[slot]?.control).toBe(false);
    }
    for (const forbidden of [
      'open',
      'onOpenChange',
      'modal',
      'ariaModal',
      'dismissOnBackdrop',
      'initialFocusRef',
      'trapFocus',
      'restoreFocus',
      'escapeToClose',
      'requestStatus',
      'pending',
      'validation',
      'dirty',
      'showHeader',
      'size',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers Light/Dark × English/Arabic plus scrolling and host-sized dedicated detail evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'MemberDetails',
      'DarkMemberDetails',
      'ArabicMemberDetails',
      'DarkArabicMemberDetails',
      'LongBody',
      'DedicatedDetail',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.DarkMemberDetails.parameters?.presentation?.theme).toBe('dark');
    expect(module.ArabicMemberDetails.parameters?.presentation?.language).toBe('arabic');
    expect(module.DarkArabicMemberDetails.parameters?.presentation).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.ArabicMemberDetails.args?.eyebrow).toMatch(/[\u0600-\u06FF]/);
    expect(module.DedicatedDetail.args?.showClose).toBe(false);
    expect(module.DedicatedDetail.args?.style).toEqual(
      expect.objectContaining({ inlineSize: '640px' }),
    );
  });

  it('documents non-modal semantics, scrolling ownership, and wrapper responsibilities', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.sidePanelMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.side-panel@1\.0\.0/);
    expect(description).toMatch(/non-modal/i);
    expect(description).toMatch(/scroll/i);
    expect(description).toMatch(/focus/i);
    expect(description).toMatch(/backdrop|portal|wrapper/i);
    expect(description).toMatch(/dirty|request|save/i);
    expect(description).toMatch(/pattern|workflow|host/i);
  });
});
