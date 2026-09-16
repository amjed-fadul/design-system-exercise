import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens } from '@design-system-exercise/tokens';
import { flattenTokens, TokenTable } from '../shared/TokenTable';
const meta={title:'Foundations/Radius'} satisfies Meta; export default meta; type Story=StoryObj<typeof meta>;
export const AllRadius:Story={render:()=><TokenTable rows={flattenTokens('radius',tokens.radius).map((row)=>({...row,preview:<span className="radius-sample" style={{borderRadius:row.value}}/>}))}/>};
