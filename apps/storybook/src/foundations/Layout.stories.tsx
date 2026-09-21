import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenDocumentation } from '@design-system-exercise/tokens';
import {
  documentationRows,
  formatTokenValue,
  TokenTable,
} from '../shared/TokenTable';

const meta = { title: 'Foundations/Layout' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primitives: Story = {
  render: () => (
    <TokenTable
      rows={documentationRows('layout.primitive', {
        layer: 'primitive',
      })}
    />
  ),
};

export const Semantic: Story = {
  render: () => {
    const semantic = tokenDocumentation.filter(
      (entry) =>
        entry.layer === 'semantic' &&
        entry.path.startsWith('layout.semantic.'),
    );
    const paths = [...new Set(semantic.map((entry) => entry.path))].sort();

    const byMode = (path: string, mode: 'wide' | 'narrow') =>
      semantic.find(
        (entry) => entry.path === path && entry.mode === mode,
      );

    return (
      <table className="token-table layout-mode-table">
        <thead>
          <tr>
            <th>Semantic token</th>
            <th>Wide</th>
            <th>Narrow</th>
          </tr>
        </thead>
        <tbody>
          {paths.map((path) => (
            <tr key={path}>
              <td>
                <code>{path}</code>
              </td>
              {(['wide', 'narrow'] as const).map((mode) => {
                const entry = byMode(path, mode);
                return (
                  <td key={mode}>
                    {entry ? (
                      <div className="token-resolution">
                        <code>{entry.aliasOf ?? '—'}</code>
                        <span>
                          {formatTokenValue(entry.resolvedValue)}
                        </span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
