import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const modulePath = './SidePanel';

async function loadModule() {
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('SidePanel public runtime', () => {
  it('renders a named non-modal region with the approved default eyebrow and composed slots', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;

    render(
      <SidePanel
        onClose={() => {}}
        header={<h2>Amira Hassan</h2>}
        actions={<button>Save changes</button>}
      >
        <p>Member details</p>
      </SidePanel>,
    );

    const panel = screen.getByRole('region', { name: 'MEMBER DETAILS' });
    expect(panel).not.toHaveAttribute('aria-modal');
    expect(panel.querySelector('.dse-side-panel__eyebrow')).toHaveTextContent('MEMBER DETAILS');
    expect(panel.querySelector('.dse-side-panel__header')).toHaveTextContent('Amira Hassan');
    expect(panel.querySelector('.dse-side-panel__body')).toHaveTextContent('Member details');
    expect(panel.querySelector('.dse-side-panel__actions')).toHaveTextContent('Save changes');
  });

  it('uses the governed IconButton and calls onClose only from its native activation', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <SidePanel onClose={onClose} closeLabel="Close member details">
        <button>Inside action</button>
      </SidePanel>,
    );

    const close = screen.getByRole('button', { name: 'Close member details' });
    expect(close).toHaveClass('dse-icon-button');
    await user.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('hides the close affordance without inventing an alternate dismissal mechanism', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <SidePanel onClose={onClose} showClose={false}>
        <button>Keep editing</button>
      </SidePanel>,
    );

    expect(screen.queryByRole('button', { name: 'Close panel' })).toBeNull();
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keeps Header and Actions anatomy present when authored slot content is absent', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;

    render(
      <SidePanel onClose={() => {}} header={null} actions={false}>
        <p>Body only</p>
      </SidePanel>,
    );

    const panel = screen.getByRole('region');
    expect(panel.querySelector('.dse-side-panel__header')).toBeEmptyDOMElement();
    expect(panel.querySelector('.dse-side-panel__header-divider')).toBeInTheDocument();
    expect(panel.querySelector('.dse-side-panel__actions')).toBeEmptyDOMElement();
    expect(panel.querySelector('.dse-side-panel__footer-divider')).toBeInTheDocument();
    expect(panel.querySelector('.dse-side-panel__body')).toHaveTextContent('Body only');
  });

  it('rejects an empty eyebrow because it owns the region accessible name', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;

    expect(() => render(<SidePanel onClose={() => {}} eyebrow="   " />)).toThrow(
      /non-empty eyebrow/i,
    );
  });

  it('rejects an empty close label while the close affordance is visible', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;

    expect(() => render(<SidePanel onClose={() => {}} closeLabel="   " />)).toThrow(
      /non-empty closeLabel/i,
    );
  });

  it('allows host composition sizing through className and style without a size prop', async () => {
    const module = await loadModule();
    if (!module) return;
    const { SidePanel } = module;

    render(
      <SidePanel
        onClose={() => {}}
        className="member-detail-surface"
        style={{ inlineSize: '640px' }}
      />,
    );

    const panel = screen.getByRole('region');
    expect(panel).toHaveClass('dse-side-panel', 'member-detail-surface');
    expect(panel).toHaveStyle({ inlineSize: '640px' });
  });
});
