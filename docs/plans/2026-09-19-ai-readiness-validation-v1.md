# AI Readiness Validation V1

**Status:** ACTIVE  
**Branch:** `feat/storybook-prototypes`  
**Started:** 2026-09-19

## Goal

Prove whether the Design System can guide an AI agent to build correct product UI without relying on hidden human judgment, copying finished prototype code, inventing component APIs, or guessing styling rules.

The current repository proves a strong governed implementation baseline. This plan tests whether that baseline is sufficiently explicit for an AI agent to author new UI correctly.

## Storybook role in this plan

Storybook is the **human-visible evidence and review surface**, not the source of truth for AI authoring.

The source of truth remains machine-readable contracts, tokens, authoring policy, and composition guidance. Storybook should render or explain that governed knowledge so designers/developers can inspect it without creating a second independent rule set.

### Storybook workstream

- **Task 1:** audit Storybook/prototype CSS and distinguish evidence-only framing from real product/composition decisions.
- **Task 2:** add a human-readable **AI Authoring Rules** Storybook docs surface derived from the approved machine-readable authoring policy. Do not manually duplicate policy text if it can be rendered from source data.
- **Task 3:** add Storybook evidence for approved composition guidance such as Directory, List → Detail, and Create flow. Clearly label whether each example is guidance-only or a real reusable runtime pattern.
- **Tasks 4–5:** use Storybook only as a rendering/evaluation harness for blind AI outputs. Finished prototype source, existing answer CSS, and approved example implementation must not be exposed to the agent during blind generation.
- **Task 6:** attach failure evidence to concrete Storybook stories/screens where useful, while keeping the failure classification in the AI-readiness record.
- **Task 7:** when a proven DS gap is fixed, update Storybook evidence so the visible examples remain synchronized with contracts/policy/guidance.
- **Task 8:** final Storybook evidence must demonstrate the approved AI-authoring rules and final governed compositions across relevant Light/Dark, English/Arabic, RTL/LTR, and wide/narrow states.

### Storybook cleanup required by the audit

Before final AI-readiness sign-off:

- replace Storybook fixture values with governed tokens where the audit found an existing token already owns the decision;
- preserve raw values only when they are clearly Storybook evidence-frame dimensions or explicitly product-owned composition values;
- label evidence-frame dimensions so they cannot be mistaken for product authoring guidance;
- avoid encoding new AI rules only in Storybook JSX/CSS.

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

**Review status:** reviewed by user; Task 2 authorized.

## Task 2 — Define AI styling authority — COMPLETE

Created a canonical, machine-readable AI authoring policy and wired it into repository validation and Storybook evidence.

Outputs:

- `packages/contracts/ai/authoring-policy.json` — canonical approved policy;
- `packages/contracts/schema/ai-authoring-policy.schema.json` — validation schema;
- `docs/ai-readiness/AI-AUTHORING-RULES.md` — human-readable usage guidance;
- `AI Readiness/Authoring Rules` in Storybook — human-visible rendering directly backed by the canonical JSON.

The policy now defines:

- governed component/pattern selection;
- no invented component APIs;
- token authority and raw-color restrictions;
- allowed product-local CSS authority;
- raw-dimension authority;
- Storybook/prototype non-authority for product composition;
- repeated-composition escalation;
- logical RTL/LTR layout;
- intrinsic mixed-direction content;
- directional-icon mirroring authority;
- accessibility preservation;
- explicit do-not-guess behavior.

Validation protects the policy schema, exactly one canonical policy file, unique rule IDs, and the required Task 2 rule set.

**Implementation HEAD:** `1623cdfb462ac600ef2db340a9ee609e781bc5fa`  
**CI:** run **509 — PASS** on that exact implementation HEAD.

Passed gates:

- frozen install;
- contracts validation including the AI policy;
- tokens validation/build;
- React build;
- full tests;
- TypeScript typecheck;
- Storybook production build;
- packed-package verification.

**Gate:** PASS.

**Review status:** approved by user. The canonical policy is `approved`.

