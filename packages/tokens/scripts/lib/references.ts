import { TokenValidationError, type ModeContext, type RawTokenValue, type ResolvedTokenValue, type TokenRegistry } from './model.js';

const ALIAS = /^\{([^}]+)\}$/;

export function resolveToken(registry: TokenRegistry, path: string, context: ModeContext = {}, stack: string[] = []): ResolvedTokenValue {
  if (stack.includes(path)) throw new TokenValidationError(`Circular token reference: ${[...stack, path].join(' -> ')}`);

  const staticToken = registry.staticTokens.get(path);
  let token = staticToken;
  let nextContext = context;

  if (!token) {
    const modeEntry = registry.modeTokens.get(path);
    if (!modeEntry) throw new TokenValidationError(`Unknown token reference: ${path}`);
    const mode = context[modeEntry.axis];
    if (!mode) throw new TokenValidationError(`Missing ${modeEntry.axis} mode for ${path}`);
    token = modeEntry.modes.get(mode);
    if (!token) throw new TokenValidationError(`Unknown ${modeEntry.axis} mode ${mode} for ${path}`);
    nextContext = { ...context, [modeEntry.axis]: mode };
  }

  const match = typeof token.rawValue === 'string' ? token.rawValue.match(ALIAS) : null;
  return match ? resolveToken(registry, match[1]!, nextContext, [...stack, path]) : token.rawValue;
}

export function validateRegistry(registry: TokenRegistry): void {
  for (const path of registry.staticTokens.keys()) resolveToken(registry, path);
  for (const [path, entry] of registry.modeTokens) {
    for (const mode of entry.modes.keys()) resolveToken(registry, path, { [entry.axis]: mode });
  }
}
