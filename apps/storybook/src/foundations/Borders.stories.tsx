import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  documentationRows,
  TokenTable,
  type TokenRow,
} from '../shared/TokenTable';

const meta = { title: 'Foundations/Borders' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function withPreview(rows: TokenRow[]) {
  return rows.map((row) => ({
    ...row,
    preview: (
      <span
        className="border-sample"
        style={{ borderTopWidth: row.value }}
      />
    ),
  }));
}

export const Primitives: Story = {
  render: () => (
    <TokenTable
      rows={withPreview(
        documentationRows('border.width', { layer: 'primitive' }),
      )}
    />
  ),
};

export const Semantic: Story = {
  render: () => (
    <TokenTable
      rows={withPreview(
        documentationRows('border.role', { layer: 'semantic' }),
      )}
    />
  ),
};
