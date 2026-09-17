import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const linkModulePath = './Link';

async function loadLinkModule() {
  const module = await import(/* @vite-ignore */ linkModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Link public API', () => {
  it('renders a native anchor with visible content and href', async () => {
    const module = await loadLinkModule();
    if (!module) return;

    const { Link } = module;
    render(<Link href="/workspace">Workspace</Link>);

    const link = screen.getByRole('link', { name: 'Workspace' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/workspace');
  });

  it('forwards native anchor attributes, className, and the anchor ref', async () => {
    const module = await loadLinkModule();
    if (!module) return;

    const { Link } = module;
    const ref = createRef<HTMLAnchorElement>();

    render(
      <Link
        ref={ref}
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="workspace-link-help"
        aria-current="page"
        className="product-link"
      >
        Workspace docs
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Workspace docs' });
    expect(link).toHaveClass('dse-link', 'product-link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('aria-describedby', 'workspace-link-help');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(ref.current).toBe(link);
  });

  it('keeps pointer activation native and forwards onClick', async () => {
    const module = await loadLinkModule();
    if (!module) return;

    const { Link } = module;
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const user = userEvent.setup();

    render(
      <Link href="/members" onClick={onClick}>
        View members
      </Link>,
    );

    await user.click(screen.getByRole('link', { name: 'View members' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses native keyboard activation for an href-backed anchor', async () => {
    const module = await loadLinkModule();
    if (!module) return;

    const { Link } = module;
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const user = userEvent.setup();

    render(
      <Link href="/members" onClick={onClick}>
        View members
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'View members' });
    link.focus();
    expect(link).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
