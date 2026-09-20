# Team Management Blind Evaluation — Run 010

This branch is an isolated blind AI-readiness evaluation branch.

## Environment preflight

Before implementation, verify:

- repository remote points to `amjed-fadul/design-system-exercise`;
- current branch is `ai-eval/team-management-rerun-010`;
- this file and `TASK-PAYLOAD.json` exist;
- `packages/contracts/ai/evals/test-pack.json` exists;
- `packages/tokens/consumer-contract.json` exists.

If any check fails, stop and report an environment setup failure without modifying files.

## Blind run

1. Read `TASK-PAYLOAD.json` in this directory.
2. Read `packages/contracts/ai/evals/test-pack.json`.
3. Follow the pack's allowed/denied repository context exactly.
4. Do not read any full `*.task.json` evaluation files.
5. Do not inspect git history, PR diffs, other branches, tags, denied Storybook source, or governed package implementation source.
6. Work only inside:
   `apps/storybook/src/ai-readiness/evaluations/team-management/`

You may reread/edit files created inside this directory during the run.

Use the token consumer contract for exact public CSS custom-property naming. Do not infer CSS variable names from mode names or denied generator implementation.

Do not ask for human corrections.

Verification commands may transitively compile/process denied source if the test pack permits it. Denied source must still never be read or used as authoring context.

When authority does not resolve a production decision, follow the canonical unresolved-decision policy instead of guessing.
