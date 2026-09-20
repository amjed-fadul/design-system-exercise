import { cssName } from './css.js';
import type { TokenRegistry } from './model.js';

const customPropertyPattern = /--dse-[a-z0-9-]+/g;

const governedPrefixes = (registry: TokenRegistry) =>
  new Set(
    [...registry.staticTokens.keys(), ...registry.modeTokens.keys()].map(
      (path) => `--dse-${path.split('.')[0]}-`,
    ),
  );

export const governedCssVariableNames = (registry: TokenRegistry) =>
  new Set(
    [...registry.staticTokens.keys(), ...registry.modeTokens.keys()].map(cssName),
  );

export function validateGovernedCssReferences(
  content: string,
  registry: TokenRegistry,
): string[] {
  const valid = governedCssVariableNames(registry);
  const prefixes = governedPrefixes(registry);
  const references = new Set(content.match(customPropertyPattern) ?? []);

  return [...references]
    .filter(
      (reference) =>
        [...prefixes].some((prefix) => reference.startsWith(prefix)) &&
        !valid.has(reference),
    )
    .sort((a, b) => a.localeCompare(b));
}
