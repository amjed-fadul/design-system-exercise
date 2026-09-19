// @vitest-environment jsdom

import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { afterEach, describe, it } from 'vitest';

import { ProjectsEvaluation } from './ProjectsEvaluation';

let container: HTMLDivElement | undefined;
let root: Root | undefined;

function render(ui: ReactElement) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(ui));
}

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

describe('ProjectsEvaluation', () => {
  it('filters projects by name or key and reports the current result count', async () => {
    render(<ProjectsEvaluation />);
    const screen = within(document.body);

    expect(screen.getByText('3 projects')).toBeInTheDocument();

    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search projects' }),
      'MOB',
    );

    expect(screen.getByText('Mobile onboarding')).toBeInTheDocument();
    expect(screen.queryByText('Billing revamp')).not.toBeInTheDocument();
    expect(screen.getByText('1 project')).toBeInTheDocument();

    await userEvent.clear(
      screen.getByRole('searchbox', { name: 'Search projects' }),
    );
    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search projects' }),
      'missing',
    );

    expect(screen.getByRole('heading', { name: 'No projects found' })).toBeInTheDocument();
    expect(screen.getByText('0 projects')).toBeInTheDocument();
  });

  it('preserves valid create input after a recoverable failure and succeeds on retry', async () => {
    render(<ProjectsEvaluation />);
    const screen = within(document.body);

    await userEvent.click(
      screen.getByRole('button', { name: 'Create project' }),
    );
    const dialog = screen.getByRole('dialog', { name: 'Create project' });

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Project name' }),
      'Platform migration',
    );
    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Project key' }),
      'PLT',
    );
    await userEvent.click(
      within(dialog).getByRole('radio', { name: /Draft/ }),
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Create project' }),
    );

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Project was not created');
    expect(
      within(dialog).getByRole('textbox', { name: 'Project name' }),
    ).toHaveValue('Platform migration');
    expect(
      within(dialog).getByRole('textbox', { name: 'Project key' }),
    ).toHaveValue('PLT');

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Retry create' }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Create project' })).not.toBeInTheDocument());
    expect(screen.getByText('Platform migration')).toBeInTheDocument();
    expect(screen.getByText('4 projects')).toBeInTheDocument();
  });

  it('keeps edits after a failed save, then archives only after confirmation', async () => {
    render(<ProjectsEvaluation />);
    const screen = within(document.body);

    await userEvent.click(
      screen.getByRole('button', {
        name: 'View details for Billing revamp',
      }),
    );
    const detail = screen.getByRole('dialog', { name: 'Billing revamp project details' });
    const nameField = within(detail).getByRole('textbox', {
      name: 'Project name',
    });

    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Billing modernization');
    await userEvent.click(
      within(detail).getByRole('button', { name: 'Save changes' }),
    );

    expect(await within(detail).findByRole('alert')).toHaveTextContent('Changes were not saved');
    expect(nameField).toHaveValue('Billing modernization');

    await userEvent.click(
      within(detail).getByRole('button', { name: 'Retry save' }),
    );
    expect(await within(detail).findByRole('status')).toHaveTextContent('Changes saved');
    expect(
      screen.getByRole('button', {
        hidden: true,
        name: 'View details for Billing modernization',
      }),
    ).toBeInTheDocument();

    await userEvent.click(
      within(detail).getByRole('button', { name: 'Archive project' }),
    );
    const confirmation = screen.getByRole('dialog', { name: 'Archive Billing modernization?' });

    await userEvent.click(
      within(confirmation).getByRole('button', { name: 'Archive project' }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Archive Billing modernization?' })).not.toBeInTheDocument());
    expect(screen.queryByText('Billing modernization')).not.toBeInTheDocument();
    expect(screen.getByText('2 projects')).toBeInTheDocument();
  });
});
