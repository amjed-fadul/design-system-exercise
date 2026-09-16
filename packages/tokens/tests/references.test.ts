import { expect, it } from 'vitest';
import { resolveToken } from '../scripts/lib/references.js';
import type { LoadedToken, RawTokenValue, TokenRegistry } from '../scripts/lib/model.js';

const loaded = (path: string, type: LoadedToken['type'], rawValue: RawTokenValue): LoadedToken => ({ path, type, rawValue });
const inferType = (value: RawTokenValue): LoadedToken['type'] => typeof value === 'number' ? 'number' : (typeof value === 'object' ? 'dimension' : (String(value).startsWith('#') ? 'color' : 'number'));
const registryFrom = (input: Record<string, { type: LoadedToken['type']; rawValue: RawTokenValue }>): TokenRegistry => ({ staticTokens: new Map(Object.entries(input).map(([path, token]) => [path, loaded(path, token.type, token.rawValue)])), modeTokens: new Map() });
const themeRegistry = (input: Record<string, { light: RawTokenValue; dark: RawTokenValue }>): TokenRegistry => ({
  staticTokens: new Map(),
  modeTokens: new Map(Object.entries(input).map(([path, values]) => [path, { axis: 'theme' as const, modes: new Map(['light', 'dark'].map((mode) => [mode, { path, type: inferType(values[mode as 'light' | 'dark']), rawValue: values[mode as 'light' | 'dark'], modeAxis: 'theme' as const, mode }])) }]))
});

it('resolves a static alias chain', () => {
  const registry = registryFrom({ 'space.base': { type: 'dimension', rawValue: { value: 8, unit: 'px' } }, 'space.semantic': { type: 'dimension', rawValue: '{space.base}' } });
  expect(resolveToken(registry, 'space.semantic')).toEqual({ value: 8, unit: 'px' });
});
it('resolves same-axis semantic aliases using the current mode', () => {
  const registry = themeRegistry({ 'feedback.negative.fg': { light: '#A8200D', dark: '#F16450' }, 'action.critical.fg': { light: '{feedback.negative.fg}', dark: '{feedback.negative.fg}' } });
  expect(resolveToken(registry, 'action.critical.fg', { theme: 'dark' })).toBe('#F16450');
});
it('rejects a missing alias target', () => {
  const registry = registryFrom({ broken: { type: 'color', rawValue: '{missing.token}' } });
  expect(() => resolveToken(registry, 'broken')).toThrow('missing.token');
});
it('rejects a circular alias', () => {
  const registry = registryFrom({ a: { type: 'number', rawValue: '{b}' }, b: { type: 'number', rawValue: '{a}' } });
  expect(() => resolveToken(registry, 'a')).toThrow('a -> b -> a');
});
it('rejects a mode-aware reference without a usable mode context', () => {
  const registry = themeRegistry({ value: { light: '#FFFFFF', dark: '#0D0D0D' } });
  expect(() => resolveToken(registry, 'value')).toThrow('theme mode');
});
