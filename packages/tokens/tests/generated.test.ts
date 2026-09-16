import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { generateCss } from '../scripts/lib/css.js';
import { loadRegistry } from '../scripts/lib/load.js';
import { generateTypeScript } from '../scripts/lib/typescript.js';

const registry=loadRegistry(fileURLToPath(new URL('../src/',import.meta.url))); const css=generateCss(registry); const ts=generateTypeScript(registry);
it('generates stable CSS selectors, aliases, and variables',()=>{
  expect(css).toContain('--dse-color-primitive-brand-600: #005DCC;');
  expect(css).toContain('--dse-color-semantic-action-critical-bg: var(--dse-color-primitive-red-600);');
  expect(css).toContain('[data-theme="dark"]'); expect(css).toContain('[data-language="ar"]'); expect(css).toContain('[data-layout="narrow"]');
  expect(css).toMatchSnapshot();
});
it('generates typed runtime token output',()=>{
  expect(ts).toContain("export type ThemeMode = 'light' | 'dark';"); expect(ts).toContain("export type LanguageMode = 'english' | 'arabic';"); expect(ts).toContain("export type LayoutMode = 'wide' | 'narrow';"); expect(ts).toMatchSnapshot();
});
