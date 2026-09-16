import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LoadedContract } from './types.js';

export const contractsRoot = fileURLToPath(new URL('../', import.meta.url));
export const componentsDir = join(contractsRoot, 'components');
export const patternsDir = join(contractsRoot, 'patterns');

function loadDirectory(directory: string): LoadedContract[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory)
    .filter((name) => name.endsWith('.contract.json'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const path = join(directory, name);
      return {
        path,
        contract: JSON.parse(readFileSync(path, 'utf8')) as unknown,
      };
    });
}

export function loadComponentContracts(): LoadedContract[] {
  return loadDirectory(componentsDir);
}

export function loadPatternContracts(): LoadedContract[] {
  return loadDirectory(patternsDir);
}
