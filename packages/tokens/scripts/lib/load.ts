import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TokenValidationError, type LoadedToken, type ModeAxis, type RawTokenValue, type TokenRegistry, type TokenType } from './model.js';
import { SOURCE_FILES } from './sources.js';

type SourceFile = readonly [string, string];
const TYPES = new Set<TokenType>(['color', 'dimension', 'number', 'fontFamily', 'fontWeight']);
const AXES = new Set<ModeAxis>(['theme', 'language', 'layout']);
const ALIAS = /^\{[^}]+\}$/;
const HEX = /^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const isTokenLeaf = (value: unknown): value is Record<string, unknown> => isRecord(value) && '$value' in value;
const isAlias = (value: unknown): value is string => typeof value === 'string' && ALIAS.test(value);

const validateRaw = (type: TokenType, value: unknown, path: string): RawTokenValue => {
  if (isAlias(value)) return value;
  switch (type) {
    case 'color':
      if (typeof value === 'string' && HEX.test(value)) return value.toUpperCase();
      break;
    case 'dimension':
      if (isRecord(value) && Number.isFinite(value.value) && value.unit === 'px') return { value: value.value as number, unit: 'px' };
      break;
    case 'number':
    case 'fontWeight':
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      break;
    case 'fontFamily':
      if (typeof value === 'string' && value.trim().length > 0) return value;
      break;
  }
  throw new TokenValidationError(`Invalid ${type} value at ${path}`);
};

const leafToToken = (path: string, leaf: Record<string, unknown>, modeAxis?: ModeAxis, mode?: string): LoadedToken => {
  const type = leaf.$type;
  if (typeof type !== 'string' || !TYPES.has(type as TokenType)) throw new TokenValidationError(`Invalid or missing $type at ${path}`);
  if (!('$value' in leaf)) throw new TokenValidationError(`Missing $value at ${path}`);
  if (leaf.$description !== undefined && typeof leaf.$description !== 'string') throw new TokenValidationError(`Invalid $description at ${path}`);
  return {
    path,
    type: type as TokenType,
    rawValue: validateRaw(type as TokenType, leaf.$value, path),
    ...(typeof leaf.$description === 'string' ? { description: leaf.$description } : {}),
    ...(modeAxis ? { modeAxis } : {}),
    ...(mode ? { mode } : {})
  };
};

const walk = (node: Record<string, unknown>, prefix: string[], visit: (path: string[], leaf: Record<string, unknown>) => void) => {
  for (const key of Object.keys(node).sort()) {
    if (key.startsWith('$')) continue;
    const value = node[key];
    if (!isRecord(value)) throw new TokenValidationError(`Invalid group at ${[...prefix, key].join('.')}`);
    if (isTokenLeaf(value)) visit([...prefix, key], value);
    else walk(value, [...prefix, key], visit);
  }
};

const modeMetadata = (root: Record<string, unknown>, file: string) => {
  const ext = root.$extensions;
  if (ext === undefined) return null;
  if (!isRecord(ext) || !isRecord(ext['design-system-exercise'])) throw new TokenValidationError(`Invalid $extensions in ${file}`);
  const meta = ext['design-system-exercise'];
  const axis = meta.modeAxis;
  const modes = meta.modes;
  if (typeof axis !== 'string' || !AXES.has(axis as ModeAxis)) throw new TokenValidationError(`Invalid modeAxis in ${file}`);
  if (!Array.isArray(modes) || modes.length === 0 || !modes.every((m) => typeof m === 'string' && m.length > 0)) throw new TokenValidationError(`Invalid modes in ${file}`);
  if (new Set(modes).size !== modes.length) throw new TokenValidationError(`Duplicate modes in ${file}`);
  return { axis: axis as ModeAxis, modes: modes as string[] };
};

export function loadRegistry(rootDir: string, sourceFiles: readonly SourceFile[] = SOURCE_FILES): TokenRegistry {
  const registry: TokenRegistry = { staticTokens: new Map(), modeTokens: new Map() };
  for (const [relativePath, logicalPrefix] of sourceFiles) {
    const parsed = JSON.parse(readFileSync(join(rootDir, relativePath), 'utf8')) as unknown;
    if (!isRecord(parsed)) throw new TokenValidationError(`Token source ${relativePath} must be an object`);
    const meta = modeMetadata(parsed, relativePath);
    if (!meta) {
      walk(parsed, logicalPrefix.split('.'), (segments, leaf) => {
        const path = segments.join('.');
        if (registry.staticTokens.has(path) || registry.modeTokens.has(path)) throw new TokenValidationError(`Duplicate logical token path: ${path}`);
        registry.staticTokens.set(path, leafToToken(path, leaf));
      });
      continue;
    }

    const seenInFile = new Map<string, Set<string>>();
    for (const mode of meta.modes) {
      const group = parsed[mode];
      if (!isRecord(group)) throw new TokenValidationError(`Missing declared mode ${mode} in ${relativePath}`);
      walk(group, logicalPrefix.split('.'), (segments, leaf) => {
        const path = segments.join('.');
        if (registry.staticTokens.has(path)) throw new TokenValidationError(`Duplicate logical token path: ${path}`);
        let entry = registry.modeTokens.get(path);
        if (!entry) { entry = { axis: meta.axis, modes: new Map() }; registry.modeTokens.set(path, entry); }
        if (entry.axis !== meta.axis) throw new TokenValidationError(`Conflicting mode axes for ${path}`);
        if (entry.modes.has(mode)) throw new TokenValidationError(`Duplicate logical token path + mode: ${path} (${mode})`);
        entry.modes.set(mode, leafToToken(path, leaf, meta.axis, mode));
        if (!seenInFile.has(path)) seenInFile.set(path, new Set());
        seenInFile.get(path)!.add(mode);
      });
    }
    for (const [path, modes] of seenInFile) {
      const missing = meta.modes.filter((mode) => !modes.has(mode));
      if (missing.length) throw new TokenValidationError(`Incomplete modes for ${path}: missing ${missing.join(', ')}`);
    }
  }
  return registry;
}
