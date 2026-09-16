import type { ReactNode } from 'react';
export interface TokenRow{name:string;value:string;preview?:ReactNode}
export const cssVariable=(path:string)=>`--dse-${path.replaceAll('.', '-')}`;
const isDimension=(value:unknown):value is {value:number;unit:string}=>Boolean(value&&typeof value==='object'&&!Array.isArray(value)&&'value' in value&&'unit' in value);
export const flattenTokens=(prefix:string,value:unknown):TokenRow[]=>{ if(isDimension(value)) return [{name:prefix,value:`${value.value}${value.unit}`}]; if(!value||typeof value!=='object'||Array.isArray(value)) return [{name:prefix,value:String(value)}]; return Object.entries(value as Record<string,unknown>).flatMap(([key,child])=>flattenTokens(prefix?`${prefix}.${key}`:key,child)); };
export function TokenTable({rows}:{rows:TokenRow[]}){return <table className="token-table"><thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead><tbody>{rows.map((row)=><tr key={row.name}><td><code>{row.name}</code></td><td>{row.preview??'—'}</td><td><code>{row.value}</code></td></tr>)}</tbody></table>}
