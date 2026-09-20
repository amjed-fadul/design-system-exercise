import { describe, expect, it } from 'vitest';
import {
  loadAiEvalTasks,
  loadAiTestPacks,
} from '../src/load.js';
import {
  buildAgentTaskPayload,
  validateAiBlindTask,
  validateAiEvalRepository,
  validateAiTestPack,
} from '../src/ai-eval.js';
import type {
  AiBlindAuthoringTask,
  AiTestPack,
} from '../src/types.js';

const tasks = loadAiEvalTasks().map(
  (entry) => entry.contract as AiBlindAuthoringTask,
);
const pack = loadAiTestPacks()[0]!.contract as AiTestPack;

describe('Task 4 blind AI test pack', () => {
  it('validates the canonical pack and all three tasks', () => {
    expect(validateAiTestPack(pack)).toEqual({
      valid: true,
      errors: [],
    });

    for (const task of tasks) {
      expect(validateAiBlindTask(task), task.id).toEqual({
        valid: true,
        errors: [],
      });
    }

    expect(validateAiEvalRepository()).toEqual({
      valid: true,
      errors: [],
    });
  });

  it('contains two baseline cases and one unseen-domain generalization case', () => {
    expect(tasks.map((task) => [task.id, task.caseType])).toEqual([
      ['dse.ai-eval.api-keys-management', 'generalization'],
      ['dse.ai-eval.projects-directory', 'baseline-known'],
      ['dse.ai-eval.team-management', 'baseline-known'],
    ]);
  });

  it('builds an agent payload without evaluator-only data', () => {
    for (const task of tasks) {
      const payload = buildAgentTaskPayload(task);
      const serialized = JSON.stringify(payload);

      expect(Object.keys(payload)).toEqual([
        'id',
        'name',
        'caseType',
        'agentVisible',
      ]);
      expect(serialized).not.toContain('evaluatorOnly');

      for (const signal of task.evaluatorOnly.contaminationSignals) {
        expect(serialized, `${task.id} leaked evaluator signal: ${signal}`).not.toContain(
          signal,
        );
      }
    }
  });

  it('keeps prior implementation and DS source outside agent context', () => {
    expect(pack.agentContext.allow).toContain(
      'packages/contracts/ai/evals/test-pack.json',
    );
    expect(pack.agentContext.allow).toContain(
      'packages/contracts/ai/authoring-policy.json',
    );
    expect(pack.agentContext.allow).toContain(
      'packages/contracts/ai/compositions/*.guidance.json',
    );
    expect(pack.agentContext.allow).toContain('package.json');
    expect(pack.agentContext.allow).toContain('apps/storybook/package.json');
    expect(pack.agentContext.allow).toContain(
      'packages/tokens/consumer-contract.json',
    );

    for (const denied of [
      'packages/contracts/ai/evals/*.task.json',
      'apps/storybook/src/prototypes/**',
      'apps/storybook/src/patterns/**',
      'apps/storybook/src/components/**',
      'packages/react/src/**',
      'packages/patterns/src/**',
      'docs/ai-readiness/**',
      'apps/storybook/src/ai-readiness/BlindTestPack.stories.tsx',
    ]) {
      expect(pack.agentContext.deny).toContain(denied);
    }
  });

  it('keeps Team product-fidelity requirements agent-visible', () => {
    const team = tasks.find((task) => task.id === 'dse.ai-eval.team-management');
    expect(team).toBeDefined();
    const requirement = JSON.stringify(team?.agentVisible.productRequirement);

    for (const expected of [
      'Overview',
      'Projects',
      'Team & access',
      'Settings',
      'Northstar workspace',
      'Signed in as Admin',
      'Amal Hassan · Admin',
      'Workspace / Team & access',
      'Team members',
      'amal@example.com',
      'leila@example.com',
      'daniel@example.com',
      'jamal@example.com',
      'maya@example.com',
      'Current saved role',
      'Use the workspace without managing people.',
      'Invite people and manage members and roles.',
      'Changes take effect only after you save.',
      'Close',
      'Save changes',
      '360 CSS px',
    ]) {
      expect(requirement).toContain(expected);
    }
  });

  it('isolates each task into a unique evaluation write root and fresh run', () => {
    expect(new Set(tasks.map((task) => task.agentVisible.deliverable.writeRoot)).size).toBe(3);
    expect(pack.blindProtocol).toMatchObject({
      freshSessionPerTask: true,
      freshWorktreePerTask: true,
      agentReceivesOnlyAgentVisibleTaskData: true,
      neverExposeEvaluatorOnly: true,
      noCrossRunReuse: true,
      generatedOutputReadableWithinTask: true,
      noRepositoryHistoryForAnswers: true,
      noExternalAnswerLookup: true,
      noHumanCorrectionDuringRun: true,
      verificationCommandsMayTransitivelyProcessDeniedSource: true,
      deniedSourceRemainsNonAuthoringContextDuringVerification: true,
    });
  });
});
