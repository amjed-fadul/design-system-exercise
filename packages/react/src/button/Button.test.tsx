import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const buttonModulePath = './Button';

async function loadButtonModule() {
  const module = await import(/* @vite-ignore */ buttonModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Button public API', () => {
  it('renders a native button with a safe default type', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    render(<Button>Send invite</Button>);

    expect(screen.getByRole('button', { name: 'Send invite' })).toHaveAttribute('type', 'button');
  });

  it('uses native disabled semantics', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    render(<Button disabled>Send invite</Button>);

    expect(screen.getByRole('button', { name: 'Send invite' })).toBeDisabled();
  });

  it('exposes contract-backed emphasis and tone', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    render(
      <Button emphasis="secondary" tone="critical">
        Remove
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Remove' });
    expect(button).toHaveAttribute('data-emphasis', 'secondary');
    expect(button).toHaveAttribute('data-tone', 'critical');
  });

  it('forwards native attributes, click behavior, and the button ref', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();

    render(
      <Button
        ref={ref}
        name="member-action"
        value="save"
        aria-describedby="button-help"
        onClick={onClick}
      >
        Save changes
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toHaveAttribute('name', 'member-action');
    expect(button).toHaveAttribute('value', 'save');
    expect(button).toHaveAttribute('aria-describedby', 'button-help');
    expect(ref.current).toBe(button);

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('announces loading and blocks activation without native disabled', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button loading loadingLabel="Sending…" onClick={onClick}>
        Send invite
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Sending…' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
    expect(button.querySelectorAll('.dse-button__layer')).toHaveLength(2);
    expect(button.querySelector('[data-layer="normal"]')).toHaveAttribute('aria-hidden', 'true');
    expect(button.querySelector('[data-layer="loading"]')).not.toHaveAttribute('aria-hidden');

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an optional decorative icon in logical leading or trailing order', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    const icon = <svg data-icon="test" />;
    const { rerender } = render(
      <Button icon={icon} iconPosition="leading">
        Continue
      </Button>,
    );

    let button = screen.getByRole('button', { name: 'Continue' });
    let normalLayer = button.querySelector('[data-layer="normal"]');
    expect(normalLayer?.children).toHaveLength(2);
    expect(normalLayer?.children[0]).toHaveClass('dse-button__icon');
    expect(normalLayer?.children[0]).toHaveAttribute('aria-hidden', 'true');
    expect(normalLayer?.children[1]).toHaveClass('dse-button__label');

    rerender(
      <Button icon={icon} iconPosition="trailing">
        Continue
      </Button>,
    );

    button = screen.getByRole('button', { name: 'Continue' });
    normalLayer = button.querySelector('[data-layer="normal"]');
    expect(normalLayer?.children[0]).toHaveClass('dse-button__label');
    expect(normalLayer?.children[1]).toHaveClass('dse-button__icon');
  });

  it('does not render an icon wrapper when icon content is absent', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    render(<Button>Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' }).querySelector('.dse-button__icon')).toBeNull();
  });

  it('preserves native disabled semantics while loading', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const { Button } = module;
    render(
      <Button disabled loading loadingLabel="Saving…">
        Save changes
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving…' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
