import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  documentationRows,
  TokenTable,
  type TokenRow,
} from '../shared/TokenTable';

const meta = { title: 'Foundations/Spacing' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function withPreview(rows: TokenRow[]) {
  return rows.map((row) => ({
    ...row,
    preview: (
      <span className="spacing-bar" style={{ width: row.value }} />
    ),
  }));
}

export const Primitives: Story = {
  render: () => (
    <TokenTable
      rows={withPreview(
        documentationRows('spacing.primitive', { layer: 'primitive' }),
      )}
    />
  ),
};

export const Semantic: Story = {
  render: () => (
    <TokenTable
      rows={withPreview(
        documentationRows('spacing.semantic', { layer: 'semantic' }),
      )}
    />
  ),
};
