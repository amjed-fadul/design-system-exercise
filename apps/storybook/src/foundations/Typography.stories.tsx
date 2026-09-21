import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LanguageMode } from '@design-system-exercise/tokens';
import {
  documentationRows,
  TokenTable,
  type TokenRow,
} from '../shared/TokenTable';

const meta = { title: 'Foundations/Typography' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function primitivePreview(row: TokenRow) {
  if (row.name.includes('.family.')) {
    return <span style={{ fontFamily: row.value }}>Aa أب</span>;
  }
  if (row.name.includes('.weight.')) {
    return <span style={{ fontWeight: row.value }}>Aa</span>;
  }
  if (row.name.includes('.size.')) {
    return <span style={{ fontSize: row.value }}>Aa</span>;
  }
  if (row.name.includes('.line-height.')) {
    return <span style={{ lineHeight: row.value }}>Aa</span>;
  }
  return null;
}

export const Primitives: Story = {
  render: () => (
    <TokenTable
      rows={documentationRows('typography.primitive', {
        layer: 'primitive',
      }).map((row) => ({
        ...row,
        preview: primitivePreview(row),
      }))}
    />
  ),
};

export const Semantic: Story = {
  render: (_args, context) => {
    const language: LanguageMode =
      context.globals.language === 'arabic' ? 'arabic' : 'english';
    const sample =
      language === 'arabic'
        ? 'أنظمة التصميم تجعل القرارات قابلة لإعادة الاستخدام.'
        : 'Design systems make decisions reusable.';

    const rows = documentationRows('typography.semantic', {
      layer: 'semantic',
      mode: language,
    });
    const rolePaths = [
      ...new Set(
        rows.map((row) => row.name.split('.').slice(0, -1).join('.')),
      ),
    ].sort();

    return (
      <div className="type-stack">
        {rolePaths.map((rolePath) => {
          const role = rolePath.replace('typography.semantic.', '');
          const variableBase = `--dse-typography-semantic-${role.replaceAll('.', '-')}`;
          const roleRows = rows.filter((row) =>
            row.name.startsWith(`${rolePath}.`),
          );

          return (
            <section key={rolePath}>
              <code>{rolePath}</code>
              <p
                className="type-specimen"
                style={{
                  fontFamily: `var(${variableBase}-family)`,
                  fontSize: `var(${variableBase}-size)`,
                  fontWeight: `var(${variableBase}-weight)`,
                  lineHeight: `var(${variableBase}-line-height)`,
                  letterSpacing: `var(${variableBase}-letter-spacing)`,
                }}
              >
                {sample}
              </p>
              <TokenTable rows={roleRows} />
            </section>
          );
        })}
      </div>
    );
  },
};
