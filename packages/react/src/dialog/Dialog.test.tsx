import { useRef, useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const modulePath = './Dialog';

async function loadModule() {
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Dialog public runtime', () => {
  it('renders only while open with complete modal naming semantics', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Dialog open={false} onOpenChange={onOpenChange} title="Invite a member">
        <p>Body content</p>
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();

    rerender(
      <Dialog
        open
        onOpenChange={onOpenChange}
        title="Invite a member"
        description="Send an invitation to join Northstar."
      >
        <p>Body content</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Invite a member' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Send an invitation to join Northstar.');
  });

  it('omits description anatomy and aria-describedby when description is null', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;

    render(
      <Dialog open onOpenChange={() => {}} title="Confirm change" description={null}>
        <p>Body</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm change' });
    expect(dialog).not.toHaveAttribute('aria-describedby');
    expect(document.querySelector('.dse-dialog__description')).toBeNull();
  });

  it('uses a named governed close control and requests close on activation', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog open onOpenChange={onOpenChange} title="Invite" closeLabel="Dismiss invite dialog">
        <p>Body</p>
      </Dialog>,
    );

    const close = screen.getByRole('button', { name: 'Dismiss invite dialog' });
    expect(close).toHaveClass('dse-icon-button');
    await user.click(close);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Escape requests close even when the visible close button is hidden, while backdrop click does not', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog open onOpenChange={onOpenChange} title="Pending task" showClose={false}>
        <button>Only action</button>
      </Dialog>,
    );

    expect(screen.queryByRole('button', { name: /close dialog/i })).toBeNull();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    const backdrop = document.querySelector('.dse-dialog__backdrop') as HTMLElement | null;
    expect(backdrop).not.toBeNull();
    await user.click(backdrop!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('composes body and actions without interpreting their product behavior', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;

    render(
      <Dialog
        open
        onOpenChange={() => {}}
        title="Invite a member"
        actions={
          <>
            <button>Cancel</button>
            <button>Send invite</button>
          </>
        }
      >
        <label>
          Email
          <input />
        </label>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('.dse-dialog__body')).toHaveTextContent('Email');
    expect(dialog.querySelector('.dse-dialog__actions')).toHaveTextContent('Cancel');
    expect(dialog.querySelector('.dse-dialog__actions')).toHaveTextContent('Send invite');
  });

  it('omits the divider and actions region when actions is null', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;

    render(
      <Dialog open onOpenChange={() => {}} title="Read only" actions={null}>
        <p>Body only</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Read only' });
    expect(dialog.querySelector('.dse-dialog__divider')).toBeNull();
    expect(dialog.querySelector('.dse-dialog__actions')).toBeNull();
  });

  it('moves focus to initialFocusRef, contains Tab navigation, and wraps in both directions', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;
    const user = userEvent.setup();

    function Harness() {
      const firstRef = useRef<HTMLInputElement>(null);
      return (
        <Dialog
          open
          onOpenChange={() => {}}
          title="Invite"
          initialFocusRef={firstRef}
          showClose={false}
        >
          <input ref={firstRef} aria-label="Email" />
          <button>Last action</button>
        </Dialog>
      );
    }

    render(<Harness />);
    const first = screen.getByRole('textbox', { name: 'Email' });
    const last = screen.getByRole('button', { name: 'Last action' });

    await waitFor(() => expect(first).toHaveFocus());
    last.focus();
    await user.keyboard('{Tab}');
    expect(first).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(last).toHaveFocus();
  });

  it('makes background content inert while open and restores it with focus when controlled state closes', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open dialog</button>
          <p data-testid="background-copy">Background content</p>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Confirm"
            actions={<button onClick={() => setOpen(false)}>Done</button>}
          >
            <button>Inside</button>
          </Dialog>
        </>
      );
    }

    const { container } = render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(opener);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const appRoot = container as HTMLElement & { inert?: boolean };
    expect(appRoot.inert).toBe(true);
    expect(appRoot).toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(appRoot.inert).not.toBe(true);
    expect(appRoot).not.toHaveAttribute('aria-hidden');
    expect(opener).toHaveFocus();
  });

  it('keeps business-state and ARIA ownership authoritative against untyped conflicting props', async () => {
    const module = await loadModule();
    if (!module) return;
    const { Dialog } = module;
    const conflicts = {
      role: 'alert',
      'aria-modal': false,
      onSubmit: vi.fn(),
      requestStatus: 'pending',
      state: 'loading',
      dismissOnBackdrop: true,
      showDescription: false,
    } as any;

    render(
      <Dialog open onOpenChange={() => {}} title="Governed dialog" {...conflicts}>
        <p>Body</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Governed dialog' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).not.toHaveAttribute('data-state');
    expect(dialog).not.toHaveAttribute('data-request-status');
  });
});
