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
  owner: 'design-system' | 'composition' | 'product' | 'workflow';
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

export interface ProductContext {
  id: string;
  kind: 'product-context';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  name: string;
  scope: 'workspace-shell';
  patternId: string;
  componentDependencies: string[];
  assets: Array<{
    id: string;
    path: string;
    kind: 'svg';
    usage: string;
    rendering: 'mask-currentColor' | 'inline-currentColor';
    directional: boolean;
  }>;
  composition: unknown;
}

export type AiEvalDimension =
  | 'component-selection'
  | 'invented-api'
  | 'custom-css'
  | 'raw-values'
  | 'composition'
  | 'accessibility'
  | 'rtl'
  | 'responsive'
  | 'visual-fidelity';

export interface AiBlindAuthoringTask {
  id: string;
  kind: 'ai-blind-authoring-task';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  name: string;
  caseType: 'baseline-known' | 'generalization';
  agentVisible: {
    productContextIds?: string[];
    productRequirement: {
      summary: string;
      userGoals: string[];
      dataFixtures: string[];
      requiredStates: string[];
      presentationModes: string[];
    };
    deliverable: {
      writeRoot: string;
      requiredFiles: string[];
      storyTitle: string;
    };
    executionRules: string[];
  };
  evaluatorOnly: {
    expectedAuthorities: {
      components: string[];
      patterns: string[];
      compositions: string[];
    };
    checks: Array<{
      id: string;
      category: AiEvalDimension;
      requirement: 'must' | 'must-not' | 'expected';
      statement: string;
    }>;
    expectedEscalations: string[];
    contaminationSignals: string[];
  };
  provenance: {
    lastReviewed: string;
    plan: string;
  };
}

export interface AiTestPack {
  id: 'dse.ai-eval-pack.v1';
  kind: 'ai-test-pack';
  version: string;
  status: 'draft' | 'approved' | 'deprecated';
  name: string;
  taskIds: string[];
  agentContext: {
    allow: string[];
    deny: string[];
  };
  blindProtocol: {
    freshSessionPerTask: true;
    freshWorktreePerTask: true;
    agentReceivesOnlyAgentVisibleTaskData: true;
    neverExposeEvaluatorOnly: true;
    noCrossRunReuse: true;
    generatedOutputReadableWithinTask: true;
    noRepositoryHistoryForAnswers: true;
    noExternalAnswerLookup: true;
    noHumanCorrectionDuringRun: true;
    verificationCommandsMayTransitivelyProcessDeniedSource: true;
    deniedSourceRemainsNonAuthoringContextDuringVerification: true;
    runtimeRenderSmokeRequired: true;
  };
  evaluationDimensions: AiEvalDimension[];
  provenance: {
    lastReviewed: string;
    plan: string;
  };
}
