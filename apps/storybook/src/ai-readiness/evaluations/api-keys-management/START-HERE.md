# API Keys Blind Evaluation — Run 006

This branch is an isolated blind AI-readiness evaluation branch.

## Environment preflight

Before implementation, verify:

- repository remote points to `amjed-fadul/design-system-exercise`;
- current branch is `ai-eval/api-keys-rerun-006`;
- this file and `TASK-PAYLOAD.json` exist;
- `packages/contracts/ai/evals/test-pack.json` exists.

If any check fails, stop and report an environment setup failure without modifying files.

## Blind run

1. Read `TASK-PAYLOAD.json` in this directory.
2. Read `packages/contracts/ai/evals/test-pack.json`.
3. Follow the pack's allowed/denied repository context exactly.
4. Do not read any full `*.task.json` evaluation files.
5. Do not inspect git history, PR diffs, other branches, tags, denied Storybook source, or governed package implementation source.
6. Work only inside:
   `apps/storybook/src/ai-readiness/evaluations/api-keys-management/`

You may reread/edit files created inside this directory during the run.

Do not ask for human corrections. If approved authority does not resolve a production decision, follow the canonical authoring policy for unresolved decisions and evaluation-only evidence.
