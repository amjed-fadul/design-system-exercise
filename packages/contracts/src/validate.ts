import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv, { type AnySchema, type ErrorObject, type ValidateFunction } from 'ajv';
import { loadComponentContracts, loadPatternContracts } from './load.js';
import type { ComponentContract, PatternContract, ValidationResult } from './types.js';

function readJson(url: URL): AnySchema {
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as AnySchema;
}

const ajv = new Ajv({ allErrors: true, strict: true });
const componentSchema = readJson(new URL('../schema/component-contract.schema.json', import.meta.url));
const patternSchema = readJson(new URL('../schema/pattern-contract.schema.json', import.meta.url));
const componentValidator = ajv.compile(componentSchema);
const patternValidator = ajv.compile(patternSchema);
const publicComponentId = /^dse\.(?!_)[a-z0-9.-]+$/;
const internalComponentId = /^dse\._[a-z0-9.-]+$/;

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
  const errors: string[] = [];
  const seenIds = new Map<string, string>();
  const seenVersions = new Map<string, string>();
  const publicComponentVersions = new Map<string, string>();

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
