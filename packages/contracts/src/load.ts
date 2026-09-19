import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LoadedContract } from './types.js';

export const contractsRoot = fileURLToPath(new URL('../', import.meta.url));
export const componentsDir = join(contractsRoot, 'components');
export const patternsDir = join(contractsRoot, 'patterns');
export const aiDir = join(contractsRoot, 'ai');
export const compositionsDir = join(aiDir, 'compositions');
export const evalsDir = join(aiDir, 'evals');

function loadDirectory(directory: string, suffix: string): LoadedContract[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory)
    .filter((name) => name.endsWith(suffix))
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
  return loadDirectory(componentsDir, '.contract.json');
}

export function loadPatternContracts(): LoadedContract[] {
  return loadDirectory(patternsDir, '.contract.json');
}

export function loadAuthoringPolicies(): LoadedContract[] {
  return loadDirectory(aiDir, '-policy.json');
}

export function loadCompositionGuidance(): LoadedContract[] {
  return loadDirectory(compositionsDir, '.guidance.json');
}

export function loadAiEvalTasks(): LoadedContract[] {
  return loadDirectory(evalsDir, '.task.json');
}

export function loadAiTestPacks(): LoadedContract[] {
  return loadDirectory(evalsDir, 'test-pack.json');
}
