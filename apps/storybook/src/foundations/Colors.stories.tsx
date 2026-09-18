import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ThemeMode } from '@design-system-exercise/tokens';
import {
  documentationRows,
  TokenTable,
  type TokenRow,
} from '../shared/TokenTable';

const meta = { title: 'Foundations/Colors' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function withSwatches(rows: TokenRow[]) {
  return rows.map((row) => ({
    ...row,
    preview: (
      <span className="color-swatch" style={{ background: row.value }} />
    ),
  }));
}

export const Primitives: Story = {
  render: () => (
    <TokenTable
      rows={withSwatches(
        documentationRows('color.primitive', { layer: 'primitive' }),
      )}
    />
  ),
};

export const Semantic: Story = {
  render: (_args, context) => {
    const mode: ThemeMode =
      context.globals.theme === 'dark' ? 'dark' : 'light';

    return (
      <TokenTable
        rows={withSwatches(
          documentationRows('color.semantic', {
            layer: 'semantic',
            mode,
          }),
        )}
      />
    );
  },
};
