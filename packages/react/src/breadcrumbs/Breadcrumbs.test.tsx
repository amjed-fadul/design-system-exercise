import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const breadcrumbsModulePath = './Breadcrumbs';

async function loadBreadcrumbsModule() {
  const module = await import(/* @vite-ignore */ breadcrumbsModulePath).catch(() => null);
  expect(module, 'Breadcrumbs runtime module must exist').not.toBeNull();
  return module;
}

describe('Breadcrumbs public runtime', () => {
  it('renders a named native navigation trail with linked ancestors and a plain-text current page', async () => {
    const module = await loadBreadcrumbsModule();
    if (!module) return;

    const { Breadcrumbs } = module;
    const { container } = render(
      <Breadcrumbs
        ancestors={[{ label: 'Workspace', href: '/workspace' }]}
        currentLabel="Team & access"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(nav.tagName).toBe('NAV');
    expect(within(nav).getByRole('list').tagName).toBe('OL');
    expect(within(nav).getByRole('link', { name: 'Workspace' })).toHaveAttribute(
      'href',
      '/workspace',
    );

    const current = within(nav).getByText('Team & access');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(within(nav).queryByRole('link', { name: 'Team & access' })).toBeNull();

    const separators = container.querySelectorAll('.dse-breadcrumb-link-item__separator');
    expect(separators).toHaveLength(1);
    expect(separators[0]).toHaveAttribute('aria-hidden', 'true');
    expect(separators[0]).toHaveTextContent('/');
  });

  it('preserves ordered multi-ancestor hierarchy without inventing collapse or overflow behavior', async () => {
    const module = await loadBreadcrumbsModule();
    if (!module) return;

    const { Breadcrumbs } = module;
    const { container } = render(
      <Breadcrumbs
        ancestors={[
          { label: 'Workspace', href: '/workspace' },
          { label: 'Settings', href: '/workspace/settings' },
          { label: 'People', href: '/workspace/settings/people' },
        ]}
        currentLabel="Team & access"
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Workspace', 'Settings', 'People']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/workspace',
      '/workspace/settings',
      '/workspace/settings/people',
    ]);
    expect(container.querySelectorAll('.dse-breadcrumb-link-item__separator')).toHaveLength(3);
    expect(container.querySelector('.dse-breadcrumbs__overflow')).toBeNull();
    expect(container.textContent).not.toContain('…');
  });

  it('validates ancestor data, current label, and accessible navigation label', async () => {
    const module = await loadBreadcrumbsModule();
    if (!module) return;

    const { Breadcrumbs } = module;

    expect(() => render(<Breadcrumbs ancestors={[]} currentLabel="Team" />)).toThrow(/ancestor/i);
    expect(() =>
      render(<Breadcrumbs ancestors={[{ label: '   ', href: '/workspace' }]} currentLabel="Team" />),
    ).toThrow(/label/i);
    expect(() =>
      render(<Breadcrumbs ancestors={[{ label: 'Workspace', href: '   ' }]} currentLabel="Team" />),
    ).toThrow(/href|destination/i);
    expect(() =>
      render(<Breadcrumbs ancestors={[{ label: 'Workspace', href: '/workspace' }]} currentLabel="   " />),
    ).toThrow(/current/i);
    expect(() =>
      render(
        <Breadcrumbs
          ancestors={[{ label: 'Workspace', href: '/workspace' }]}
          currentLabel="Team"
          ariaLabel="   "
        />,
      ),
    ).toThrow(/aria|navigation label/i);
  });

  it('supports a localized navigation landmark label and inherits document direction', async () => {
    const module = await loadBreadcrumbsModule();
    if (!module) return;

    const { Breadcrumbs } = module;
    const { container } = render(
      <div dir="rtl">
        <Breadcrumbs
          ariaLabel="مسار التنقل"
          ancestors={[{ label: 'مساحة العمل', href: '/workspace' }]}
          currentLabel="الفريق والصلاحيات"
        />
      </div>,
    );

    expect(screen.getByRole('navigation', { name: 'مسار التنقل' })).toBeInTheDocument();
    expect(container.querySelector('.dse-breadcrumbs')).not.toHaveAttribute('dir');
    expect(screen.getByRole('link', { name: 'مساحة العمل' })).toHaveAttribute('href', '/workspace');
  });

  it('fails closed for unrelated untyped props and exports only the public Breadcrumbs component', async () => {
    const module = await loadBreadcrumbsModule();
    if (!module) return;

    const { Breadcrumbs } = module;
    const { container } = render(
      <Breadcrumbs
        {...({
          children: 'forbidden',
          separator: '>',
          collapse: true,
          overflow: true,
          currentHref: '/workspace/team',
          disabled: true,
          visited: true,
          theme: 'dark',
          className: 'leaked-class',
          style: { color: 'red' },
        } as any)}
        ancestors={[{ label: 'Workspace', href: '/workspace' }]}
        currentLabel="Team & access"
      />,
    );

    const root = container.querySelector('.dse-breadcrumbs');
    expect(root).not.toHaveClass('leaked-class');
    expect(root).not.toHaveStyle({ color: 'red' });
    expect(root).not.toHaveTextContent('forbidden');
    expect(root).not.toHaveAttribute('theme');
    expect(root).not.toHaveAttribute('disabled');

    const packageModule = await import('../index');
    expect(packageModule.Breadcrumbs).toBeTruthy();
    expect((packageModule as Record<string, unknown>).BreadcrumbLinkItem).toBeUndefined();
  });
});
