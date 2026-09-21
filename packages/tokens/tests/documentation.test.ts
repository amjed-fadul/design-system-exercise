import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildTokenDocumentation,
  generateDocumentationTypeScript,
} from '../scripts/lib/documentation.js';
import { loadRegistry } from '../scripts/lib/load.js';

const registry = loadRegistry(fileURLToPath(new URL('../src/', import.meta.url)));
const docs = buildTokenDocumentation(registry);

function token(path: string, mode: string | null = null) {
  return docs.find((entry) => entry.path === path && entry.mode === mode);
}

describe('token documentation metadata', () => {
  it('preserves primitive and semantic alias relationships', () => {
    expect(token('border.width.base')).toMatchObject({
      layer: 'primitive',
      aliasOf: null,
      resolvedValue: { value: 1, unit: 'px' },
    });
    expect(token('border.role.base')).toMatchObject({
      layer: 'semantic',
      aliasOf: 'border.width.base',
      resolvedValue: { value: 1, unit: 'px' },
    });
    expect(token('border.role.focus')).toMatchObject({
      layer: 'semantic',
      aliasOf: 'border.width.strong',
      resolvedValue: { value: 2, unit: 'px' },
    });
    expect(token('radius.shape.control')).toMatchObject({
      layer: 'semantic',
      aliasOf: 'radius.radius.md',
    });
    expect(token('spacing.semantic.gap.md')).toMatchObject({
      layer: 'semantic',
      aliasOf: 'spacing.primitive.space.400',
    });
  });

  it('preserves mode-specific semantic aliases and resolved values', () => {
    expect(token('color.semantic.surface.canvas', 'light')).toMatchObject({
      layer: 'semantic',
      modeAxis: 'theme',
      aliasOf: 'color.primitive.neutral.25',
      resolvedValue: '#FAFAFA',
    });
    expect(token('color.semantic.surface.canvas', 'dark')).toMatchObject({
      aliasOf: 'color.primitive.neutral.1000',
      resolvedValue: '#0D0D0D',
    });
    expect(token('layout.semantic.nav.width', 'wide')).toMatchObject({
      modeAxis: 'layout',
      aliasOf: 'layout.primitive.nav.expanded',
    });
    expect(token('typography.semantic.body.default.family', 'arabic')).toMatchObject({
      modeAxis: 'language',
      aliasOf: 'typography.primitive.family.arabic',
      resolvedValue: 'IBM Plex Sans Arabic',
    });
  });

  it('keeps icons and elevation as foundation tokens rather than inventing semantic layers', () => {
    expect(token('icons.size.md')?.layer).toBe('foundation');
    expect(token('elevation.plane.overlay')?.layer).toBe('foundation');
  });

  it('generates a typed package export for Storybook consumers', () => {
    const generated = generateDocumentationTypeScript(registry);
    expect(generated).toContain('export const tokenDocumentation');
    expect(generated).toContain('export type TokenDocumentationEntry');
  });
});
