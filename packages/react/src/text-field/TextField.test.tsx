import { createRef, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const textFieldModulePath = './TextField';

async function loadTextFieldModule() {
  const module = await import(/* @vite-ignore */ textFieldModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('TextField public API', () => {
  it('renders an explicitly associated visible label and native input', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    render(<TextField label="Email address" id="member-email" name="email" />);

    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('id', 'member-email');
    expect(input).toHaveAttribute('name', 'email');
    expect(screen.getByText('Email address')).toHaveAttribute('for', 'member-email');
  });

  it('generates a stable input id when the consumer omits id', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    const { rerender } = render(<TextField label="Display name" />);

    const first = screen.getByRole('textbox', { name: 'Display name' });
    const generatedId = first.getAttribute('id');
    expect(generatedId).toBeTruthy();
    expect(screen.getByText('Display name')).toHaveAttribute('for', generatedId);

    rerender(<TextField label="Display name" />);
    expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveAttribute('id', generatedId);
  });

  it('forwards native input attributes, disabled/required semantics, className, and the input ref', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    const ref = createRef<HTMLInputElement>();

    render(
      <TextField
        ref={ref}
        label="Email address"
        name="email"
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
        required
        disabled
        className="member-email-field"
        data-product-field="member-email"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'name@example.com');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('data-product-field', 'member-email');
    expect(ref.current).toBe(input);
    expect(input.closest('.dse-text-field')).toHaveClass('member-email-field');
  });

  it('supports uncontrolled defaultValue editing through native input behavior', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    const user = userEvent.setup();
    render(<TextField label="Full name" defaultValue="Alex" />);

    const input = screen.getByRole('textbox', { name: 'Full name' });
    expect(input).toHaveValue('Alex');
    await user.type(input, ' Morgan');
    expect(input).toHaveValue('Alex Morgan');
  });

  it('supports controlled value updates through native onChange', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    const user = userEvent.setup();

    function ControlledField() {
      const [value, setValue] = useState('Alex');
      return (
        <TextField
          label="Full name"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      );
    }

    render(<ControlledField />);
    const input = screen.getByRole('textbox', { name: 'Full name' });
    await user.clear(input);
    await user.type(input, 'Samira');
    expect(input).toHaveValue('Samira');
  });

  it('associates supporting text while preserving consumer aria-describedby', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    render(
      <>
        <p id="external-help">Account-level guidance</p>
        <TextField
          label="Email address"
          supportingText="One person per invitation."
          aria-describedby="external-help"
        />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Email address' });
    const message = screen.getByText('One person per invitation.');
    expect(message.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toEqual(
      expect.arrayContaining(['external-help', message.id]),
    );
  });

  it('maps semantic invalid state to aria-invalid and described error content', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    render(
      <TextField
        label="Email address"
        supportingText="One person per invitation."
        invalid
        errorMessage="Enter a valid email address."
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email address' });
    const error = screen.getByText('Enter a valid email address.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toContain(error.id);
    expect(screen.queryByText('One person per invitation.')).toBeNull();
    expect(error).toHaveClass('dse-text-field__message', 'dse-text-field__message--invalid');
  });

  it('keeps supporting text as the described message when invalid has no errorMessage', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    render(<TextField label="Email address" invalid supportingText="Check this value." />);

    const input = screen.getByRole('textbox', { name: 'Email address' });
    const message = screen.getByText('Check this value.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toContain(message.id);
    expect(message).toHaveClass('dse-text-field__message--invalid');
  });

  it('renders a decorative required indicator and composes the private default-size shell', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    const { container } = render(<TextField label="Email address" required />);

    expect(container.querySelector('.dse-text-field__required-indicator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(container.querySelector('.dse-input-control')).toHaveAttribute('data-size', 'default');
  });

  it('forwards onChange exactly once per native change', async () => {
    const module = await loadTextFieldModule();
    if (!module) return;

    const { TextField } = module;
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TextField label="Code" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Code' }), 'A');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
