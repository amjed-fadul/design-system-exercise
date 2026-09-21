# Team Management Blind Evaluation — Run 012

This branch is an isolated blind AI-readiness evaluation branch.

## Environment preflight

Before implementation, verify:

- repository remote points to `amjed-fadul/design-system-exercise`;
- current branch is `ai-eval/team-management-rerun-012`;
- this file and `TASK-PAYLOAD.json` exist;
- `packages/contracts/ai/evals/test-pack.json` exists;
- `packages/tokens/consumer-contract.json` exists.

If any check fails, stop and report an environment setup failure without modifying files.

## Blind run

1. Read `TASK-PAYLOAD.json` in this directory.
2. Read `packages/contracts/ai/evals/test-pack.json`.
3. Read the approved authoring policy, contracts, composition guidance, token sources, token consumer contract, and any approved product context referenced by `agentVisible.productContextIds`.
4. Read only canonical assets referenced by an approved product context.
5. Follow the pack's allow/deny boundaries exactly.
6. Do not read any full `*.task.json` evaluation file.
7. Do not inspect git history, PR diffs, other branches, tags, denied Storybook source, prototypes, or governed implementation source.
8. Work only inside:
   `apps/storybook/src/ai-readiness/evaluations/team-management/`

Do not ask for human corrections.

Verification commands may transitively compile/process denied source if the pack permits it. Denied source remains non-authoring context.

The baseline repository test suite includes the required runtime render smoke for blind evaluation components. Do not report completion or commit the final result unless the full permitted `pnpm test` passes, including that runtime smoke.

Use approved product context for Northstar-specific shell content/assets and use `packages/tokens/consumer-contract.json` for exact public CSS custom-property naming.

When authority does not resolve a production decision, record it as unresolved instead of guessing.
