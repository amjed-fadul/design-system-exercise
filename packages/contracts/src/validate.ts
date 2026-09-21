import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv, { type AnySchema, type ErrorObject, type ValidateFunction } from 'ajv';
import { validateAiEvalRepository } from './ai-eval.js';
import {
  loadAuthoringPolicies,
  loadComponentContracts,
  loadCompositionGuidance,
  loadPatternContracts,
  loadProductContexts,
} from './load.js';
import type {
  AiAuthoringPolicy,
  ComponentContract,
  CompositionGuidance,
  PatternContract,
  ProductContext,
  ValidationResult,
} from './types.js';

function readJson(url: URL): AnySchema {
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as AnySchema;
}

const ajv = new Ajv({ allErrors: true, strict: true });
const componentSchema = readJson(new URL('../schema/component-contract.schema.json', import.meta.url));
const patternSchema = readJson(new URL('../schema/pattern-contract.schema.json', import.meta.url));
const authoringPolicySchema = readJson(
  new URL('../schema/ai-authoring-policy.schema.json', import.meta.url),
);
const compositionGuidanceSchema = readJson(
  new URL('../schema/composition-guidance.schema.json', import.meta.url),
);
const productContextSchema = readJson(
  new URL('../schema/product-context.schema.json', import.meta.url),
);

const componentValidator = ajv.compile(componentSchema);
const patternValidator = ajv.compile(patternSchema);
const authoringPolicyValidator = ajv.compile(authoringPolicySchema);
const compositionGuidanceValidator = ajv.compile(compositionGuidanceSchema);
const productContextValidator = ajv.compile(productContextSchema);

const publicComponentId = /^dse\.(?!_)[a-z0-9.-]+$/;
const internalComponentId = /^dse\._[a-z0-9.-]+$/;

const requiredAuthoringRuleIds = [
  'components.use-governed',
  'components.no-invented-props',
  'tokens.use-governed',
  'tokens.no-raw-colors',
  'css.local-only-with-authority',
  'dimensions.require-authority',
  'composition.use-product-context',
  'composition.no-storybook-inference',
  'composition.repeated-rule-escalates',
  'direction.use-logical-layout',
  'direction.intrinsic-content-only',
  'icons.mirror-only-when-directional',
  'accessibility.preserve-governed-semantics',
  'storybook.evidence-not-authority',
  'uncertainty.evaluation-placeholder',
  'uncertainty.do-not-guess',
] as const;

const requiredCompositionIds = [
  'dse.composition.directory-page',
  'dse.composition.modal-list-detail',
  'dse.composition.create-flow',
] as const;

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  return (errors ?? [])
    .map((error) => `${error.instancePath || '/'}: ${error.message ?? 'invalid value'}`)
    .sort((a, b) => a.localeCompare(b));
}

function runValidator(validator: ValidateFunction, candidate: unknown): ValidationResult {
  const valid = validator(candidate) as boolean;
  return {
    valid,
    errors: valid ? [] : formatErrors(validator.errors),
  };
}

export function validateComponent(candidate: unknown): ValidationResult {
  const schemaResult = runValidator(componentValidator, candidate);
  if (!schemaResult.valid) return schemaResult;

  const contract = candidate as ComponentContract;
  const errors: string[] = [];

  if (contract.visibility === 'public' && !publicComponentId.test(contract.id)) {
    errors.push('/id: public component contract ids must match dse.<name> and must not begin dse._');
  }

  if (contract.visibility === 'internal' && !internalComponentId.test(contract.id)) {
    errors.push('/id: internal component contract ids must begin dse._');
  }

  if (contract.visibility === 'internal' && contract.sources.implementationPackage) {
    errors.push('/sources/implementationPackage: internal component contracts cannot declare a public implementation package');
  }

  errors.sort((a, b) => a.localeCompare(b));
  return { valid: errors.length === 0, errors };
}

export function validatePattern(candidate: unknown): ValidationResult {
  return runValidator(patternValidator, candidate);
}

