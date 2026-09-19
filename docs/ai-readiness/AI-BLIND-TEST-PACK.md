# AI Readiness Blind Test Pack V1

Task 4 prepares the blind authoring pack that Task 5 will run with Claude.

## Canonical sources

- Pack protocol: `packages/contracts/ai/evals/test-pack.json`
- Projects task: `packages/contracts/ai/evals/projects-directory.task.json`
- Team task: `packages/contracts/ai/evals/team-management.task.json`
- Generalization task: `packages/contracts/ai/evals/api-keys-management.task.json`

The pack and all three tasks are currently **draft** pending Task 4 review.

## Blind protocol

Every run must use:

- a fresh agent session;
- a fresh worktree;
- no reuse of code/output from another evaluation run;
- generated files inside the current task's own `writeRoot` may be reread and edited during that run;
- only the task's `agentVisible` data plus the shared allowed repository context;
- no `evaluatorOnly` data in the prompt;
- no repository history, PR diffs, other branches or tags to recover the old answer;
- no external answer lookup;
- no human correction during the run.

The generated implementation must stay inside that task's isolated Storybook evaluation directory.

## Agent-visible context

Claude may read only:

- the test-pack manifest;
- the approved AI authoring policy;
- approved composition guidance;
- public component contracts;
- pattern contracts;
- governed token sources;
- package manifests needed to identify public packages/exports.

Existing answer/evidence source is not agent context. The denylist explicitly includes current prototypes, pattern/component Storybook implementations, governed package source, and human AI-readiness docs.

## Task 1 — Projects Directory

Type: **baseline-known**.

Tests whether the agent can reconstruct the Projects experience from the governed system and product brief without reading the existing Projects prototype.

Key product needs include directory/search, create project, contextual detail/editing, recoverable failure feedback and archive confirmation.

Expected unresolved decision: current approved guidance does not define narrow contextual detail, so the agent should report that gap instead of inventing a drawer/sheet/full-page model.

## Task 2 — Team Management

Type: **baseline-known**.

Tests the same governed system in the Team & access domain: search members/invitations, invite a member, edit a role and guard unsaved changes.

The existing Connected Product prototype is denied to the agent.

Expected unresolved decision: narrow contextual member detail remains unresolved.

## Task 3 — API Keys Management

Type: **generalization**.

This screen does not already exist in the repository. It tests whether the agent can transfer approved Directory, Modal List → Detail and Create Flow guidance into a new product domain.

The product brief covers searching API keys, creating a named key with a scope, inspecting metadata and revoking a key with confirmation.

The evaluation intentionally does not require revealing or copying a real secret value.

Expected unresolved decision: narrow contextual API-key detail remains unresolved.

## Evaluation dimensions

Every task is evaluated on the same nine dimensions:

1. component selection;
2. invented API;
3. custom CSS;
4. raw values;
5. composition;
6. accessibility;
7. RTL;
8. responsive behavior;
9. visual fidelity.

The task JSON stores expected authorities and detailed checks under `evaluatorOnly`. That section is for human/evaluator use and must never enter the Claude prompt.

## Storybook

Storybook exposes **AI Readiness → Blind Test Pack** for human review of the protocol and task definitions.

During Task 5, generated results may be mounted under each task's isolated `AI Readiness/Evaluations/...` story after generation. Existing Storybook source remains outside the agent's allowed context.

## Scope boundary

Task 4 creates and validates the test pack only.

It does **not** run Claude, generate evaluation implementations, classify failures or change the design system in response to results. Those belong to Tasks 5–7.
