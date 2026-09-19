import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './Table.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module, 'Table Storybook module must exist').not.toBeNull();
  return module;
}

function mergedArgs(meta: any, story: any) {
  return { ...(meta.args ?? {}), ...(story.args ?? {}) };
}

describe('Table Storybook contract', () => {
  it('exposes only the governed fixed-table controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.tableMeta.argTypes ?? {};
    for (const required of [
      'rows',
      'primaryLabel',
      'secondaryLabel',
      'statusLabel',
      'actionLabel',
      'footerText',
    ]) {
      expect(argTypes).toHaveProperty(required);
    }

    for (const forbidden of [
      'children',
      'header',
      'sort',
      'sortBy',
      'pagination',
      'page',
      'pageSize',
      'bulkSelection',
      'selectedRows',
      'search',
      'query',
      'grid',
      'state',
      'order',
      'theme',
    ]) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });

  it('covers default, selected, no-footer, narrow, long-content, and Light/Dark × English/Arabic evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    for (const story of [
      'Default',
      'SelectedRow',
      'WithoutFooter',
      'Narrow736',
      'LongIdentity',
      'Dark',
      'Arabic',
      'DarkArabic',
    ]) {
      expect(module[story], `missing story ${story}`).toBeDefined();
    }

    expect(module.SelectedRow.args?.rows?.some((row: any) => row.selected === true)).toBe(true);
    expect(module.WithoutFooter.args).toHaveProperty('footerText', undefined);
    expect(module.Narrow736.parameters?.tableWidth).toBe(736);
    expect(module.Dark.parameters?.presentation?.theme).toBe('dark');
    expect(module.Arabic.parameters?.presentation?.language).toBe('arabic');
    expect(module.DarkArabic.parameters?.presentation).toEqual(
      expect.objectContaining({ theme: 'dark', language: 'arabic' }),
    );
    expect(module.Arabic.args?.primaryLabel).toMatch(/[\u0600-\u06FF]/);
    expect(module.Arabic.args?.footerText).toMatch(/[\u0600-\u06FF]/);
  });

  it('renders native table semantics, explicit row actions, selected context, and optional footer evidence', async () => {
    const module = await loadStories();
    if (!module) return;

    const defaultHtml = renderToStaticMarkup(
      module.Default.render(mergedArgs(module.tableMeta, module.Default), { globals: {} } as any),
    );
    expect(defaultHtml).toContain('<table');
    expect(defaultHtml).toContain('<thead');
    expect(defaultHtml).toContain('<tbody');
    expect(defaultHtml).toContain('<tfoot');
    expect(defaultHtml).toContain('scope="col"');
    expect(defaultHtml).toContain('aria-label="View Sara Ahmed details"');
    expect(defaultHtml).toContain('max-inline-size:1168px');
    expect(defaultHtml).toContain('min-inline-size:736px');
    expect(defaultHtml).not.toContain('role="grid"');
    expect(defaultHtml).not.toContain('type="checkbox"');

    const selectedHtml = renderToStaticMarkup(
      module.SelectedRow.render(
        mergedArgs(module.tableMeta, module.SelectedRow),
        { globals: {} } as any,
      ),
    );
    expect(selectedHtml).toContain('data-selected="true"');
    expect(selectedHtml).not.toContain('aria-selected=');

    const noFooterHtml = renderToStaticMarkup(
      module.WithoutFooter.render(
        mergedArgs(module.tableMeta, module.WithoutFooter),
        { globals: {} } as any,
      ),
    );
    expect(noFooterHtml).not.toContain('<tfoot');
  });

  it('documents public/private contracts and the deliberate scoped-table boundary', async () => {
    const module = await loadStories();
    if (!module) return;

    const description = module.tableMeta.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/dse\.table@1\.0\.0/);
    expect(description).toMatch(/dse\._table-header@1\.0\.0/i);
    expect(description).toMatch(/dse\._table-row@1\.0\.0/i);
    expect(description).toMatch(/native|semantic/i);
    expect(description).toMatch(/no.*sorting|sorting.*not/i);
    expect(description).toMatch(/no.*pagination|pagination.*not/i);
    expect(description).toMatch(/no.*bulk|bulk.*not/i);
    expect(description).toMatch(/not.*data grid|data grid.*not/i);
  });
});
