import type { RawTokenValue, TokenRegistry } from './model.js';

export const cssName=(path:string)=>`--dse-${path.replaceAll('.', '-')}`;
const aliasPath=(value:RawTokenValue)=>typeof value==='string' && /^\{([^}]+)\}$/.test(value)?value.slice(1,-1):null;
const cssValue=(value:RawTokenValue)=>{ const ref=aliasPath(value); if(ref) return `var(${cssName(ref)})`; if(typeof value==='object') return `${value.value}${value.unit}`; return String(value); };
const renderBlock=(selector:string,entries:Array<[string,RawTokenValue]>)=>`${selector} {\n${entries.sort(([a],[b])=>a.localeCompare(b)).map(([path,value])=>`  ${cssName(path)}: ${cssValue(value)};`).join('\n')}\n}`;

export const generateCss=(registry:TokenRegistry)=>{
  const staticEntries=[...registry.staticTokens.entries()].map(([path,token])=>[path,token.rawValue] as [string,RawTokenValue]);
  const modeEntries=(axis:'theme'|'language'|'layout',mode:string)=>[...registry.modeTokens.entries()].filter(([,entry])=>entry.axis===axis).map(([path,entry])=>[path,entry.modes.get(mode)!.rawValue] as [string,RawTokenValue]);
  return [
    renderBlock(':root',staticEntries),
    renderBlock(':root, [data-theme="light"]',modeEntries('theme','light')),
    renderBlock('[data-theme="dark"]',modeEntries('theme','dark')),
    renderBlock(':root, [data-language="en"]',modeEntries('language','english')),
    renderBlock('[data-language="ar"]',modeEntries('language','arabic')),
    renderBlock(':root, [data-layout="wide"]',modeEntries('layout','wide')),
    renderBlock('[data-layout="narrow"]',modeEntries('layout','narrow')),
    ''
  ].join('\n\n');
};
