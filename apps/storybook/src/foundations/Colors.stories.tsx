import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens, type ThemeMode } from '@design-system-exercise/tokens';
import { cssVariable, flattenTokens, TokenTable } from '../shared/TokenTable';
const meta={title:'Foundations/Colors'} satisfies Meta; export default meta; type Story=StoryObj<typeof meta>;
export const Primitives:Story={render:()=> <TokenTable rows={flattenTokens('color.primitive',tokens.color.primitive).map((row)=>({...row,preview:<span className="color-swatch" style={{background:row.value}}/>}))}/>};
export const Semantic:Story={render:(_args,context)=>{const mode=context.globals.theme as ThemeMode; return <TokenTable rows={flattenTokens('',tokens.color.semantic[mode]).map((row)=>{const path=`color.semantic.${row.name}`;return {name:path,value:row.value,preview:<span className="color-swatch" style={{background:`var(${cssVariable(path)})`}}/>};})}/>;}};
