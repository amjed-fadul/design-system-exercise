import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import { loadComponentContracts, loadPatternContracts } from './load.js';
import type { ComponentContract, PatternContract, ValidationResult } from './types.js';

function readJson(url: URL): unknown {
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as unknown;
}

const ajv = new Ajv({ allErrors: true, strict: true });
const componentSchema = readJson(new URL('../schema/component-contract.schema.json', import.meta.url));
const patternSchema = readJson(new URL('../schema/pattern-contract.schema.json', import.meta.url));
const componentValidator = ajv.compile(componentSchema);
const patternValidator = ajv.compile(patternSchema);

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
  return runValidator(componentValidator, candidate);
}

export function validatePattern(candidate: unknown): ValidationResult {
  return runValidator(patternValidator, candidate);
}

export interface RepositoryValidationResult extends ValidationResult {
  componentCount: number;
  patternCount: number;
}

export function validateRepositoryContracts(): RepositoryValidationResult {
  const components = loadComponentContracts();
  const patterns = loadPatternContracts();
  const errors: string[] = [];
  const seenIds = new Map<string, string>();
  const seenVersions = new Map<string, string>();
  const componentIds = new Set<string>();

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
    if (contract.id.startsWith('dse._')) {
      errors.push(`${loaded.path}: /id: internal component contracts are not enabled in schema v1`);
    }
    for (const token of contract.tokenDependencies) {
      if (!token.startsWith('--dse-')) {
        errors.push(`${loaded.path}: /tokenDependencies: public token dependency must start with --dse-: ${token}`);
      }
    }
    componentIds.add(contract.id);
    recordIdentity(contract.id, contract.version, loaded.path);
  }

  for (const loaded of patterns) {
    const result = validatePattern(loaded.contract);
    for (const error of result.errors) errors.push(`${loaded.path}: ${error}`);
    if (!result.valid) continue;

    const contract = loaded.contract as PatternContract;
    recordIdentity(contract.id, contract.version, loaded.path);
    for (const dependency of contract.componentDependencies) {
      if (!componentIds.has(dependency.id)) {
        errors.push(`${loaded.path}: /componentDependencies: unresolved component contract ${dependency.id}`);
      }
    }
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
      `Validated ${result.componentCount} component contract${result.componentCount === 1 ? '' : 's'} and ${result.patternCount} pattern contract${result.patternCount === 1 ? '' : 's'}`,
    );
  }
}