## Task 3 — Capture composition knowledge — COMPLETE

Created validated, machine-readable composition guidance for the three gaps identified by Task 1:

1. **Directory Page** — Page Heading → search/result-summary controls → Table or Empty State.
2. **Modal List → Detail** — Table action → composition-owned modal host → governed Side Panel → optional nested Dialog.
3. **Create Flow** — Button trigger → governed Dialog → governed form controls → optional Inline Feedback → Dialog actions.

Canonical records:

- `packages/contracts/ai/compositions/directory-page.guidance.json`
- `packages/contracts/ai/compositions/modal-list-detail.guidance.json`
- `packages/contracts/ai/compositions/create-flow.guidance.json`

Supporting artifacts:

- schema: `packages/contracts/schema/composition-guidance.schema.json`
- human guidance: `docs/ai-readiness/AI-COMPOSITION-GUIDANCE.md`
- Storybook: **AI Readiness → Composition Guidance**

Each record captures:

- governed component/pattern dependencies and minimum versions;
- ordered structural regions;
- explicit ownership: `design-system`, `composition`, `product`, or `workflow`;
- layout rules;
- responsive rules;
- RTL/LTR and mixed-direction rules;
- accessibility/focus rules;
- product/workflow behavior ownership;
- allowed local CSS authority;
- forbidden alternatives;
- evidence/provenance.

Important boundary decisions:

- the records are **guidance-only** and create no public React API/runtime pattern;
- the modal List → Detail host owns modality/focus/background behavior while Side Panel stays non-modal;
- narrow-screen List → Detail remains explicitly **unresolved** rather than inventing a drawer/full-page/sheet behavior;
- deterministic prototype fail-then-retry behavior is explicitly non-authoritative.

Repository validation now protects schema validity, unique structure/rule IDs, dependency declarations, real public component/pattern resolution, minimum versions, and presence of all three required Task 3 records.

**Implementation HEAD:** `cbad5637165415f2170abf261ab4f1096aad8590`  
**CI:** run **525 — PASS** on that exact implementation HEAD.

Passed gates:

- frozen install;
- contracts validation including Task 3 guidance;
- tokens validation/build;
- React build;
- full tests;
- TypeScript typecheck;
- Storybook production build;
- packed-package verification.

**Gate:** PASS.

**Review status:** approved by user. All three composition guidance records are `approved`.

## Task 4 — Create an AI test pack — ACTIVE

Prepare 2–3 blind authoring tasks. The agent receives tokens, contracts, approved guidance/patterns, the authoring policy, and product requirements.

The agent must not receive:

- finished prototype implementation/CSS;
- answer code;
- Storybook example source that would reveal the target composition.

Suggested cases:

1. Projects directory.
2. Team management.
3. A new screen not already implemented, to test generalization.

Storybook may host the generated result for review only after generation.

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

Render the completed blind output in an isolated Storybook evaluation story when useful, but do not feed existing Storybook answer code to the agent.

## Task 6 — Classify failures — NOT STARTED

Every failure must be classified as:

- Agent mistake;
- Missing DS guidance;
- Missing component capability;
- Missing pattern;
- Missing token;
- Ambiguous contract.

Do not change the DS merely because the agent made a mistake.

Use Storybook story IDs/screenshots as supporting evidence where they make the failure concrete.

## Task 7 — Fix only proven DS gaps — NOT STARTED

For system-caused failures, make the smallest correction: contract clarification, usage guidance, composition rule, token, or pattern.

Add a component/API only when evidence genuinely requires it.

After each fix:

- update the machine-readable source first;
- update/regenerate corresponding Storybook evidence;
- rerun the same blind task.

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
- acceptable visual/layout fidelity against the supplied requirement;
- Storybook evidence is synchronized with the final machine-readable contracts/policy/guidance and does not contain contradictory authoring rules.

## Execution rule

Tasks are sequential. Tasks 1–3 are complete and approved. Task 4 is active. Do not begin Task 5 until Task 4 is complete and reviewed.
