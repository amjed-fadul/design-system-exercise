# AI Readiness Validation V1

**Status:** ACTIVE  
**Branch:** `feat/storybook-prototypes`  
**Started:** 2026-09-19

## Goal

Prove whether the Design System can guide an AI agent to build correct product UI without relying on hidden human judgment, copying finished prototype code, inventing component APIs, or guessing styling rules.

The current repository proves a strong governed implementation baseline. This plan tests whether that baseline is sufficiently explicit for an AI agent to author new UI correctly.

## Task 1 — Custom CSS audit — COMPLETE

Audit Storybook-owned CSS and inline Storybook/prototype layout styling.

Classify each authored styling decision as one of:

1. **Governed** — an existing DS component/token/rule already owns the decision and should be used.
2. **Allowed composition** — product/story composition legitimately owns the decision.
3. **Missing guidance** — the decision is valid, but an AI currently has no explicit rule telling it what to do.
4. **Missing pattern/token** — a repeated decision should become governed DS knowledge.
5. **Unjustified** — arbitrary styling with no authority; remove or replace it.

Output: `docs/ai-readiness/AI-READINESS-CSS-AUDIT.md`.

**Gate:** PASS. Every audited custom styling family has an explicit authority/reason. No patterns, tokens, or component APIs were added.

**Review status:** awaiting review before Task 2.

## Task 2 — Define AI styling authority — NOT STARTED

Create a compact machine-readable authoring policy that tells an agent what it may and may not invent.

Minimum policy:

- use governed components whenever one exists;
- never invent component props;
- use governed semantic tokens where available;
- raw colors are forbidden;
- local layout CSS is allowed only for product/composition ownership;
- local dimensions require explicit product/Figma evidence or documented composition authority;
- repeated composition rules must graduate into DS guidance/patterns.

Expected output: a machine-readable policy plus human-readable guidance.

## Task 3 — Capture composition knowledge — NOT STARTED

Document the missing composition knowledge exposed by the prototypes, starting only with compositions already evidenced in the repo.

Initial targets:

- Directory page: Page Heading → controls/summary → Table or Empty State.
- List → Detail: selected Table row → modal host → Side Panel → focus/background behavior.
- Create flow: Dialog → form fields → feedback → actions.

For each capture components, order, ownership, layout rules, responsive behavior, allowed local CSS, and forbidden alternatives.

Do not add public React APIs unless Task 1/2 evidence proves they are needed.

## Task 4 — Create an AI test pack — NOT STARTED

Prepare 2–3 blind authoring tasks. The agent receives tokens, contracts, approved guidance/patterns, the authoring policy, and product requirements.

The agent must not receive finished prototype implementation/CSS or answer code.

Suggested cases:

1. Projects directory.
2. Team management.
3. A new screen not already implemented, to test generalization.

## Task 5 — Run Claude blind — NOT STARTED

Run one task at a time without correcting the agent during generation.

Capture:

- component selection;
- invented APIs;
- custom CSS;
- raw values;
- composition correctness;
- accessibility;
- RTL;
- responsive behavior;
- visual fidelity.

## Task 6 — Classify failures — NOT STARTED

Every failure must be classified as:

- Agent mistake;
- Missing DS guidance;
- Missing component capability;
- Missing pattern;
- Missing token;
- Ambiguous contract.

Do not change the DS merely because the agent made a mistake.

## Task 7 — Fix only proven DS gaps — NOT STARTED

For system-caused failures, make the smallest correction: contract clarification, usage guidance, composition rule, token, or pattern.

Add a component/API only when evidence genuinely requires it.

Then rerun the same blind task.

## Task 8 — AI Readiness V1 gate — NOT STARTED

AI Readiness V1 passes only when the blind test screens satisfy all of the following:

- 0 invented component APIs;
- 0 forbidden raw colors;
- 0 replacement of governed components with custom substitutes;
- no Critical accessibility failures;
- correct RTL structure;
- correct governed component composition;
- custom CSS only where policy explicitly allows it;
- no unexplained hard-coded styling;
- acceptable visual/layout fidelity against the supplied requirement.

## Execution rule

Tasks are sequential. Task 1 is complete and must be reviewed before Task 2 begins.
