import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens } from '@design-system-exercise/tokens';
import { flattenTokens, TokenTable } from '../shared/TokenTable';
const meta={title:'Foundations/Spacing'} satisfies Meta; export default meta; type Story=StoryObj<typeof meta>;
export const AllSpacing:Story={render:()=><TokenTable rows={[...flattenTokens('spacing.primitive',tokens.spacing.primitive),...flattenTokens('spacing.semantic',tokens.spacing.semantic)].map((row)=>({...row,preview:<span className="spacing-bar" style={{width:row.value}}/>}))}/>};
