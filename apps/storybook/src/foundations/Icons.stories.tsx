import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  documentationRows,
  TokenTable,
  type TokenRow,
} from '../shared/TokenTable';

const meta = { title: 'Foundations/Icons' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function sizePreview(rows: TokenRow[]) {
  return rows.map((row) => ({
    ...row,
    preview: (
      <span
        className="icon-box"
        style={{ width: row.value, height: row.value }}
      />
    ),
  }));
}

function strokePreview(rows: TokenRow[]) {
  return rows.map((row) => ({
    ...row,
    preview: (
      <span
        className="icon-stroke"
        style={{ borderTopWidth: row.value }}
      />
    ),
  }));
}

export const Size: Story = {
  render: () => (
    <TokenTable
      rows={sizePreview(
        documentationRows('icons.size', { layer: 'foundation' }),
      )}
    />
  ),
};

export const Stroke: Story = {
  render: () => (
    <TokenTable
      rows={strokePreview(
        documentationRows('icons.stroke', { layer: 'foundation' }),
      )}
    />
  ),
};
