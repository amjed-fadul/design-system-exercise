import { readFileSync } from 'node:fs';
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


const readModeMetadata=(relativePath:string)=>{
  const source=JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`../src/${relativePath}`,import.meta.url)),
      'utf8',
    ),
  ) as {
    $extensions?: {
      'design-system-exercise'?: {
        selectorAttribute?: string;
        selectorValues?: Record<string,string>;
      };
    };
  };
  return source.$extensions?.['design-system-exercise'];
};

it('declares the generated CSS mode activation contract',()=>{
  expect(readModeMetadata('color/semantic.tokens.json')).toEqual(
    expect.objectContaining({
      selectorAttribute:'data-theme',
      selectorValues:{ light:'light', dark:'dark' },
    }),
  );
  expect(readModeMetadata('typography/semantic.tokens.json')).toEqual(
    expect.objectContaining({
      selectorAttribute:'data-language',
      selectorValues:{ english:'en', arabic:'ar' },
    }),
  );
  expect(readModeMetadata('layout/semantic.tokens.json')).toEqual(
    expect.objectContaining({
      selectorAttribute:'data-layout',
      selectorValues:{ wide:'wide', narrow:'narrow' },
    }),
  );
});
