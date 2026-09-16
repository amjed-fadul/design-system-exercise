import { fileURLToPath } from 'node:url';
import { loadRegistry } from './lib/load.js';
import { validateRegistry } from './lib/references.js';

const registry = loadRegistry(fileURLToPath(new URL('../src/', import.meta.url)));
validateRegistry(registry);
console.log(`Validated ${registry.staticTokens.size + registry.modeTokens.size} logical tokens`);
