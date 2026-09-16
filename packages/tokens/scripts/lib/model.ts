export type TokenType = 'color' | 'dimension' | 'number' | 'fontFamily' | 'fontWeight';
export type ModeAxis = 'theme' | 'language' | 'layout';
export type DimensionValue = { value: number; unit: 'px' };
export type RawTokenValue = string | number | boolean | DimensionValue;
export type ResolvedTokenValue = RawTokenValue;
export type ModeContext = Partial<Record<ModeAxis, string>>;

export interface LoadedToken {
  path: string;
  type: TokenType;
  rawValue: RawTokenValue;
  description?: string;
  modeAxis?: ModeAxis;
  mode?: string;
}

export interface TokenRegistry {
  staticTokens: Map<string, LoadedToken>;
  modeTokens: Map<string, { axis: ModeAxis; modes: Map<string, LoadedToken> }>;
}

export class TokenValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenValidationError';
  }
}
