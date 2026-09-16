# Implementation plans

The Foundations + Storybook milestone is complete. Component and pattern implementation now follows the approved contract-first architecture.

## Current planning set

Read in this order:

1. `2026-09-17-design-system-master-roadmap.md` — dependency order and acceptance gates for all 17 public components, 6 internal helpers, and 5 patterns.
2. `2026-09-17-design-system-progress.md` — authoritative execution/progress ledger.
3. `2026-09-16-button-react-implementation.md` — detailed C01 Button + contract infrastructure plan.
4. `2026-09-17-controls-components-implementation.md` — C02-C06 controls plus private input/radio helpers.
5. `2026-09-17-internal-contract-visibility-extension.md` — schema extension executed immediately before C04, when the first internal helper contract is introduced.
6. `2026-09-17-feedback-surfaces-components-implementation.md` — C07-C12.
7. `2026-09-17-structure-components-implementation.md` — C13-C17 plus private navigation/breadcrumb/table helpers.
8. `2026-09-17-patterns-implementation.md` — P01-P05.

Architecture/spec sources:

- `docs/superpowers/specs/2026-09-16-design-system-exercise-design.md`
- `docs/superpowers/specs/2026-09-17-component-contracts-design.md`

Execution rule: one public milestone per implementation branch/PR by default, fresh review between milestones, and no next milestone before the progress tracker records exact verification evidence for the current one.