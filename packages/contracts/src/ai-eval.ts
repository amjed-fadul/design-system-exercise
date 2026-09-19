import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Ajv, { type AnySchema, type ErrorObject, type ValidateFunction } from 'ajv';
import {
  loadAiEvalTasks,
  loadAiTestPacks,
  loadComponentContracts,
  loadCompositionGuidance,
  loadPatternContracts,
} from './load.js';
import type {
  AiBlindAuthoringTask,
  AiTestPack,
  AiEvalDimension,
  ComponentContract,
  CompositionGuidance,
  PatternContract,
  ValidationResult,
} from './types.js';

function readJson(url: URL): AnySchema {
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as AnySchema;
}

const ajv = new Ajv({ allErrors: true, strict: true });
const taskSchema = readJson(
  new URL('../schema/ai-blind-authoring-task.schema.json', import.meta.url),
);
const packSchema = readJson(
  new URL('../schema/ai-test-pack.schema.json', import.meta.url),
);
const taskValidator = ajv.compile(taskSchema);
const packValidator = ajv.compile(packSchema);

const requiredTaskIds = [
  'dse.ai-eval.projects-directory',
  'dse.ai-eval.team-management',
  'dse.ai-eval.api-keys-management',
] as const;

const requiredAllowContext = [
  'packages/contracts/ai/authoring-policy.json',
  'packages/contracts/ai/compositions/*.guidance.json',
  'packages/contracts/components/*.contract.json',
  'packages/contracts/patterns/*.contract.json',
  'packages/tokens/src/**/*.tokens.json',
] as const;

const requiredDeniedContext = [
  'apps/storybook/src/prototypes/**',
  'apps/storybook/src/patterns/**',
  'apps/storybook/src/components/**',
  'packages/react/src/**',
  'packages/patterns/src/**',
  'docs/ai-readiness/**',
] as const;

const requiredDimensions: AiEvalDimension[] = [
  'component-selection',
  'invented-api',
  'custom-css',
  'raw-values',
  'composition',
  'accessibility',
  'rtl',
  'responsive',
  'visual-fidelity',
];

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  return (errors ?? [])
    .map((error) => `${error.instancePath || '/'}: ${error.message ?? 'invalid value'}`)
    .sort((a, b) => a.localeCompare(b));
}

function runValidator(
  validator: ValidateFunction,
  candidate: unknown,
): ValidationResult {
  const valid = validator(candidate) as boolean;
  return {
    valid,
    errors: valid ? [] : formatErrors(validator.errors),
  };
}

export function validateAiBlindTask(candidate: unknown): ValidationResult {
  return runValidator(taskValidator, candidate);
}

export function validateAiTestPack(candidate: unknown): ValidationResult {
  return runValidator(packValidator, candidate);
}

export function buildAgentTaskPayload(task: AiBlindAuthoringTask) {
  return {
    id: task.id,
    name: task.name,
    caseType: task.caseType,
    agentVisible: structuredClone(task.agentVisible),
  };
}

function setsEqual<T>(left: readonly T[], right: readonly T[]) {
  return (
    left.length === right.length &&
    left.every((item) => new Set(right).has(item))
  );
}

function versionAtLeast(actual: string, minimum: string): boolean {
  const a = actual.split('.').map(Number);
  const b = minimum.split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    const av = a[index] ?? 0;
    const bv = b[index] ?? 0;
    if (av > bv) return true;
    if (av < bv) return false;
  }
  return true;
}

