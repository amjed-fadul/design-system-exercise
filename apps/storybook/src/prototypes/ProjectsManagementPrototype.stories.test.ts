import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const storyModulePath = './ProjectsManagementPrototype.stories';

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module, 'Projects Management Storybook module must exist').not.toBeNull();
  return module;
}

describe('Projects Management prototype Storybook entry', () => {
  it('renders a second Northstar prototype with the governed Projects directory', async () => {
    const module = await loadStories();
    if (!module) return;

    expect(module.default.title).toBe('Prototypes/Projects Management');

    const html = renderToStaticMarkup(
      module.Connected.render?.(
        {} as never,
        { globals: { language: 'english', theme: 'light' } } as never,
      ) as never,
    );

    expect(html).toContain('dse-application-shell');
    expect(html).toContain('Projects');
    expect(html).toContain('Create project');
    expect(html).toContain('Website redesign');
    expect(html).toContain('Design system');
    expect(html).toContain('5 projects');
    expect(html).toContain('dse-table');
    expect(html).toContain('dse-search-field');
  });

  it('uses the same Connected story for toolbar-controlled Arabic + Dark', async () => {
    const module = await loadStories();
    if (!module) return;

    const html = renderToStaticMarkup(
      module.Connected.render?.(
        {} as never,
        { globals: { language: 'arabic', theme: 'dark' } } as never,
      ) as never,
    );

    expect(html).toContain('dir="rtl"');
    expect(html).toContain('lang="ar"');
    expect(html).toContain('data-theme="dark"');
    expect(html).toContain('المشاريع');
    expect(html).toContain('إنشاء مشروع');
    expect(html).toContain('نظام التصميم');
    expect(html).not.toContain('Create project');
  });

  it('keeps every interactive and structural UI primitive connected to the governed DS', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/prototypes/ProjectsManagementPrototype.tsx'),
      'utf8',
    );

    expect(source).toContain("from '@design-system-exercise/react'");
    expect(source).toContain("from '@design-system-exercise/patterns'");
    expect(source).toMatch(/\bApplicationShell\b/);
    expect(source).toMatch(/\bTable\b/);
    expect(source).toMatch(/\bSidePanel\b/);
    expect(source).toMatch(/\bDialog\b/);
    expect(source).toMatch(/\bTextField\b/);
    expect(source).toMatch(/\bRadioGroup\b/);
    expect(source).toMatch(/\bInlineFeedback\b/);
    expect(source).toMatch(/\bEmptyState\b/);
    expect(source).not.toMatch(/<(button|input|table|nav|header|aside|dialog|select|textarea|a)\b/);
    expect(source).not.toMatch(/document\.documentElement/);
  });

  it('documents product-only behavior without inventing a new reusable contract', async () => {
    const module = await loadStories();
    if (!module) return;

    const description =
      module.default.parameters?.docs?.description?.component ?? '';
    expect(description).toMatch(/governed Design System Exercise/i);
    expect(description).toMatch(/does not create.*contract/i);
    expect(description).toMatch(/product-only/i);
  });
});
