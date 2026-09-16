import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateCss } from './lib/css.js';
import { loadRegistry } from './lib/load.js';
import { validateRegistry } from './lib/references.js';
import { generateTypeScript } from './lib/typescript.js';

const sourceDir=fileURLToPath(new URL('../src/',import.meta.url));
const generatedDir=fileURLToPath(new URL('../.generated/',import.meta.url));
const distDir=fileURLToPath(new URL('../dist/',import.meta.url));
rmSync(generatedDir,{recursive:true,force:true}); rmSync(distDir,{recursive:true,force:true}); mkdirSync(generatedDir,{recursive:true}); mkdirSync(distDir,{recursive:true});
const registry=loadRegistry(sourceDir); validateRegistry(registry);
writeFileSync(new URL('../.generated/index.ts',import.meta.url),generateTypeScript(registry));
writeFileSync(new URL('../.generated/tokens.css',import.meta.url),generateCss(registry));
cpSync(new URL('../.generated/tokens.css',import.meta.url),new URL('../dist/tokens.css',import.meta.url));
console.log(`Generated ${registry.staticTokens.size+registry.modeTokens.size} logical tokens`);
