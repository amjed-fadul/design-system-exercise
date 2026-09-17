export interface FigmaSource {
  fileKey: string;
  nodeId: string;
}

export interface ContractSources {
  figma: FigmaSource;
  implementationPackage?: string;
}

export interface ContractProvenance {
  lastReviewed: string;
  references: string[];
}

export interface LoadedContract<T = unknown> {
  path: string;
  contract: T;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ComponentDependency {
  id: string;
  minimumVersion?: string;
}

export interface ComponentContract {
  id: string;
  kind: 'component';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  visibility: 'public' | 'internal';
  name: string;
  sources: ContractSources;
  tokenDependencies: string[];
}

export interface PatternContract {
  id: string;
  kind: 'pattern';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  name: string;
  sources: ContractSources;
  componentDependencies: ComponentDependency[];
}
