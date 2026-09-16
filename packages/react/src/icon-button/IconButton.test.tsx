import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const iconButtonModulePath = './IconButton';

async function loadIconButtonModule() {
  const module = await import(/* @vite-ignore */ iconButtonModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

const closeIcon = (
  <svg data-icon="close" viewBox="0 0 20 20">
    <path d="M5 5 15 15M15 5 5 15" />
  </svg>
);

describe('IconButton public API', () => {
  it('renders a native button with a safe default type and required accessible name', async () => {
    const module = await loadIconButtonModule();
    if (!module) return;

    const { IconButton } = module;
    render(<IconButton icon={closeIcon} aria-label="Close member details" />);

    expect(screen.getByRole('button', { name: 'Close member details' })).toHaveAttribute('type', 'button');
  });

  it('keeps icon content decorative so aria-label owns the accessible name', async () => {
    const module = await loadIconButtonModule();
    if (!module) return;

    const { IconButton } = module;
    render(<IconButton icon={closeIcon} aria-label="Close member details" />);

    const button = screen.getByRole('button', { name: 'Close member details' });
    const icon = button.querySelector('.dse-icon-button__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('[data-icon="close"]')).not.toBeNull();
  });

  it('uses native disabled semantics and suppresses activation', async () => {
    const module = await loadIconButtonModule();
    if (!module) return;

    const { IconButton } = module;
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <IconButton
        icon={closeIcon}
        aria-label="Close member details"
        disabled
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: 'Close member details' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards native attributes, className, click behavior, and the button ref', async () => {
    const module = await loadIconButtonModule();
    if (!module) return;

    const { IconButton } = module;
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();

    render(
      <IconButton
        ref={ref}
        icon={closeIcon}
        aria-label="Clear search"
        aria-describedby="clear-search-help"
        name="clear-search"
        value="clear"
        className="product-clear-control"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: 'Clear search' });
    expect(button).toHaveClass('dse-icon-button', 'product-clear-control');
    expect(button).toHaveAttribute('aria-describedby', 'clear-search-help');
    expect(button).toHaveAttribute('name', 'clear-search');
    expect(button).toHaveAttribute('value', 'clear');
    expect(ref.current).toBe(button);

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('preserves an explicit native button type override', async () => {
    const module = await loadIconButtonModule();
    if (!module) return;

    const { IconButton } = module;
    render(<IconButton icon={closeIcon} aria-label="Submit compact action" type="submit" />);

    expect(screen.getByRole('button', { name: 'Submit compact action' })).toHaveAttribute('type', 'submit');
  });
});