export function validateAiEvalRepository(): ValidationResult {
  const errors: string[] = [];
  const loadedTasks = loadAiEvalTasks();
  const loadedPacks = loadAiTestPacks();

  if (loadedPacks.length !== 1) {
    errors.push(
      `/ai/evals: expected exactly 1 AI test pack, found ${loadedPacks.length}`,
    );
  }

  if (loadedTasks.length !== 3) {
    errors.push(
      `/ai/evals: expected exactly 3 blind authoring tasks, found ${loadedTasks.length}`,
    );
  }

  const tasks: AiBlindAuthoringTask[] = [];
  for (const loaded of loadedTasks) {
    const result = validateAiBlindTask(loaded.contract);
    for (const error of result.errors) {
      errors.push(`${loaded.path}: ${error}`);
    }
    if (result.valid) tasks.push(loaded.contract as AiBlindAuthoringTask);
  }

  let pack: AiTestPack | null = null;
  for (const loaded of loadedPacks) {
    const result = validateAiTestPack(loaded.contract);
    for (const error of result.errors) {
      errors.push(`${loaded.path}: ${error}`);
    }
    if (result.valid) pack = loaded.contract as AiTestPack;
  }

  const taskIds = tasks.map((task) => task.id);
  if (!setsEqual(taskIds, [...requiredTaskIds])) {
    errors.push('/ai/evals: blind task ids do not match the required V1 task set');
  }

  const writeRoots = tasks.map((task) => task.agentVisible.deliverable.writeRoot);
  if (new Set(writeRoots).size !== writeRoots.length) {
    errors.push('/ai/evals: each blind task must have a unique isolated writeRoot');
  }

  const storyTitles = tasks.map((task) => task.agentVisible.deliverable.storyTitle);
  if (new Set(storyTitles).size !== storyTitles.length) {
    errors.push('/ai/evals: each blind task must have a unique Storybook title');
  }

  const generalizationCount = tasks.filter(
    (task) => task.caseType === 'generalization',
  ).length;
  const baselineCount = tasks.filter(
    (task) => task.caseType === 'baseline-known',
  ).length;
  if (generalizationCount !== 1 || baselineCount !== 2) {
    errors.push(
      `/ai/evals: expected 2 baseline-known tasks and 1 generalization task; found ${baselineCount} baseline and ${generalizationCount} generalization`,
    );
  }

  const components = new Map<string, ComponentContract>();
  for (const loaded of loadComponentContracts()) {
    const contract = loaded.contract as ComponentContract;
    if (contract.visibility === 'public') components.set(contract.id, contract);
  }

  const patterns = new Map<string, PatternContract>();
  for (const loaded of loadPatternContracts()) {
    const contract = loaded.contract as PatternContract;
    patterns.set(contract.id, contract);
  }

  const compositions = new Map<string, CompositionGuidance>();
  for (const loaded of loadCompositionGuidance()) {
    const guidance = loaded.contract as CompositionGuidance;
    compositions.set(guidance.id, guidance);
  }

  for (const task of tasks) {
    const categories = task.evaluatorOnly.checks.map((check) => check.category);
    if (!setsEqual(categories, requiredDimensions)) {
      errors.push(
        `${task.id}: evaluator checks must cover each V1 evaluation dimension exactly once`,
      );
    }

    if (
      task.agentVisible.deliverable.requiredFiles.some((name) =>
        name.includes('/'),
      )
    ) {
      errors.push(
        `${task.id}: deliverable requiredFiles must be filenames relative to writeRoot`,
      );
    }

    for (const id of task.evaluatorOnly.expectedAuthorities.components) {
      const contract = components.get(id);
      if (!contract || contract.status !== 'approved') {
        errors.push(
          `${task.id}: evaluator references unresolved or unapproved public component ${id}`,
        );
      }
    }

    for (const id of task.evaluatorOnly.expectedAuthorities.patterns) {
      const contract = patterns.get(id);
      if (!contract || contract.status !== 'approved') {
        errors.push(
          `${task.id}: evaluator references unresolved or unapproved pattern ${id}`,
        );
      }
    }

    for (const id of task.evaluatorOnly.expectedAuthorities.compositions) {
      const guidance = compositions.get(id);
      if (!guidance || guidance.status !== 'approved') {
        errors.push(
          `${task.id}: evaluator references unresolved or unapproved composition guidance ${id}`,
        );
      }
    }

    const payload = JSON.stringify(buildAgentTaskPayload(task));
    if (payload.includes('evaluatorOnly')) {
      errors.push(`${task.id}: agent payload leaked evaluatorOnly data`);
    }

    for (const denied of requiredDeniedContext) {
      const stablePrefix = denied.split('*')[0]!;
      if (stablePrefix && payload.includes(stablePrefix)) {
        errors.push(
          `${task.id}: agent-visible task data references denied answer-source path ${stablePrefix}`,
        );
      }
    }
  }

  if (pack) {
    if (!setsEqual(pack.taskIds, taskIds)) {
      errors.push('/ai/evals/test-pack: manifest taskIds do not match loaded tasks');
    }

    for (const required of requiredAllowContext) {
      if (!pack.agentContext.allow.includes(required)) {
        errors.push(
          `/ai/evals/test-pack: missing required agent context allow entry ${required}`,
        );
      }
    }

    for (const required of requiredDeniedContext) {
      if (!pack.agentContext.deny.includes(required)) {
        errors.push(
          `/ai/evals/test-pack: missing required denied answer-source entry ${required}`,
        );
      }
    }

    for (const entry of pack.agentContext.allow) {
      if (pack.agentContext.deny.includes(entry)) {
        errors.push(
          `/ai/evals/test-pack: context entry cannot be both allowed and denied: ${entry}`,
        );
      }
    }

    if (!setsEqual(pack.evaluationDimensions, requiredDimensions)) {
      errors.push(
        '/ai/evals/test-pack: evaluationDimensions must match the V1 evaluation rubric',
      );
    }
  }

  errors.sort((a, b) => a.localeCompare(b));
  return { valid: errors.length === 0, errors };
}
