import type {
  LoadedToken,
  ModeContext,
  RawTokenValue,
  ResolvedTokenValue,
  TokenRegistry,
  TokenType,
} from './model.js';
import { resolveToken } from './references.js';

export type TokenDocumentationLayer = 'primitive' | 'semantic' | 'foundation';

export interface TokenDocumentationEntry {
  path: string;
  layer: TokenDocumentationLayer;
  type: TokenType;
  aliasOf: string | null;
  resolvedValue: ResolvedTokenValue;
  modeAxis: string | null;
  mode: string | null;
  description: string | null;
}

const ALIAS = /^\{([^}]+)\}$/;

function aliasOf(value: RawTokenValue): string | null {
  return typeof value === 'string' ? value.match(ALIAS)?.[1] ?? null : null;
}

function layerFor(path: string): TokenDocumentationLayer {
  if (
    path.startsWith('color.primitive.') ||
    path.startsWith('spacing.primitive.') ||
    path.startsWith('typography.primitive.') ||
    path.startsWith('layout.primitive.') ||
    path.startsWith('border.width.') ||
    path.startsWith('radius.radius.')
  ) {
    return 'primitive';
  }

  if (
    path.startsWith('color.semantic.') ||
    path.startsWith('spacing.semantic.') ||
    path.startsWith('typography.semantic.') ||
    path.startsWith('layout.semantic.') ||
    path.startsWith('border.role.') ||
    path.startsWith('radius.shape.')
  ) {
    return 'semantic';
  }

  return 'foundation';
}

function entryFor(
  token: LoadedToken,
  resolvedValue: ResolvedTokenValue,
): TokenDocumentationEntry {
  return {
    path: token.path,
    layer: layerFor(token.path),
    type: token.type,
    aliasOf: aliasOf(token.rawValue),
    resolvedValue,
    modeAxis: token.modeAxis ?? null,
    mode: token.mode ?? null,
    description: token.description ?? null,
  };
}

export function buildTokenDocumentation(
  registry: TokenRegistry,
): TokenDocumentationEntry[] {
  const entries: TokenDocumentationEntry[] = [];

  for (const [path, token] of registry.staticTokens) {
    entries.push(entryFor(token, resolveToken(registry, path)));
  }

  for (const [path, modeEntry] of registry.modeTokens) {
    for (const [mode, token] of modeEntry.modes) {
      const context: ModeContext = { [modeEntry.axis]: mode };
      entries.push(entryFor(token, resolveToken(registry, path, context)));
    }
  }

  return entries.sort(
    (a, b) =>
      a.path.localeCompare(b.path) ||
      (a.mode ?? '').localeCompare(b.mode ?? ''),
  );
}

export function generateDocumentationTypeScript(
  registry: TokenRegistry,
): string {
  const entries = buildTokenDocumentation(registry);
  return [
    `export const tokenDocumentation = ${JSON.stringify(entries, null, 2)} as const;`,
    `export type TokenDocumentationEntry = (typeof tokenDocumentation)[number];`,
    `export type TokenLayer = 'primitive' | 'semantic' | 'foundation';`,
    '',
  ].join('\n');
}
