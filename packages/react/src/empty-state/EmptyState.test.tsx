import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const modulePath = './EmptyState';
const publicModulePath = '../index';

async function loadModule() {
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

async function loadPublicModule() {
  const module = await import(/* @vite-ignore */ publicModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('EmptyState public runtime', () => {
  it('renders the approved named empty region and polite text status by default', async () => {
    const module = await loadModule();
    if (!module) return;
    const { EmptyState } = module;

    render(<EmptyState />);

    const region = screen.getByRole('region', { name: 'No people found' });
    const title = screen.getByRole('heading', { name: 'No people found' });
    const status = screen.getByRole('status');

    expect(title.tagName).toBe('H2');
    expect(region).toContainElement(status);
    expect(status).toContainElement(title);
    expect(status).toHaveTextContent('No names or email addresses match “zoe”.');
    expect(status).toHaveTextContent('Try a different search or clear it to see everyone.');
    expect(status).toHaveAttribute('aria-atomic', 'true');

    const icon = region.querySelector('.dse-empty-state__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('.dse-empty-state__default-icon')).toBeInTheDocument();
    expect(region.querySelector('.dse-empty-state__actions')).toBeNull();
  });

  it('removes optional icon and body context without removing the title explanation', async () => {
    const module = await loadModule();
    if (!module) return;
    const { EmptyState } = module;

    render(<EmptyState showIcon={false} showBody={false} title="Nothing saved yet" />);

    const region = screen.getByRole('region', { name: 'Nothing saved yet' });
    expect(screen.getByRole('heading', { name: 'Nothing saved yet' })).toBeInTheDocument();
    expect(region.querySelector('.dse-empty-state__icon')).toBeNull();
    expect(region.querySelector('.dse-empty-state__body')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Nothing saved yet');
  });

  it('keeps custom decorative icon and recovery actions outside the live status message', async () => {
    const module = await loadModule();
    if (!module) return;
    const { EmptyState } = module;
    const onRecover = vi.fn();

    render(
      <EmptyState
        icon={<svg data-testid="custom-icon" viewBox="0 0 24 24" />}
        actions={<button onClick={onRecover}>Clear search</button>}
      />,
    );

    const region = screen.getByRole('region', { name: 'No people found' });
    const status = screen.getByRole('status');
    const action = screen.getByRole('button', { name: 'Clear search' });
    const icon = screen.getByTestId('custom-icon');

    expect(region.querySelector('.dse-empty-state__icon')).toContainElement(icon);
    expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(status).not.toContainElement(action);
    expect(region.querySelector('.dse-empty-state__actions')).toContainElement(action);
  });

  it('does not move focus when the empty state appears', async () => {
    const module = await loadModule();
    if (!module) return;
    const { EmptyState } = module;

    const { rerender } = render(<button>Before</button>);
    const before = screen.getByRole('button', { name: 'Before' });
    before.focus();
    expect(before).toHaveFocus();

    rerender(
      <>
        <button>Before</button>
        <EmptyState actions={<button>Clear search</button>} />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  });

  it('rejects an empty title and a visible empty body', async () => {
    const module = await loadModule();
    if (!module) return;
    const { EmptyState } = module;

    expect(() => render(<EmptyState title="   " />)).toThrow(/non-empty title/i);
    expect(() => render(<EmptyState body="   " />)).toThrow(/non-empty body/i);
    expect(() => render(<EmptyState body="   " showBody={false} />)).not.toThrow();
  });

  it('does not leak forbidden workflow or live-region override props', async () => {
    const module = await loadModule();
    if (!module) return;
    const { EmptyState } = module;

    render(
      <EmptyState
        {...({
          loading: true,
          error: 'Failed',
          resultCount: 0,
          query: 'zoe',
          role: 'alert',
          'aria-live': 'assertive',
          children: <span>Injected child</span>,
        } as any)}
      />,
    );

    const region = screen.getByRole('region', { name: 'No people found' });
    expect(region).not.toHaveAttribute('data-loading');
    expect(region).not.toHaveAttribute('data-error');
    expect(region).not.toHaveAttribute('data-result-count');
    expect(region).not.toHaveAttribute('data-query');
    expect(region).not.toHaveAttribute('role', 'alert');
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-live', 'assertive');
    expect(screen.queryByText('Injected child')).toBeNull();
  });

  it('is exported through the public React package surface', async () => {
    const module = await loadPublicModule();
    if (!module) return;
    expect(module.EmptyState).toBeDefined();
  });
});
