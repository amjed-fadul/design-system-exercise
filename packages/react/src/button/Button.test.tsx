import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

async function loadButtonModule() {
  const module = await import('./Button').catch(() => null);
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
});
