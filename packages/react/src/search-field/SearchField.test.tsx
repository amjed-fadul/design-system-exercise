import { createRef, useState, type ChangeEvent } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const searchFieldModulePath = './SearchField';

async function loadSearchFieldModule() {
  const module = await import(/* @vite-ignore */ searchFieldModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('SearchField public runtime', () => {
  it('renders a named native search input and forwards compatible native attributes and ref', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const ref = createRef<HTMLInputElement>();

    render(
      <SearchField
        ref={ref}
        aria-label="Search team"
        clearButtonLabel="Clear search"
        name="member-query"
        placeholder="Search by name or email"
        autoComplete="off"
        className="team-search"
        data-product-field="team-search"
      />,
    );

    const input = screen.getByRole('searchbox', { name: 'Search team' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('name', 'member-query');
    expect(input).toHaveAttribute('placeholder', 'Search by name or email');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('data-product-field', 'team-search');
    expect(input).toHaveClass('dse-search-field__input', 'team-search');
    expect(ref.current).toBe(input);
  });

  it('uses the compact private shell, fixed decorative search icon, and no clear action while empty', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const { container } = render(
      <SearchField aria-label="Search team" clearButtonLabel="Clear search" />,
    );

    expect(container.querySelector('.dse-input-control')).toHaveAttribute('data-size', 'compact');
    expect(container.querySelector('.dse-search-field__search-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('keeps the private input-control content limited to the native input', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const { container } = render(
      <SearchField
        aria-label="Search team"
        clearButtonLabel="Clear search"
        defaultValue="sara"
      />,
    );

    const shell = container.querySelector('.dse-input-control');
    expect(shell?.children).toHaveLength(1);
    expect(shell?.firstElementChild?.tagName).toBe('INPUT');
    expect(shell?.querySelector('.dse-search-field__search-icon')).toBeNull();
    expect(shell?.querySelector('.dse-search-field__clear-action')).toBeNull();
    expect(
      container.querySelector('.dse-search-field > .dse-search-field__search-icon'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.dse-search-field > .dse-search-field__clear-action'),
    ).toBeInTheDocument();
  });

  it('derives clear-action presence from the live query instead of a content prop', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const user = userEvent.setup();
    render(<SearchField aria-label="Search team" clearButtonLabel="Clear search" />);

    const input = screen.getByRole('searchbox', { name: 'Search team' });
    await user.type(input, 'sara');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();

    await user.clear(input);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('clears an uncontrolled query, emits onClear once, and restores input focus', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchField
        aria-label="Search team"
        clearButtonLabel="Clear search"
        defaultValue="sara"
        onClear={onClear}
      />,
    );

    const input = screen.getByRole('searchbox', { name: 'Search team' });
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(clear).toHaveClass('dse-icon-button');

    await user.click(clear);

    expect(input).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('supports a controlled query whose owner clears in response to onClear', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const user = userEvent.setup();

    function ControlledSearch() {
      const [value, setValue] = useState('sara');
      return (
        <SearchField
          aria-label="Search team"
          clearButtonLabel="Clear search"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value)}
          onClear={() => setValue('')}
        />
      );
    }

    render(<ControlledSearch />);
    const input = screen.getByRole('searchbox', { name: 'Search team' });
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('keeps a filled clear action visible but disabled when the field is disabled', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchField
        aria-label="Search team"
        clearButtonLabel="Clear search"
        defaultValue="sara"
        disabled
        onClear={onClear}
      />,
    );

    const input = screen.getByRole('searchbox', { name: 'Search team' });
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(input).toBeDisabled();
    expect(clear).toBeDisabled();

    await user.click(clear);
    expect(input).toHaveValue('sara');
    expect(onClear).not.toHaveBeenCalled();
  });

  it('strips every contract-forbidden runtime prop even when forced by untyped input', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    render(
      <SearchField
        {...({
          type: 'email',
          'aria-invalid': 'true',
          state: 'hover',
          content: 'filled',
          size: 99,
          children: 'forbidden',
          invalid: true,
          loading: true,
          results: 5,
          resultCount: 5,
          suggestions: ['sara'],
          selectedPerson: 'sara',
          debounce: 250,
        } as any)}
        aria-label="Search team"
        clearButtonLabel="Clear search"
      />,
    );

    const input = screen.getByRole('searchbox', { name: 'Search team' });
    expect(input).toHaveAttribute('type', 'search');
    for (const forbidden of [
      'aria-invalid',
      'state',
      'content',
      'size',
      'invalid',
      'loading',
      'results',
      'resultCount',
      'suggestions',
      'selectedPerson',
      'debounce',
    ]) {
      expect(input).not.toHaveAttribute(forbidden);
    }
    expect(input.textContent).toBe('');
  });

  it('forwards onChange exactly once per native query change', async () => {
    const module = await loadSearchFieldModule();
    if (!module) return;

    const { SearchField } = module;
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchField
        aria-label="Search team"
        clearButtonLabel="Clear search"
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole('searchbox', { name: 'Search team' }), 'A');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
