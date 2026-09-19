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

export type AiAuthoringRequirement = 'must' | 'must-not' | 'may' | 'escalate';

export interface AiAuthoringRule {
  id: string;
  category:
    | 'components'
    | 'tokens'
    | 'css'
    | 'dimensions'
    | 'composition'
    | 'direction'
    | 'icons'
    | 'accessibility'
    | 'storybook'
    | 'uncertainty';
  requirement: AiAuthoringRequirement;
  statement: string;
  rationale: string;
}

export interface AiAuthoringPolicy {
  id: 'dse.ai-authoring-policy';
  kind: 'ai-authoring-policy';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  name: string;
  scope: 'product-ui-authoring';
  authorityOrder: string[];
  rules: AiAuthoringRule[];
  localCss: {
    allowedAuthorities: string[];
    forbidden: string[];
    escalateWhen: string[];
  };
  storybook: {
    role: 'human-visible-evidence';
    may: string[];
    mustNot: string[];
  };
  provenance: {
    lastReviewed: string;
    audit: string;
  };
}

export interface CompositionGuidanceRule {
  id: string;
  statement: string;
}

export interface CompositionGuidanceStructure {
  key: string;
  order: number;
  required: boolean;
  role: string;
  componentIds?: string[];
  patternIds?: string[];
}

export interface CompositionGuidance {
  id: string;
  kind: 'composition-guidance';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  name: string;
  description: string;
  scope: 'page' | 'interaction' | 'flow';
  componentDependencies: ComponentDependency[];
  patternDependencies: ComponentDependency[];
  structure: CompositionGuidanceStructure[];
  rules: {
    layout: CompositionGuidanceRule[];
    responsive: CompositionGuidanceRule[];
    direction: CompositionGuidanceRule[];
    accessibility: CompositionGuidanceRule[];
    behavior: CompositionGuidanceRule[];
  };
  localCss: {
    allowed: CompositionGuidanceRule[];
    mustUseGovernedTokensWhenAvailable: true;
  };
  forbidden: string[];
  provenance: {
    lastReviewed: string;
    audit: string;
    evidence: string[];
  };
}
