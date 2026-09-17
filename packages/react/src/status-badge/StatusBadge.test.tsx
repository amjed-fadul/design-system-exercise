import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const modulePath = './StatusBadge';

async function loadModule() {
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Status Badge public runtime', () => {
  it('renders the required product label as static native text', async () => {
    const module = await loadModule();
    if (!module) return;

    const { StatusBadge } = module;
    render(<StatusBadge label="Active" />);

    const badge = screen.getByText('Active');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('dse-status-badge');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('aria-live');
    expect(badge).not.toHaveAttribute('tabindex');
  });

  it('preserves product-supplied labels without interpreting them as variants', async () => {
    const module = await loadModule();
    if (!module) return;

    const { StatusBadge } = module;
    const { rerender } = render(<StatusBadge label="Invitation pending" />);
    expect(screen.getByText('Invitation pending')).not.toHaveAttribute('data-status');
    expect(screen.getByText('Invitation pending')).not.toHaveAttribute('data-tone');

    rerender(<StatusBadge label="دعوة معلّقة" />);
    expect(screen.getByText('دعوة معلّقة')).toBeInTheDocument();
  });

  it('rejects empty or whitespace-only labels', async () => {
    const module = await loadModule();
    if (!module) return;

    const { StatusBadge } = module;
    expect(() => render(<StatusBadge label="" />)).toThrow(/non-empty label/i);
    expect(() => render(<StatusBadge label="   " />)).toThrow(/non-empty label/i);
  });

  it('keeps the governed non-interactive boundary authoritative for untyped callers', async () => {
    const module = await loadModule();
    if (!module) return;

    const { StatusBadge } = module;
    const onClick = vi.fn();
    const conflicts = {
      role: 'alert',
      'aria-live': 'assertive',
      tabIndex: 0,
      onClick,
      children: 'Injected',
      status: 'success',
      tone: 'positive',
      icon: 'check',
    } as any;

    render(<StatusBadge label="Active" {...conflicts} />);
    const badge = screen.getByText('Active');

    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('aria-live');
    expect(badge).not.toHaveAttribute('tabindex');
    expect(badge).not.toHaveAttribute('data-status');
    expect(badge).not.toHaveAttribute('data-tone');
    expect(badge).not.toHaveTextContent('Injected');
    badge.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
