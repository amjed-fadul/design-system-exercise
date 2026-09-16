import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { loadRegistry } from '../scripts/lib/load.js';
import { TokenValidationError } from '../scripts/lib/model.js';

const roots: string[] = [];
const fixture = (relativePath: string, value: unknown) => {
  const root = mkdtempSync(join(tmpdir(), 'dse-token-test-')); roots.push(root);
  const file = join(root, relativePath); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(value)); return root;
};
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

it('accepts a static DTCG-style token', () => {
  const root = fixture('color/primitive.tokens.json', { brand: { '600': { $type: 'color', $value: '#005DCC' } } });
  const registry = loadRegistry(root, [['color/primitive.tokens.json', 'color.primitive']]);
  expect(registry.staticTokens.get('color.primitive.brand.600')?.rawValue).toBe('#005DCC');
});
it('accepts a declared theme mode file', () => {
  const root = fixture('color/semantic.tokens.json', { $extensions: { 'design-system-exercise': { modeAxis: 'theme', modes: ['light', 'dark'] } }, light: { surface: { canvas: { $type: 'color', $value: '#FFFFFF' } } }, dark: { surface: { canvas: { $type: 'color', $value: '#0D0D0D' } } } });
  const registry = loadRegistry(root, [['color/semantic.tokens.json', 'color.semantic']]);
  expect(registry.modeTokens.get('color.semantic.surface.canvas')?.modes.size).toBe(2);
});
it('rejects a leaf without $type', () => {
  const root = fixture('color/primitive.tokens.json', { brand: { '600': { $value: '#005DCC' } } });
  expect(() => loadRegistry(root, [['color/primitive.tokens.json', 'color.primitive']])).toThrow(TokenValidationError);
});
it('rejects a dimension without px unit', () => {
  const root = fixture('spacing/primitive.tokens.json', { space: { '100': { $type: 'dimension', $value: { value: 4, unit: 'rem' } } } });
  expect(() => loadRegistry(root, [['spacing/primitive.tokens.json', 'spacing.primitive']])).toThrow(TokenValidationError);
});
it('rejects a mode group missing a declared mode', () => {
  const root = fixture('color/semantic.tokens.json', { $extensions: { 'design-system-exercise': { modeAxis: 'theme', modes: ['light', 'dark'] } }, light: { surface: { canvas: { $type: 'color', $value: '#FFFFFF' } } } });
  expect(() => loadRegistry(root, [['color/semantic.tokens.json', 'color.semantic']])).toThrow(TokenValidationError);
});
it('rejects duplicate logical paths', () => {
  const root = fixture('first.tokens.json', { value: { $type: 'number', $value: 1 } });
  writeFileSync(join(root, 'second.tokens.json'), JSON.stringify({ value: { $type: 'number', $value: 2 } }));
  expect(() => loadRegistry(root, [['first.tokens.json', 'shared'], ['second.tokens.json', 'shared']])).toThrow(TokenValidationError);
});
