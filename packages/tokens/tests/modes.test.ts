import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { loadRegistry } from '../scripts/lib/load.js';

const registry=loadRegistry(fileURLToPath(new URL('../src/',import.meta.url)));
const modeSet=(prefix:string)=>{
  const entries=[...registry.modeTokens.entries()].filter(([path])=>path.startsWith(`${prefix}.`));
  expect(entries.length).toBeGreaterThan(0);
  const first=entries[0]![1];
  for(const [,entry] of entries){ expect(entry.axis).toBe(first.axis); expect([...entry.modes.keys()]).toEqual([...first.modes.keys()]); }
  return [...first.modes.keys()];
};
it('preserves exact mode axes and completeness',()=>{
  expect(modeSet('color.semantic')).toEqual(['light','dark']);
  expect(modeSet('typography.semantic')).toEqual(['english','arabic']);
  expect(modeSet('layout.semantic')).toEqual(['wide','narrow']);
});
