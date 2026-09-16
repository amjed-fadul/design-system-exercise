import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const componentsDir = fileURLToPath(new URL('../components/', import.meta.url));
const patternsDir = fileURLToPath(new URL('../patterns/', import.meta.url));
const buttonPath = fileURLToPath(new URL('../components/button.contract.json', import.meta.url));

const excludedFigmaCollections = [
  'Button / Internal',
  'Component / Icon Render',
  'Component / Layout',
];

describe('contract source integrity', () => {
  it('starts the governed inventory with Button only and no placeholder patterns', () => {
    expect(existsSync(buttonPath)).toBe(true);
    if (!existsSync(buttonPath)) return;

    const components = readdirSync(componentsDir).filter((name) => name.endsWith('.contract.json')).sort();
    const patterns = existsSync(patternsDir)
      ? readdirSync(patternsDir).filter((name) => name.endsWith('.contract.json')).sort()
      : [];

    expect(components).toEqual(['button.contract.json']);
    expect(patterns).toEqual([]);
  });

  it('does not use excluded Figma implementation collections as public token dependencies', () => {
    expect(existsSync(buttonPath)).toBe(true);
    if (!existsSync(buttonPath)) return;

    const contractText = readFileSync(buttonPath, 'utf8');
    for (const excluded of excludedFigmaCollections) {
      expect(contractText).not.toContain(excluded);
    }
  });
});
