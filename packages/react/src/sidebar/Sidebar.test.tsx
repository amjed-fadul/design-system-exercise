import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const sidebarModulePath = './Sidebar';

async function loadSidebarModule() {
  const module = await import(/* @vite-ignore */ sidebarModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

const items = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/overview',
    icon: <svg data-testid="overview-icon" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: <svg data-testid="projects-icon" />,
  },
  {
    id: 'team',
    label: 'Team & access',
    href: '/team',
    icon: <svg data-testid="team-icon" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <svg data-testid="settings-icon" />,
  },
] as const;

describe('Sidebar public runtime', () => {
  it('renders one named nav with ordered native destination links and exactly one current page', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;
    const { container } = render(<Sidebar items={items} currentId="team" />);

    const nav = screen.getByRole('navigation', { name: 'WORKSPACE' });
    expect(nav.tagName).toBe('NAV');
    expect(nav).toHaveAttribute('data-mode', 'expanded');
    expect(container.querySelector('.dse-sidebar__group-label')).toHaveTextContent('WORKSPACE');

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'Overview',
      'Projects',
      'Team & access',
      'Settings',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/overview',
      '/projects',
      '/team',
      '/settings',
    ]);
    expect(links.filter((link) => link.getAttribute('aria-current') === 'page')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Team & access' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
    expect(container.querySelectorAll('ul > li')).toHaveLength(4);
  });

  it('keeps the same accessible destination names and current route in compact mode while removing the visible group label', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;
    const { container } = render(
      <Sidebar mode="compact" label="Workspace navigation" items={items} currentId="team" />,
    );

    const nav = screen.getByRole('navigation', { name: 'Workspace navigation' });
    expect(nav).toHaveAttribute('data-mode', 'compact');
    expect(container.querySelector('.dse-sidebar__group-label')).toBeNull();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Team & access' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });

  it('preserves destination order, hrefs, and current route when presentation mode changes', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;
    const { rerender } = render(<Sidebar mode="expanded" items={items} currentId="projects" />);

    const before = screen.getAllByRole('link').map((link) => ({
      name: link.textContent,
      href: link.getAttribute('href'),
      current: link.getAttribute('aria-current'),
    }));

    rerender(<Sidebar mode="compact" items={items} currentId="projects" />);

    const after = screen.getAllByRole('link').map((link) => ({
      name: link.textContent,
      href: link.getAttribute('href'),
      current: link.getAttribute('aria-current'),
    }));
    expect(after).toEqual(before);
  });

  it('renders supplemental footer content only in the expanded presentation', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;
    const { rerender } = render(
      <Sidebar items={items} currentId="team" footer={<span>Acme workspace</span>} />,
    );

    expect(screen.getByText('Acme workspace')).toBeInTheDocument();
    expect(screen.getByText('Acme workspace').closest('.dse-sidebar__footer')).not.toBeNull();

    rerender(
      <Sidebar mode="compact" items={items} currentId="team" footer={<span>Acme workspace</span>} />,
    );
    expect(screen.queryByText('Acme workspace')).toBeNull();
  });

  it('rejects empty or oversized destination sets, duplicate ids, and unmatched currentId', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;

    expect(() => render(<Sidebar items={[]} currentId="team" />)).toThrow(/1.*8|one.*eight/i);
    expect(() =>
      render(
        <Sidebar
          items={Array.from({ length: 9 }, (_, index) => ({
            id: `item-${index}`,
            label: `Item ${index}`,
            href: `/item-${index}`,
            icon: <svg />,
          }))}
          currentId="item-0"
        />,
      ),
    ).toThrow(/1.*8|one.*eight/i);

    expect(() =>
      render(
        <Sidebar
          items={[
            items[0],
            { ...items[1], id: items[0].id },
          ]}
          currentId="overview"
        />,
      ),
    ).toThrow(/unique/i);

    expect(() => render(<Sidebar items={items} currentId="missing" />)).toThrow(/current/i);
  });

  it('rejects blank navigation names and malformed destination data', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;

    expect(() => render(<Sidebar label="   " items={items} currentId="team" />)).toThrow(/label/i);
    expect(() =>
      render(<Sidebar items={[{ ...items[0], id: '   ' }]} currentId="overview" />),
    ).toThrow(/id/i);
    expect(() =>
      render(<Sidebar items={[{ ...items[0], label: '   ' }]} currentId="overview" />),
    ).toThrow(/label/i);
    expect(() =>
      render(<Sidebar items={[{ ...items[0], href: '   ' }]} currentId="overview" />),
    ).toThrow(/href/i);
    expect(() =>
      render(<Sidebar items={[{ ...items[0], icon: null }]} currentId="overview" />),
    ).toThrow(/icon/i);
  });

  it('fails closed for forbidden untyped props rather than leaking shell or interaction controls to nav', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const { Sidebar } = module;
    render(
      <Sidebar
        {...({
          children: 'forbidden',
          navigation: 'forbidden',
          state: 'hover',
          selected: 'team',
          collapsed: true,
          open: true,
          placement: 'start',
          breakpoint: 1200,
          onNavigate: () => {},
          routeConfig: {},
          role: 'menu',
          className: 'leaked-class',
          style: { color: 'red' },
        } as any)}
        items={items}
        currentId="team"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'WORKSPACE' });
    for (const attribute of [
      'navigation',
      'state',
      'selected',
      'collapsed',
      'open',
      'placement',
      'breakpoint',
      'routeConfig',
    ]) {
      expect(nav).not.toHaveAttribute(attribute);
    }
    expect(nav).not.toHaveAttribute('role', 'menu');
    expect(nav).not.toHaveClass('leaked-class');
    expect(nav).not.toHaveStyle({ color: 'red' });
    expect(nav).not.toHaveTextContent('forbidden');
  });

  it('exports Sidebar publicly while keeping the private NavigationItem unreachable', async () => {
    const packageModule = await import('../index');
    expect(packageModule.Sidebar).toBeTruthy();
    expect('NavigationItem' in packageModule).toBe(false);
  });
});
