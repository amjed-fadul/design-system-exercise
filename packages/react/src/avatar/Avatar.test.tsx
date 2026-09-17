import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const modulePath = './Avatar';

async function loadModule() {
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Avatar public runtime', () => {
  it('renders supplied initials as a decorative sm Avatar by default', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    render(<Avatar initials="AF" data-testid="avatar" />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveTextContent('AF');
    expect(avatar).toHaveAttribute('data-size', 'sm');
    expect(avatar).toHaveAttribute('data-content', 'initials');
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
    expect(avatar).not.toHaveAttribute('role');
    expect(avatar).not.toHaveAttribute('tabindex');
  });

  it('derives the governed fallback when initials are absent or whitespace-only', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    const { rerender } = render(<Avatar data-testid="avatar" />);

    let avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveTextContent('@');
    expect(avatar).toHaveAttribute('data-content', 'fallback');

    rerender(<Avatar initials="   " data-testid="avatar" />);
    avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveTextContent('@');
    expect(avatar).toHaveAttribute('data-content', 'fallback');
  });

  it('preserves supplied Arabic initials and exposes the lg size without inferring content', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    render(<Avatar initials="أف" size="lg" dir="rtl" data-testid="avatar" />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveTextContent('أف');
    expect(avatar).toHaveAttribute('data-size', 'lg');
    expect(avatar).toHaveAttribute('data-content', 'initials');
    expect(avatar).toHaveAttribute('dir', 'rtl');
  });

  it('uses image-like semantics only when a non-empty aria-label is supplied', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    const { rerender } = render(<Avatar initials="AF" aria-label="Amjed Fadul" />);

    let avatar = screen.getByRole('img', { name: 'Amjed Fadul' });
    expect(avatar).not.toHaveAttribute('aria-hidden');

    rerender(<Avatar initials="AF" aria-label="   " data-testid="avatar" />);
    avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
    expect(avatar).not.toHaveAttribute('role');
    expect(avatar).not.toHaveAttribute('aria-label');
  });

  it('keeps governed accessibility semantics authoritative over untyped conflicting attributes', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    const labeledConflicts = { role: 'button', 'aria-hidden': true } as any;
    const decorativeConflicts = { role: 'button', 'aria-hidden': false } as any;
    const { rerender } = render(
      <Avatar initials="AF" aria-label="Amjed Fadul" data-testid="avatar" {...labeledConflicts} />,
    );

    let avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('role', 'img');
    expect(avatar).toHaveAttribute('aria-label', 'Amjed Fadul');
    expect(avatar).not.toHaveAttribute('aria-hidden');

    rerender(<Avatar initials="AF" data-testid="avatar" {...decorativeConflicts} />);
    avatar = screen.getByTestId('avatar');
    expect(avatar).not.toHaveAttribute('role');
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ordinary span attributes and merges consumer className', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    render(<Avatar initials="AF" id="profile-avatar" className="consumer-avatar" data-source="profile" />);

    const avatar = document.getElementById('profile-avatar');
    expect(avatar).toHaveClass('dse-avatar', 'consumer-avatar');
    expect(avatar).toHaveAttribute('data-source', 'profile');
  });

  it('ignores untyped children and dangerouslySetInnerHTML instead of crashing or replacing governed content', async () => {
    const module = await loadModule();
    if (!module) return;

    const { Avatar } = module;
    const unsafeContent = {
      children: 'Injected',
      dangerouslySetInnerHTML: { __html: '<strong>Injected</strong>' },
    } as any;

    render(<Avatar initials="AF" data-testid="avatar" {...unsafeContent} />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveTextContent('AF');
    expect(avatar).not.toHaveTextContent('Injected');
    expect(avatar.querySelector('strong')).toBeNull();
  });
});
