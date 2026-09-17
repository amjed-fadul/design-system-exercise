import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const radioGroupModulePath = './RadioGroup';

async function loadRadioGroupModule() {
  const module = await import(/* @vite-ignore */ radioGroupModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

const roleOptions = [
  {
    value: 'member',
    label: 'Member',
    description: 'Use the workspace without managing people.',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Invite people and manage members and roles.',
  },
] as const;

describe('RadioGroup public runtime', () => {
  it('renders semantic fieldset/legend and same-named required native radios without invented ARIA roles', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    const { container } = render(
      <RadioGroup label="Role" name="role" options={roleOptions} />,
    );

    const group = screen.getByRole('group', { name: 'Role' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group).not.toHaveAttribute('role');
    expect(container.querySelector('legend')).toHaveTextContent('Role');
    expect(container.querySelector('.dse-radio-group__required-indicator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios.map((radio) => radio.getAttribute('name'))).toEqual(['role', 'role']);
    expect(radios.map((radio) => radio.getAttribute('value'))).toEqual(['member', 'admin']);
    expect(radios.every((radio) => radio.hasAttribute('required'))).toBe(true);
    expect(radios.every((radio) => !radio.hasAttribute('tabindex'))).toBe(true);
  });

  it('does not automatically select the first option when value and defaultValue are omitted', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    render(<RadioGroup label="Role" name="role" options={roleOptions} />);

    expect(screen.getByRole('radio', { name: 'Member' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Admin' })).not.toBeChecked();
  });

  it('supports uncontrolled selection and emits onValueChange once for a real selection change', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup
        label="Role"
        name="role"
        options={roleOptions}
        defaultValue="member"
        onValueChange={onValueChange}
      />,
    );

    const member = screen.getByRole('radio', { name: 'Member' });
    const admin = screen.getByRole('radio', { name: 'Admin' });
    expect(member).toBeChecked();
    expect(admin).not.toBeChecked();

    await user.click(admin);

    expect(member).not.toBeChecked();
    expect(admin).toBeChecked();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('admin');
  });

  it('supports controlled selection without maintaining a second source of truth', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    function ControlledExample() {
      const [value, setValue] = useState('member');
      return (
        <RadioGroup
          label="Role"
          name="role"
          options={roleOptions}
          value={value}
          onValueChange={(nextValue: string) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }

    render(<ControlledExample />);
    await user.click(screen.getByRole('radio', { name: 'Admin' }));

    expect(screen.getByRole('radio', { name: 'Member' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Admin' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('admin');
  });

  it('associates optional descriptions and makes the visible option row an understandable label target', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    const user = userEvent.setup();
    render(<RadioGroup label="Role" name="role" options={roleOptions} />);

    const admin = screen.getByRole('radio', { name: 'Admin' });
    const describedBy = admin.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      'Invite people and manage members and roles.',
    );

    await user.click(screen.getByText('Admin'));
    expect(admin).toBeChecked();
  });

  it('keeps disabled ownership per option and preserves a disabled selected value', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const options = [roleOptions[0], { ...roleOptions[1], disabled: true }] as const;

    render(
      <RadioGroup
        label="Role"
        name="role"
        options={options}
        defaultValue="admin"
        onValueChange={onValueChange}
      />,
    );

    const member = screen.getByRole('radio', { name: 'Member' });
    const admin = screen.getByRole('radio', { name: 'Admin' });
    expect(admin).toBeDisabled();
    expect(admin).toBeChecked();

    await user.click(admin);
    expect(admin).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(member);
    expect(member).toBeChecked();
    expect(admin).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('member');
  });

  it('supports required=false consistently without a visual required indicator', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    const { container } = render(
      <RadioGroup label="Role" name="role" options={roleOptions} required={false} />,
    );

    expect(screen.getAllByRole('radio').every((radio) => !radio.hasAttribute('required'))).toBe(true);
    expect(container.querySelector('.dse-radio-group__required-indicator')).toBeNull();
  });

  it('rejects fewer than two options and duplicate option values at runtime', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;

    expect(() =>
      render(
        <RadioGroup
          label="Role"
          name="role"
          options={[roleOptions[0]] as any}
        />,
      ),
    ).toThrow(/at least two/i);

    expect(() =>
      render(
        <RadioGroup
          label="Role"
          name="role"
          options={[
            { value: 'same', label: 'First' },
            { value: 'same', label: 'Second' },
          ] as any}
        />,
      ),
    ).toThrow(/unique/i);
  });

  it('fails closed for forbidden untyped group props instead of leaking them into fieldset or radios', async () => {
    const module = await loadRadioGroupModule();
    if (!module) return;

    const { RadioGroup } = module;
    render(
      <RadioGroup
        {...({
          children: 'forbidden',
          state: 'hover',
          selected: 'member',
          selectedValue: 'member',
          showDescription: false,
          invalid: true,
          errorMessage: 'Nope',
          role: 'radiogroup',
          disabled: true,
        } as any)}
        label="Role"
        name="role"
        options={roleOptions}
      />,
    );

    const group = screen.getByRole('group', { name: 'Role' });
    expect(group).not.toHaveAttribute('state');
    expect(group).not.toHaveAttribute('selected');
    expect(group).not.toHaveAttribute('selectedValue');
    expect(group).not.toHaveAttribute('showDescription');
    expect(group).not.toHaveAttribute('invalid');
    expect(group).not.toHaveAttribute('errorMessage');
    expect(group).not.toHaveAttribute('role');
    expect(group).not.toBeDisabled();
    expect(group).not.toHaveTextContent('forbidden');
    expect(screen.getAllByRole('radio').every((radio) => !radio.hasAttribute('disabled'))).toBe(true);
  });

  it('exports RadioGroup publicly while keeping the private RadioOption unreachable', async () => {
    const packageModule = await import('../index');
    expect(packageModule.RadioGroup).toBeTruthy();
    expect('RadioOption' in packageModule).toBe(false);
  });
});
