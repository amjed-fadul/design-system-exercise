import type { TokenRegistry } from './model.js';
import { resolveToken } from './references.js';

const setNested=(root:Record<string,unknown>,segments:string[],value:unknown)=>{ let current=root; for(const segment of segments.slice(0,-1)){ const existing=current[segment]; if(!existing || typeof existing!=='object' || Array.isArray(existing)) current[segment]={}; current=current[segment] as Record<string,unknown>; } current[segments.at(-1)!]=value; };
const buildRuntimeTree=(registry:TokenRegistry)=>{
  const tree:Record<string,unknown>={};
  for(const [path] of [...registry.staticTokens].sort(([a],[b])=>a.localeCompare(b))) setNested(tree,path.split('.'),resolveToken(registry,path));
  for(const [path,entry] of [...registry.modeTokens].sort(([a],[b])=>a.localeCompare(b))){ const segments=path.split('.'); const layerIndex=segments.indexOf('semantic'); for(const mode of [...entry.modes.keys()].sort()){ const modePath=[...segments.slice(0,layerIndex+1),mode,...segments.slice(layerIndex+1)]; setNested(tree,modePath,resolveToken(registry,path,{[entry.axis]:mode})); } }
  return tree;
};
export const generateTypeScript=(registry:TokenRegistry)=>{ const tree=buildRuntimeTree(registry); return [`export const tokens = ${JSON.stringify(tree,null,2)} as const;`,`export type ThemeMode = 'light' | 'dark';`,`export type LanguageMode = 'english' | 'arabic';`,`export type LayoutMode = 'wide' | 'narrow';`,'' ].join('\n'); };