export function validateAuthoringPolicy(candidate: unknown): ValidationResult {
  const schemaResult = runValidator(authoringPolicyValidator, candidate);
  if (!schemaResult.valid) return schemaResult;

  const policy = candidate as AiAuthoringPolicy;
  const errors: string[] = [];
  const seenRuleIds = new Set<string>();

  for (const rule of policy.rules) {
    if (seenRuleIds.has(rule.id)) {
      errors.push(`/rules: duplicate AI authoring rule id ${rule.id}`);
    }
    seenRuleIds.add(rule.id);
  }

  for (const requiredId of requiredAuthoringRuleIds) {
    if (!seenRuleIds.has(requiredId)) {
      errors.push(`/rules: missing required AI authoring rule ${requiredId}`);
    }
  }

  errors.sort((a, b) => a.localeCompare(b));
  return { valid: errors.length === 0, errors };
}

export function validateProductContext(candidate: unknown): ValidationResult {
  const schemaResult = runValidator(productContextValidator, candidate);
  if (!schemaResult.valid) return schemaResult;

  const context = candidate as ProductContext;
  const errors: string[] = [];
  const assetIds = new Set<string>();
  const referencedAssets = new Set<string>();

  for (const asset of context.assets) {
    if (assetIds.has(asset.id)) {
      errors.push(`/assets: duplicate product-context asset id ${asset.id}`);
    }
    assetIds.add(asset.id);
  }

  const composition = context.composition as {
    topNavbar?: { appearanceUtility?: { assetId?: string } };
    sidebar?: { destinations?: Array<{ assetId?: string }> };
  };
  const appearanceAsset = composition.topNavbar?.appearanceUtility?.assetId;
  if (appearanceAsset) referencedAssets.add(appearanceAsset);
  for (const destination of composition.sidebar?.destinations ?? []) {
    if (destination.assetId) referencedAssets.add(destination.assetId);
  }

  for (const assetId of referencedAssets) {
    if (!assetIds.has(assetId)) {
      errors.push(`/composition: unresolved product-context asset ${assetId}`);
    }
  }

  errors.sort((a, b) => a.localeCompare(b));
  return { valid: errors.length === 0, errors };
}

export function validateCompositionGuidance(candidate: unknown): ValidationResult {
  const schemaResult = runValidator(compositionGuidanceValidator, candidate);
  if (!schemaResult.valid) return schemaResult;

  const guidance = candidate as CompositionGuidance;
  const errors: string[] = [];
  const structureKeys = new Set<string>();
  const structureOrders = new Set<number>();
  const componentDependencyIds = new Set<string>();
  const patternDependencyIds = new Set<string>();
  const ruleIds = new Set<string>();

  for (const dependency of guidance.componentDependencies) {
    if (componentDependencyIds.has(dependency.id)) {
      errors.push(`/componentDependencies: duplicate dependency id ${dependency.id}`);
    }
    componentDependencyIds.add(dependency.id);
  }

  for (const dependency of guidance.patternDependencies) {
    if (patternDependencyIds.has(dependency.id)) {
      errors.push(`/patternDependencies: duplicate dependency id ${dependency.id}`);
    }
    patternDependencyIds.add(dependency.id);
  }

  for (const region of guidance.structure) {
    if (structureKeys.has(region.key)) {
      errors.push(`/structure: duplicate structure key ${region.key}`);
    }
    structureKeys.add(region.key);

    if (structureOrders.has(region.order)) {
      errors.push(`/structure: duplicate structure order ${region.order}`);
    }
    structureOrders.add(region.order);

    for (const componentId of region.componentIds ?? []) {
      if (!componentDependencyIds.has(componentId)) {
        errors.push(
          `/structure/${region.key}: component ${componentId} must be declared in componentDependencies`,
        );
      }
    }

    for (const patternId of region.patternIds ?? []) {
      if (!patternDependencyIds.has(patternId)) {
        errors.push(
          `/structure/${region.key}: pattern ${patternId} must be declared in patternDependencies`,
        );
      }
    }
  }

  const ruleGroups = [
    guidance.rules.layout,
    guidance.rules.responsive,
    guidance.rules.direction,
    guidance.rules.accessibility,
    guidance.rules.behavior,
    guidance.localCss.allowed,
  ];

  for (const group of ruleGroups) {
    for (const rule of group) {
      if (ruleIds.has(rule.id)) {
        errors.push(`/rules: duplicate composition rule id ${rule.id}`);
      }
      ruleIds.add(rule.id);
    }
  }

  errors.sort((a, b) => a.localeCompare(b));
  return { valid: errors.length === 0, errors };
}

