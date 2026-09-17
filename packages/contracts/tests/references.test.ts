import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const componentsDir = fileURLToPath(new URL('../components/', import.meta.url));
const patternsDir = fileURLToPath(new URL('../patterns/', import.meta.url));

const excludedFigmaCollections = [
  'Button / Internal',
  'Component / Icon Render',
  'Component / Layout',
];

function componentContracts() {
  return readdirSync(componentsDir).filter((name) => name.endsWith('.contract.json')).sort();
}

describe('contract source integrity', () => {
  it('contains only the component contracts implemented through the C08 contract gate and no placeholder patterns', () => {
    const components = componentContracts();
    const patterns = existsSync(patternsDir)
      ? readdirSync(patternsDir).filter((name) => name.endsWith('.contract.json')).sort()
      : [];

    expect(components).toEqual([
      '_input-control.contract.json',
      '_radio-option.contract.json',
      'avatar.contract.json',
      'button.contract.json',
      'icon-button.contract.json',
      'inline-feedback.contract.json',
      'link.contract.json',
      'radio-group.contract.json',
      'search-field.contract.json',
      'text-field.contract.json',
    ]);
    expect(patterns).toEqual([]);
  });

  it('does not use excluded Figma implementation collections as governed token dependencies', () => {
    for (const filename of componentContracts()) {
      const contractText = readFileSync(new URL(`../components/${filename}`, import.meta.url), 'utf8');
      for (const excluded of excludedFigmaCollections) {
        expect(contractText).not.toContain(excluded);
      }
    }
  });
});
