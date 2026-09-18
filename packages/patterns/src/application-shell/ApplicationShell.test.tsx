import React from 'react';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PageHeading,
  Sidebar,
  TopNavbar,
  type SidebarItem,
} from '@design-system-exercise/react';
import { ApplicationShell } from './ApplicationShell.js';

const items: readonly SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '#overview',
    icon: <span aria-hidden="true">•</span>,
  },
  {
    id: 'team',
    label: 'Team & access',
    href: '#team',
    icon: <span aria-hidden="true">•</span>,
  },
];

function sidebar() {
  return <Sidebar items={items} currentId="team" />;
}

function StatefulContent() {
  const [count, setCount] = React.useState(0);
  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count {count}
    </button>
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ApplicationShell', () => {
  it('renders governed shell landmarks and optional page heading', () => {
    const { container } = render(
      <ApplicationShell
        viewportMode="expanded"
        sidebar={sidebar()}
        topNavbar={<TopNavbar />}
        pageHeading={<PageHeading title="Team members" />}
      >
        <p>Directory content</p>
      </ApplicationShell>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'WORKSPACE' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Directory content');
    expect(screen.getByRole('heading', { level: 1, name: 'Team members' })).toBeInTheDocument();

    const root = container.querySelector('.dse-application-shell');
    expect(root).toHaveAttribute('data-mode', 'expanded');
    expect(root).toHaveAttribute('data-layout', 'wide');
    expect(screen.getByRole('navigation')).toHaveAttribute('data-mode', 'expanded');
  });

  it('supplies compact Sidebar mode without replacing consumer state', () => {
    const { container } = render(
      <ApplicationShell
        viewportMode="compact"
        sidebar={sidebar()}
        topNavbar={<TopNavbar />}
      >
        <StatefulContent />
      </ApplicationShell>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();

    const root = container.querySelector('.dse-application-shell');
    expect(root).toHaveAttribute('data-mode', 'compact');
    expect(root).toHaveAttribute('data-layout', 'narrow');
    expect(screen.getByRole('navigation')).toHaveAttribute('data-mode', 'compact');
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
  });

  it('uses the governed 1200px decision in auto mode and preserves child state across resize', () => {
    const listeners = new Set<() => void>();
    const mediaQueryList = {
      matches: false,
      media: '(min-width: 1200px)',
      onchange: null,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      addListener: (listener: () => void) => listeners.add(listener),
      removeListener: (listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => true,
    };

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mediaQueryList as unknown as MediaQueryList),
    );

    const { container } = render(
      <ApplicationShell sidebar={sidebar()} topNavbar={<TopNavbar />}>
        <StatefulContent />
      </ApplicationShell>,
    );

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1200px)');
    expect(container.querySelector('.dse-application-shell')).toHaveAttribute(
      'data-mode',
      'compact',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();

    act(() => {
      mediaQueryList.matches = true;
      for (const listener of listeners) listener();
    });

    expect(container.querySelector('.dse-application-shell')).toHaveAttribute(
      'data-mode',
      'expanded',
    );
    expect(screen.getByRole('navigation')).toHaveAttribute('data-mode', 'expanded');
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();

  });

  it('rejects unsupported viewport modes', () => {
    expect(() =>
      render(
        <ApplicationShell
          viewportMode={'wide' as any}
          sidebar={sidebar()}
          topNavbar={<TopNavbar />}
        >
          content
        </ApplicationShell>,
      ),
    ).toThrow(/viewportMode/);
  });
});
