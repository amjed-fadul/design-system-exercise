import { Fragment } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const pageHeadingModulePath = './PageHeading';

async function loadPageHeadingModule() {
  const module = await import(/* @vite-ignore */ pageHeadingModulePath).catch(() => null);
  expect(module, 'Page Heading runtime module must exist').not.toBeNull();
  return module;
}

describe('Page Heading public runtime', () => {
  it('renders one h1 with optional description, Breadcrumbs region, and page Actions in reading order', async () => {
    const module = await loadPageHeadingModule();
    if (!module) return;

    const { PageHeading } = module;
    const { container } = render(
      <PageHeading
        title="Team members"
        description="Manage members and pending invitations in your workspace."
        breadcrumbs={<nav aria-label="Breadcrumbs">Team & access</nav>}
        actions={<button type="button">Invite member</button>}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Team members' })).toBeInTheDocument();
    expect(screen.getByText('Manage members and pending invitations in your workspace.')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invite member' })).toBeInTheDocument();

    const root = container.querySelector('.dse-page-heading');
    expect(root?.children[0]).toHaveClass('dse-page-heading__breadcrumbs');
    expect(root?.children[1]).toHaveClass('dse-page-heading__row');
  });

  it('treats description as optional and showDescription hides only the description', async () => {
    const module = await loadPageHeadingModule();
    if (!module) return;

    const { PageHeading } = module;
    const { rerender } = render(<PageHeading title="Team members" />);
    expect(screen.queryByText(/Manage members/)).toBeNull();

    rerender(
      <PageHeading
        title="Team members"
        description="Manage members and pending invitations in your workspace."
        showDescription={false}
      />,
    );
    expect(screen.queryByText('Manage members and pending invitations in your workspace.')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'Team members' })).toBeInTheDocument();
  });

  it('rejects an empty or whitespace-only page title', async () => {
    const module = await loadPageHeadingModule();
    if (!module) return;

    const { PageHeading } = module;
    expect(() => render(<PageHeading title="" />)).toThrow(/title/i);
    expect(() => render(<PageHeading title="   " />)).toThrow(/title/i);
  });

  it('enforces Figma slot cardinality including Fragment-wrapped rendered children', async () => {
    const module = await loadPageHeadingModule();
    if (!module) return;

    const { PageHeading } = module;

    expect(() =>
      render(
        <PageHeading
          title="Team members"
          breadcrumbs={
            <Fragment>
              <span>One</span>
              <span>Two</span>
            </Fragment>
          }
        />,
      ),
    ).toThrow(/breadcrumbs/i);

    expect(() =>
      render(
        <PageHeading
          title="Team members"
          actions={
            <Fragment>
              <button type="button">One</button>
              <button type="button">Two</button>
              <button type="button">Three</button>
            </Fragment>
          }
        />,
      ),
    ).toThrow(/actions/i);

    expect(() =>
      render(
        <PageHeading
          title="Team members"
          actions={
            <Fragment>
              <button type="button">One</button>
              <button type="button">Two</button>
            </Fragment>
          }
        />,
      ),
    ).not.toThrow();
  });

  it('fails closed for unrelated untyped props and exports PageHeading publicly', async () => {
    const module = await loadPageHeadingModule();
    if (!module) return;

    const { PageHeading } = module;
    const { container } = render(
      <PageHeading
        {...({
          children: 'forbidden',
          headingLevel: 2,
          search: 'forbidden',
          searchField: 'forbidden',
          navigation: 'forbidden',
          theme: 'dark',
          onNavigate: () => {},
          onAction: () => {},
          className: 'leaked-class',
          style: { color: 'red' },
        } as any)}
        title="Team members"
      />,
    );

    const root = container.querySelector('.dse-page-heading');
    expect(root).not.toHaveClass('leaked-class');
    expect(root).not.toHaveStyle({ color: 'red' });
    expect(root).not.toHaveTextContent('forbidden');
    expect(root).not.toHaveAttribute('theme');
    expect(root).not.toHaveAttribute('navigation');

    const packageModule = await import('../index');
    expect(packageModule.PageHeading).toBeTruthy();
  });
});
