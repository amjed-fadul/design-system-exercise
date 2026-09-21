import { describe, expect, it } from 'vitest';

const storyModulePath = './RadioGroup.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Radio Group Storybook contract', () => {
  it('documents only the approved Radio Group public controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.radioGroupMeta.argTypes ?? {};
    expect(Object.keys(argTypes).sort()).toEqual(
      [
        'defaultValue',
        'label',
        'name',
        'onValueChange',
        'options',
        'required',
        'value',
      ].sort(),
    );
    expect(argTypes.onValueChange).toEqual(expect.objectContaining({ control: false }));
  });

  it('does not expose internal, Figma-state, validation, product-role, arbitrary-children, or group-disabled controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.radioGroupMeta.argTypes ?? {};
    for (const forbidden of [
      'children',
      'state',
      'selected',
      'selectedValue',
      'showDescription',
      'invalid',
      'errorMessage',
      'role',
      'disabled',
      'RadioOption',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('includes required, product-fixture, controlled, description, disabled-option, wrapping, focus, and Arabic evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'RequiredRoles',
      'TeamAccess',
      'ControlledSelection',
      'Descriptions',
      'WithoutDescriptions',
      'DisabledOption',
      'LongDescription',
      'Focused',
      'Arabic',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.TeamAccess.args?.defaultValue).toBe('member');
    expect(module.ControlledSelection.render).toEqual(expect.any(Function));
    expect(module.Focused.play).toEqual(expect.any(Function));
    expect(module.Arabic.args?.label).toBe('الدور');
  });

  it('documents native group boundaries and keeps Member preselection product-specific', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.radioGroupMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/native/i);
    expect(description).toMatch(/at least two/i);
    expect(description).toMatch(/Member.*product|product.*Member/i);
    expect(module.radioGroupMeta.args?.defaultValue).toBeUndefined();
  });
});
