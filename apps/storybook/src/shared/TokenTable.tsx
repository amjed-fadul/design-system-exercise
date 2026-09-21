import type { ReactNode } from 'react';
import { tokenDocumentation } from '@design-system-exercise/tokens';

export interface TokenRow {
  name: string;
  value: string;
  preview?: ReactNode;
  alias?: string | null;
}

export interface DocumentationRowOptions {
  layer?: 'primitive' | 'semantic' | 'foundation';
  mode?: string;
}

export const cssVariable = (path: string) =>
  `--dse-${path.replaceAll('.', '-')}`;

const isDimension = (
  value: unknown,
): value is { value: number; unit: string } =>
  Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      'value' in value &&
      'unit' in value,
  );

export const formatTokenValue = (value: unknown): string => {
  if (isDimension(value)) return `${value.value}${value.unit}`;
  return String(value);
};

export const flattenTokens = (
  prefix: string,
  value: unknown,
): TokenRow[] => {
  if (isDimension(value)) {
    return [{ name: prefix, value: formatTokenValue(value) }];
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [{ name: prefix, value: String(value) }];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]) =>
      flattenTokens(prefix ? `${prefix}.${key}` : key, child),
  );
};

export function documentationRows(
  prefix: string,
  options: DocumentationRowOptions = {},
): TokenRow[] {
  return tokenDocumentation
    .filter((entry) => {
      if (!(entry.path === prefix || entry.path.startsWith(`${prefix}.`))) {
        return false;
      }
      if (options.layer && entry.layer !== options.layer) return false;
      if (options.mode && entry.mode !== options.mode) return false;
      if (!options.mode && entry.mode !== null) return false;
      return true;
    })
    .map((entry) => ({
      name: entry.path,
      alias: entry.aliasOf,
      value: formatTokenValue(entry.resolvedValue),
    }));
}

export function TokenTable({
  rows,
  valueLabel,
}: {
  rows: TokenRow[];
  valueLabel?: string;
}) {
  const showAlias = rows.some((row) => Boolean(row.alias));

  return (
    <table className="token-table">
      <thead>
        <tr>
          <th>Token</th>
          {showAlias ? <th>Alias</th> : null}
          <th>Preview</th>
          <th>{valueLabel ?? (showAlias ? 'Resolved' : 'Value')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>
              <code>{row.name}</code>
            </td>
            {showAlias ? (
              <td>{row.alias ? <code>{row.alias}</code> : '—'}</td>
            ) : null}
            <td>{row.preview ?? '—'}</td>
            <td>
              <code>{row.value}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
