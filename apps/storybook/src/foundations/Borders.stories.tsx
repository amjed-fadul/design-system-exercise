import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens } from '@design-system-exercise/tokens';
import { flattenTokens, TokenTable } from '../shared/TokenTable';
const meta={title:'Foundations/Borders'} satisfies Meta; export default meta; type Story=StoryObj<typeof meta>;
export const AllBorders:Story={render:()=><TokenTable rows={flattenTokens('border',tokens.border).map((row)=>({...row,preview:<span className="border-sample" style={{borderTopWidth:row.value}}/>}))}/>};
