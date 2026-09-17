import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const modulePath = './InlineFeedback';

async function loadModule() {
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('InlineFeedback public runtime', () => {
  it('renders error intent as an alert with decorative icon and visible message', async () => {
    const module = await loadModule();
    if (!module) return;

    const { InlineFeedback } = module;
    const { container } = render(
      <InlineFeedback intent="error" message="Changes not saved. Try again." />,
    );

    const root = screen.getByRole('alert');
    expect(root).toHaveTextContent('Changes not saved. Try again.');
    expect(root).not.toHaveAttribute('tabindex');
    expect(container.querySelector('.dse-inline-feedback__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders success intent as a status and optional title when supplied', async () => {
    const module = await loadModule();
    if (!module) return;

    const { InlineFeedback } = module;
    render(
      <InlineFeedback intent="success" title="Invitation sent" message="Access remains pending until the person joins." />,
    );

    const root = screen.getByRole('status');
    expect(root).toHaveTextContent('Invitation sent');
    expect(root).toHaveTextContent('Access remains pending until the person joins.');
  });

  it('omits title anatomy when title is not supplied', async () => {
    const module = await loadModule();
    if (!module) return;

    const { InlineFeedback } = module;
    const { container } = render(
      <InlineFeedback intent="success" message="Changes saved." />,
    );

    expect(container.querySelector('.dse-inline-feedback__title')).toBeNull();
  });

  it('rejects empty or whitespace-only message content before rendering', async () => {
    const module = await loadModule();
    if (!module) return;

    const { InlineFeedback } = module;
    expect(() => render(<InlineFeedback intent="error" message="   " />)).toThrow(/non-empty message/i);
  });

  it('rejects an empty or whitespace-only title when the prop is supplied', async () => {
    const module = await loadModule();
    if (!module) return;

    const { InlineFeedback } = module;
    expect(() => render(<InlineFeedback intent="success" title="  " message="Saved." />)).toThrow(/non-empty title/i);
  });
});