export function satisfiesMinimumVersion(actual: string, minimum: string): boolean {
  const actualParts = actual.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);

  for (let index = 0; index < 3; index += 1) {
    const actualPart = actualParts[index] ?? 0;
    const minimumPart = minimumParts[index] ?? 0;
    if (actualPart > minimumPart) return true;
    if (actualPart < minimumPart) return false;
  }

  return true;
}

export interface RepositoryValidationResult extends ValidationResult {
  componentCount: number;
  patternCount: number;
}

export function validateRepositoryContracts(): RepositoryValidationResult {
  const components = loadComponentContracts();
  const patterns = loadPatternContracts();
  const authoringPolicies = loadAuthoringPolicies();
  const compositions = loadCompositionGuidance();
  const productContexts = loadProductContexts();

  const errors: string[] = [];
  const seenIds = new Map<string, string>();
  const seenVersions = new Map<string, string>();
  const publicComponentVersions = new Map<string, string>();
  const patternVersions = new Map<string, string>();
  const compositionIds = new Set<string>();
  const productContextIds = new Set<string>();

  const recordIdentity = (id: string, version: string, path: string) => {
    const existingId = seenIds.get(id);
    if (existingId) errors.push(`${path}: /id: duplicate contract id ${id}; first seen in ${existingId}`);
    else seenIds.set(id, path);

    const versionKey = `${id}@${version}`;
    const existingVersion = seenVersions.get(versionKey);
    if (existingVersion) {
      errors.push(`${path}: /version: duplicate contract version ${versionKey}; first seen in ${existingVersion}`);
    } else {
      seenVersions.set(versionKey, path);
    }
  };

  for (const loaded of components) {
    const result = validateComponent(loaded.contract);
    for (const error of result.errors) errors.push(`${loaded.path}: ${error}`);
    if (!result.valid) continue;

    const contract = loaded.contract as ComponentContract;
    for (const token of contract.tokenDependencies) {
      if (!token.startsWith('--dse-')) {
        errors.push(`${loaded.path}: /tokenDependencies: token dependency must start with --dse-: ${token}`);
      }
    }
    if (contract.visibility === 'public') {
      publicComponentVersions.set(contract.id, contract.version);
    }
    recordIdentity(contract.id, contract.version, loaded.path);
  }

  for (const loaded of patterns) {
    const result = validatePattern(loaded.contract);
    for (const error of result.errors) errors.push(`${loaded.path}: ${error}`);
    if (!result.valid) continue;

    const contract = loaded.contract as PatternContract;
    patternVersions.set(contract.id, contract.version);
    recordIdentity(contract.id, contract.version, loaded.path);

    for (const dependency of contract.componentDependencies) {
      const actualVersion = publicComponentVersions.get(dependency.id);
      if (!actualVersion) {
        errors.push(
          loaded.path +
            ': /componentDependencies: unresolved public component contract ' +
            dependency.id,
        );
        continue;
      }

      if (
        dependency.minimumVersion &&
        !satisfiesMinimumVersion(actualVersion, dependency.minimumVersion)
      ) {
        errors.push(
          loaded.path +
            ': /componentDependencies: ' +
            dependency.id +
            ' requires >= ' +
            dependency.minimumVersion +
            ', found ' +
            actualVersion,
        );
      }
    }
  }

  if (authoringPolicies.length !== 1) {
    errors.push(
      `${resolve(fileURLToPath(new URL('../ai/', import.meta.url)))}: expected exactly 1 AI authoring policy, found ${authoringPolicies.length}`,
    );
  }

  for (const loaded of authoringPolicies) {
    const result = validateAuthoringPolicy(loaded.contract);
    for (const error of result.errors) errors.push(`${loaded.path}: ${error}`);
    if (!result.valid) continue;

    const policy = loaded.contract as AiAuthoringPolicy;
    recordIdentity(policy.id, policy.version, loaded.path);
  }

  for (const loaded of compositions) {
    const result = validateCompositionGuidance(loaded.contract);
    for (const error of result.errors) errors.push(`${loaded.path}: ${error}`);
    if (!result.valid) continue;

    const guidance = loaded.contract as CompositionGuidance;
    compositionIds.add(guidance.id);
    recordIdentity(guidance.id, guidance.version, loaded.path);

    for (const dependency of guidance.componentDependencies) {
      const actualVersion = publicComponentVersions.get(dependency.id);
      if (!actualVersion) {
        errors.push(
          loaded.path +
            ': /componentDependencies: unresolved public component contract ' +
            dependency.id,
        );
        continue;
      }

      if (
        dependency.minimumVersion &&
        !satisfiesMinimumVersion(actualVersion, dependency.minimumVersion)
      ) {
        errors.push(
          loaded.path +
            ': /componentDependencies: ' +
            dependency.id +
            ' requires >= ' +
            dependency.minimumVersion +
            ', found ' +
            actualVersion,
        );
      }
    }

    for (const dependency of guidance.patternDependencies) {
      const actualVersion = patternVersions.get(dependency.id);
      if (!actualVersion) {
        errors.push(
          loaded.path +
            ': /patternDependencies: unresolved pattern contract ' +
            dependency.id,
        );
        continue;
      }

      if (
        dependency.minimumVersion &&
        !satisfiesMinimumVersion(actualVersion, dependency.minimumVersion)
      ) {
        errors.push(
          loaded.path +
            ': /patternDependencies: ' +
            dependency.id +
            ' requires >= ' +
            dependency.minimumVersion +
            ', found ' +
            actualVersion,
        );
      }
    }
  }

  for (const loaded of productContexts) {
    const result = validateProductContext(loaded.contract);
    for (const error of result.errors) errors.push(`${loaded.path}: ${error}`);
    if (!result.valid) continue;

    const context = loaded.contract as ProductContext;
    productContextIds.add(context.id);
    recordIdentity(context.id, context.version, loaded.path);

    const patternVersion = patternVersions.get(context.patternId);
    if (!patternVersion) {
      errors.push(`${loaded.path}: /patternId: unresolved pattern ${context.patternId}`);
    }

    for (const componentId of context.componentDependencies) {
      if (!publicComponentVersions.has(componentId)) {
        errors.push(`${loaded.path}: /componentDependencies: unresolved public component ${componentId}`);
      }
    }
  }

  for (const requiredId of requiredCompositionIds) {
    if (!compositionIds.has(requiredId)) {
      errors.push(
        `${resolve(fileURLToPath(new URL('../ai/compositions/', import.meta.url)))}: missing required Task 3 composition guidance ${requiredId}`,
      );
    }
  }

  const aiEvalResult = validateAiEvalRepository();
  for (const error of aiEvalResult.errors) {
    errors.push(`AI eval: ${error}`);
  }

  errors.sort((a, b) => a.localeCompare(b));
  return {
    valid: errors.length === 0,
    errors,
    componentCount: components.length,
    patternCount: patterns.length,
  };
}

function isCliEntry(): boolean {
  if (!process.argv[1]) return false;
  return pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
}

if (isCliEntry()) {
  const result = validateRepositoryContracts();
  if (!result.valid) {
    for (const error of result.errors) console.error(error);
    process.exitCode = 1;
  } else {
    console.log(
      `Validated ${result.componentCount} component contract${result.componentCount === 1 ? '' : 's'} and ${result.patternCount} pattern contract${result.patternCount === 1 ? '' : 's'} plus the AI authoring policy, product contexts, Task 3 composition guidance, and Task 4 blind test pack`,
    );
  }
}
