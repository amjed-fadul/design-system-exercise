import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { loadRegistry } from '../scripts/lib/load.js';
import { resolveToken } from '../scripts/lib/references.js';

const registry = loadRegistry(fileURLToPath(new URL('../src/', import.meta.url)));
const count = (prefix: string) => [...registry.staticTokens.keys(), ...registry.modeTokens.keys()].filter((path) => path === prefix || path.startsWith(`${prefix}.`)).length;
const resolve = (path: string, context = {}) => resolveToken(registry, path, context);

it('matches the audited 223-token public Figma inventory', () => {
  expect({
    colorPrimitive: count('color.primitive'), colorSemantic: count('color.semantic'), spacingPrimitive: count('spacing.primitive'), spacingSemantic: count('spacing.semantic'),
    typographyPrimitive: count('typography.primitive'), typographySemantic: count('typography.semantic'), border: count('border'), radius: count('radius'),
    layoutPrimitive: count('layout.primitive'), layoutSemantic: count('layout.semantic'), icons: count('icons'), elevation: count('elevation'),
    total: registry.staticTokens.size + registry.modeTokens.size
  }).toEqual({ colorPrimitive:41,colorSemantic:48,spacingPrimitive:10,spacingSemantic:19,typographyPrimitive:21,typographySemantic:40,border:7,radius:10,layoutPrimitive:12,layoutSemantic:6,icons:5,elevation:4,total:223 });
});

it('contains no internal or helper token paths', () => {
  const paths=[...registry.staticTokens.keys(),...registry.modeTokens.keys()];
  for (const path of paths) expect(path).not.toMatch(/button\.internal|component\.icon|component\.layout|_preferences|_layout/);
});

it('resolves audited sentinels across every domain', () => {
  expect(resolve('color.primitive.brand.600')).toBe('#005DCC');
  expect(resolve('color.semantic.action.critical.bg', { theme: 'light' })).toBe('#D52910');
  expect(resolve('spacing.semantic.gap.lg')).toEqual({ value:24,unit:'px' });
  expect(resolve('spacing.semantic.container.lg')).toEqual({ value:64,unit:'px' });
  expect(resolve('spacing.semantic.section.xl')).toEqual({ value:64,unit:'px' });
  expect(resolve('typography.semantic.body.default.family',{language:'arabic'})).toBe('IBM Plex Sans Arabic');
  expect(resolve('typography.semantic.headline.page.line-height',{language:'arabic'})).toEqual({value:42,unit:'px'});
  expect(resolve('border.role.focus')).toEqual({value:2,unit:'px'});
  expect(resolve('radius.shape.overlay')).toEqual({value:16,unit:'px'});
  expect(resolve('layout.semantic.nav.width',{layout:'wide'})).toEqual({value:208,unit:'px'});
  expect(resolve('layout.semantic.nav.width',{layout:'narrow'})).toEqual({value:64,unit:'px'});
  expect(resolve('icons.stroke.default')).toEqual({value:1.5,unit:'px'});
  expect(resolve('elevation.plane.overlay')).toBe(3);
});
