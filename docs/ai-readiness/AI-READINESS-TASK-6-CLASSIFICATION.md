# AI Readiness Task 6 — Blind Run Classification

**Date:** 2026-09-19  
**Status:** COMPLETE  
**Scope:** Valid Task 5 blind runs only

## Runs included

- Run 002 — API Keys Management — `58b09882861596f328d20c7e8d726e6588fc71f8`
- Run 003 — Projects Directory — `ea7d5cce008d3402fbe7519a2007c3b6c8b7b908`
- Run 004 — Team Management — `7b55a739c6ff15c9c2a77d1d841aa90d581ed0eb`

Run 001 is excluded from scoring/classification because the coding-agent workspace did not contain the repository. No product implementation was generated.

## Classification taxonomy

Every actual failure must be classified as one of:

- Agent mistake
- Missing DS guidance
- Missing component capability
- Missing pattern
- Missing token
- Ambiguous contract

Expected escalations are not failures. In particular, all three runs correctly reported narrow contextual-detail behavior as unresolved instead of inventing a drawer, sheet, route, or other narrow model.

## Results matrix

| Run | Component selection | Invented API | Custom CSS | Raw values | Composition | Accessibility | RTL | Responsive | Visual fidelity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API Keys | PASS | PASS | PASS | PASS | PASS with ambiguity A1 | PASS | PASS | PASS | PASS* |
| Projects | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS* |
| Team | PASS | PASS | PASS | PASS | PASS with ambiguity A2 | PASS | PASS | PASS | PASS* |

`PASS*` means no visual-fidelity defect was identified from the available Storybook/browser evidence and governed composition review. There is no supplied pixel target for these blind tasks, so this is not a pixel-diff claim.

## Run 002 — API Keys Management

### PASS evidence

- Used governed Application Shell, Page Heading, Breadcrumbs, Search Field, Table, Empty State, Status Badge, Side Panel, Dialog, Text Field, Radio Group, Inline Feedback, Button and Avatar through public package boundaries.
- No invented public component API was found; the generated implementation typechecked.
- Local CSS was limited to product/composition wrappers and used governed tokens for product colors, spacing, typography, panel width, top offset, elevation and icon rendering.
- No authored raw product colors were found. Remaining dimensions were limited to fluid extents and the documented 1199px complement of the governed 1200px shell boundary.
- Directory, Create Flow and Modal List → Detail guidance were applied without replacing governed components.
- Detail host implements modal semantics, inert/aria-hidden background handling, focus entry/containment/restoration and nested Dialog precedence.
- API-key prefixes are isolated LTR inside surrounding RTL.
- Narrow contextual detail was explicitly escalated as unresolved.
- Independent capture found no denied-source or evaluator-only contamination.

### A1 — Evaluation-only generated prefix authority

**Observed:** successful in-memory creation assigns a deterministic display prefix such as `nsk_created_001`.

**Agent behavior:** the authoring report explicitly states that production prefix allocation/format is not defined by current authority and that the generated prefix is only local interactive evaluation evidence.

**Classification:** **Ambiguous contract**.

**Reason:** the approved authoring policy says unresolved decisions must not be guessed, but it does not explicitly distinguish a non-authoritative deterministic evaluation fixture from a product rule. The agent disclosed the unresolved production decision rather than hiding it, so this should not be scored as an agent mistake.

**Task 7 candidate:** clarify whether evaluation/demo fixture data may use deterministic placeholder values when the production value-generation rule is unresolved, and how such placeholders must be labeled.

## Run 003 — Projects Directory

### PASS evidence

- Used governed shell, heading, search, Table/Empty State, Side Panel, Dialog, form controls, feedback and confirmation components.
- No invented public component props/variants/states/events were found; source typechecked and focused/full Storybook verification passed according to run evidence.
- Local CSS remained composition/product-owned; governed values were tokenized.
- No raw product colors or unexplained fixed product layout dimensions were found.
- Approved Directory, Create Flow and Modal List → Detail composition rules were followed.
- Row actions are record-specific; modal host owns detail modality while Side Panel remains non-modal.
- Project keys use intrinsic LTR direction with isolation inside RTL presentation.
- Directory compact behavior uses the governed shell boundary.
- Narrow contextual detail was explicitly escalated rather than invented.
- Project-key format, owner assignment and backend persistence were recorded as unresolved instead of turned into production rules.
- Independent capture found no denied-source or evaluator-only contamination.

**Classification:** no Task 6 failure identified.

## Run 004 — Team Management

### PASS evidence

- Used governed shell, heading, directory, detail, form, feedback and Dialog components through public package boundaries.
- No invented public component API was found; implementation typechecked.
- Local CSS was product/composition-only and tokenized for governed visual/layout decisions.
- No raw product colors, unsupported search widths, custom component radii or local shadows were found.
- Directory and Modal List → Detail guidance were applied.
- Search/clear labels, record-specific detail actions, modal/focus behavior and unsaved-change confirmation were implemented.
- Email values use intrinsic LTR isolation within Arabic RTL while surrounding layouts remain logical.
- Compact directory is demonstrated with detail closed; unresolved narrow detail is explicitly escalated.
- Independent capture found no denied-source or evaluator-only contamination.

### A2 — Create Flow scope for invitations

**Observed:** the Team implementation cites `dse.composition.create-flow` as authority for the invitation Dialog workflow.

**Evaluator expectation:** the Team task's evaluator-only authority list names Directory and Modal List → Detail composition guidance, and says invitation should remain a product-owned short Dialog workflow.

**Canonical guidance:** Create Flow describes itself broadly as guidance for “a short creation workflow” using Dialog, form controls, product-owned validation/request state and success outcome. It does not say whether invitations are inside or outside its scope.

**Classification:** **Ambiguous contract**.

**Reason:** a reasonable blind agent can interpret “invite member” as creating an invitation/member record and apply Create Flow. The evaluator expected a narrower boundary that is not stated in the canonical guidance. The run should not be penalized for this mismatch.

**Task 7 candidate:** clarify Create Flow applicability with explicit in-scope/out-of-scope examples, especially invite/add-member workflows.

## Cross-run findings

### What worked consistently

Across all three valid blind runs:

- **0 observed invented public component APIs.**
- **0 observed raw product colors.**
- **0 observed custom replacements for governed components.**
- Governed directory composition generalized to a genuinely new API Keys domain.
- Modal List → Detail semantics generalized across Projects, Team and API Keys.
- Mixed-direction data was isolated without forcing surrounding UI direction.
- All three agents recognized and escalated the intentionally unresolved narrow-detail behavior.
- All three runs stayed inside isolated evaluation roots and passed post-push contamination checks.
- No missing component capability, missing pattern or missing token was proven by these runs.

### Proven system ambiguities

1. **A1 — Evaluation fixture vs production authority**
   - Classification: Ambiguous contract.
   - Surface: authoring policy / evaluation guidance.

2. **A2 — Create Flow applicability to invitations**
   - Classification: Ambiguous contract.
   - Surface: composition guidance.

These are the only Task 6 findings identified from the three valid blind runs.

## Task 6 conclusion

The blind runs did **not** prove a missing component, missing token, or missing runtime pattern.

They did prove two documentation/authority ambiguities that can cause different reasonable agents to make different choices while still following the available system.

Task 7 should make the smallest machine-readable guidance corrections for A1 and A2, update the human/Storybook evidence from those canonical sources, and rerun only the affected blind cases required to prove the ambiguity is resolved.
