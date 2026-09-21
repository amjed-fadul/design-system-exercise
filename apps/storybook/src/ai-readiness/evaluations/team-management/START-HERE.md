# Team Management Blind Evaluation — Run 011

This branch is an isolated blind AI-readiness evaluation branch.

## Environment preflight

Before implementation, verify:

- repository remote points to `amjed-fadul/design-system-exercise`;
- current branch is `ai-eval/team-management-rerun-011`;
- this file and `TASK-PAYLOAD.json` exist;
- `packages/contracts/ai/evals/test-pack.json` exists;
- `packages/tokens/consumer-contract.json` exists.

If any check fails, stop and report an environment setup failure without modifying files.

## Blind run

1. Read `TASK-PAYLOAD.json` in this directory.
2. Read `packages/contracts/ai/evals/test-pack.json`.
3. Read the canonical authoring policy, approved contracts/guidance, token sources, and token consumer contract allowed by the pack.
4. For every id in `agentVisible.productContextIds`, locate and read the matching approved file under:
   `packages/contracts/ai/product-contexts/*.context.json`
5. Read only the product-context assets referenced by that approved context under:
   `packages/contracts/ai/product-contexts/assets/*.svg`
6. Follow the pack's allow/deny boundaries exactly.
7. Do not read any full `*.task.json` evaluation file.
8. Do not inspect git history, PR diffs, other branches, tags, denied Storybook source, prototypes, or governed package implementation source.
9. Work only inside:
   `apps/storybook/src/ai-readiness/evaluations/team-management/`

Use approved product context as product-specific authority for shell slot content, asset choice, order, localized copy, and authorized local dimensions. Generic component/pattern contracts remain the API and behavioral authority.

Use `packages/tokens/consumer-contract.json` for exact public CSS custom-property naming.

Do not ask for human corrections.

Verification commands may transitively compile/process denied source if the test pack permits it. Denied source must still never be read or used as authoring context.

When authority does not resolve a production decision, follow the canonical unresolved-decision policy instead of guessing.
