import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const topNavbarModulePath = './TopNavbar';

async function loadTopNavbarModule() {
  const module = await import(/* @vite-ignore */ topNavbarModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Top Navbar public runtime', () => {
  it('renders a native persistent header with Brand, context, flexible space, and Account regions in stable logical DOM order', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const { TopNavbar } = module;
    const { container } = render(
      <TopNavbar
        brand={<span>Northstar</span>}
        contextLabel="Workspace administration"
        account={<span>Amal Hassan · Admin</span>}
      />,
    );

    const header = container.querySelector('header.dse-top-navbar');
    expect(header).not.toBeNull();
    expect(header).toHaveAttribute('data-order', 'forward');

    const content = header?.querySelector('.dse-top-navbar__content');
    expect(content?.children).toHaveLength(4);
    expect(content?.children[0]).toHaveClass('dse-top-navbar__brand');
    expect(content?.children[1]).toHaveClass('dse-top-navbar__context');
    expect(content?.children[2]).toHaveClass('dse-top-navbar__flexible-space');
    expect(content?.children[3]).toHaveClass('dse-top-navbar__account');

    const brandRegion = content?.children[0];
    const contextRegion = content?.children[1];
    const accountRegion = content?.children[3];

    expect(brandRegion).not.toHaveAttribute('dir');
    expect(accountRegion).not.toHaveAttribute('dir');
    expect(contextRegion).toHaveAttribute('dir', 'auto');

    expect(screen.getByText('Northstar')).toBeInTheDocument();
    expect(screen.getByText('Workspace administration')).toBeInTheDocument();
    expect(screen.getByText('Amal Hassan · Admin')).toBeInTheDocument();
  });

  it('uses the governed context defaults and hides only the optional context region when showContext is false', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const { TopNavbar } = module;
    const { container, rerender } = render(
      <TopNavbar brand={<span>Northstar</span>} account={<span>Account</span>} />,
    );

    expect(screen.getByText('Workspace administration')).toBeInTheDocument();
    expect(container.querySelector('.dse-top-navbar__context')).not.toBeNull();

    rerender(
      <TopNavbar
        brand={<span>Northstar</span>}
        account={<span>Account</span>}
        showContext={false}
      />,
    );

    expect(screen.queryByText('Workspace administration')).toBeNull();
    expect(container.querySelector('.dse-top-navbar__context')).toBeNull();
  });

  it('rejects a blank visible context label while allowing it when the context region is hidden', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const { TopNavbar } = module;
    expect(() => render(<TopNavbar contextLabel="   " />)).toThrow(/context/i);
    expect(() => render(<TopNavbar contextLabel="   " showContext={false} />)).not.toThrow();
  });

  it('accepts at most one direct child in each governed Figma content slot', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const { TopNavbar } = module;
    expect(() =>
      render(
        <TopNavbar
          brand={[<span key="one">One</span>, <span key="two">Two</span>]}
          account={<span>Account</span>}
        />,
      ),
    ).toThrow(/brand/i);
    expect(() =>
      render(
        <TopNavbar
          brand={<span>Brand</span>}
          account={[<span key="one">One</span>, <span key="two">Two</span>]}
        />,
      ),
    ).toThrow(/account/i);
  });

  it('does not allow a Fragment to bypass the single rendered-child slot boundary', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const { TopNavbar } = module;
    expect(() =>
      render(
        <TopNavbar
          brand={
            <>
              <span>One</span>
              <span>Two</span>
            </>
          }
          account={<span>Account</span>}
        />,
      ),
    ).toThrow(/brand/i);
    expect(() =>
      render(
        <TopNavbar
          brand={<span>Brand</span>}
          account={
            <>
              <span>One</span>
              <span>Two</span>
            </>
          }
        />,
      ),
    ).toThrow(/account/i);
  });

  it('fails closed for Figma-only and product-owned untyped props and exports TopNavbar publicly', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const { TopNavbar } = module;
    const { container } = render(
      <TopNavbar
        {...({
          children: 'forbidden',
          order: 'reverse',
          theme: 'dark',
          navigation: 'forbidden',
          pageTitle: 'forbidden',
          actions: 'forbidden',
          accountMenu: 'forbidden',
          appearance: 'dark',
          onAppearanceChange: () => {},
          className: 'leaked-class',
          style: { color: 'red' },
        } as any)}
        brand={<span>Brand</span>}
        account={<span>Account</span>}
      />,
    );

    const header = container.querySelector('header.dse-top-navbar');
    expect(header).not.toHaveAttribute('order');
    expect(header).not.toHaveAttribute('theme');
    expect(header).not.toHaveAttribute('navigation');
    expect(header).not.toHaveAttribute('pageTitle');
    expect(header).not.toHaveAttribute('actions');
    expect(header).not.toHaveAttribute('accountMenu');
    expect(header).not.toHaveAttribute('appearance');
    expect(header).not.toHaveClass('leaked-class');
    expect(header).not.toHaveStyle({ color: 'red' });
    expect(header).not.toHaveTextContent('forbidden');

    const packageModule = await import('../index');
    expect(packageModule.TopNavbar).toBeTruthy();
  });
});
