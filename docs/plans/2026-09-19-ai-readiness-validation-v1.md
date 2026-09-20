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

## Task 4 — Create an AI test pack — COMPLETE

Created a validated blind authoring pack with two baseline-known cases and one genuine generalization case:

1. **Projects Directory** — baseline-known; existing Projects implementation is denied.
2. **Team Management** — baseline-known; existing Connected Product implementation is denied.
3. **API Keys Management** — generalization; this product screen does not already exist in the repo.

Canonical artifacts:

- `packages/contracts/ai/evals/test-pack.json`
- `packages/contracts/ai/evals/projects-directory.task.json`
- `packages/contracts/ai/evals/team-management.task.json`
- `packages/contracts/ai/evals/api-keys-management.task.json`

Supporting artifacts:

- task schema: `packages/contracts/schema/ai-blind-authoring-task.schema.json`
- pack schema: `packages/contracts/schema/ai-test-pack.schema.json`
- human guide: `docs/ai-readiness/AI-BLIND-TEST-PACK.md`
- Storybook: **AI Readiness → Blind Test Pack**

Blind protocol now requires:

- fresh agent session per task;
- fresh worktree per task;
- no cross-run output reuse;
- only canonical allowed repository context;
- current task-generated files may be reread/edited only inside that task's own `writeRoot`;
- no repository history/PR/branch/tag answer recovery;
- no external answer lookup;
- no human correction during the run;
- full `*.task.json` records remain evaluator-owned and denied to Claude;
- Claude receives only the safe `agentVisible` projection generated by `buildAgentTaskPayload()`;
- `evaluatorOnly` expectations never enter the agent payload.

Agent context includes the approved authoring policy, approved composition guidance, component/pattern contracts, governed token sources, and public package manifests. Existing prototypes, Storybook answer source, governed package implementation source, AI-readiness human docs, and full task files are denied.

Every task uses the same nine evaluation dimensions:

- component selection;
- invented API;
- custom CSS;
- raw values;
- composition;
- accessibility;
- RTL;
- responsive behavior;
- visual fidelity.

Each task writes only to its isolated `apps/storybook/src/ai-readiness/evaluations/<task>/` directory and must produce an `AUTHORING-REPORT.md` explaining local CSS/raw dimensions and unresolved decisions.

Repository validation protects:

- exactly one test pack;
- exactly three task IDs;
- exactly two baseline-known + one generalization case;
- unique task write roots and Storybook titles;
- required allow/deny context boundaries;
- all nine evaluation dimensions;
- approved evaluator component/pattern/composition authorities;
- safe agent payload projection with no evaluator-only leakage.

**Implementation HEAD:** `e956ab04e1873cafa0f101b7ec03605214b297c1`  
**CI:** run **546 — PASS** on that exact implementation HEAD.

Passed gates:

- frozen install;
- contracts validation including Task 4 blind-pack checks;
- tokens validation/build;
- React build;
- full tests;
- TypeScript typecheck;
- Storybook production build;
- packed-package verification.

**Gate:** PASS.

**Review status:** approved by user. The test pack and all three tasks are `approved`.

## Task 5 — Run blind coding-agent evaluations — COMPLETE

Run one task at a time without correcting the agent during generation.

**Run 001 — API Keys Management:** INVALID — workspace not mounted; no score. See `docs/ai-readiness/runs/2026-09-19-api-keys-run-001.md`.\n\n**Run 002 — API Keys Management:** COMPLETED — UNCLASSIFIED at `58b09882861596f328d20c7e8d726e6588fc71f8`. Evidence captured in `docs/ai-readiness/runs/2026-09-19-api-keys-run-002.md`.\n\n**Run 003 — Projects Directory:** COMPLETED — UNCLASSIFIED at `ea7d5cce008d3402fbe7519a2007c3b6c8b7b908`. Evidence captured in `docs/ai-readiness/runs/2026-09-19-projects-run-003.md`.\n\n**Run 004 — Team Management:** COMPLETED — captured at `7b55a739c6ff15c9c2a77d1d841aa90d581ed0eb`. Evidence captured in `docs/ai-readiness/runs/2026-09-19-team-run-004.md`.

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

## Task 6 — Classify failures — COMPLETE

Classification record:

`docs/ai-readiness/AI-READINESS-TASK-6-CLASSIFICATION.md`

Valid blind runs:

- API Keys Management — `58b09882861596f328d20c7e8d726e6588fc71f8`
- Projects Directory — `ea7d5cce008d3402fbe7519a2007c3b6c8b7b908`
- Team Management — `7b55a739c6ff15c9c2a77d1d841aa90d581ed0eb`

Run 001 was excluded because the repository was not mounted; no implementation was produced.

Task 6 found no proven missing component capability, missing runtime pattern, or missing token.

Two system ambiguities were proven:

1. evaluation-only deterministic fixture values versus the policy's do-not-guess rule;
2. Create Flow scope for invite/add-member workflows.

Both are classified as **Ambiguous contract**, not agent mistakes.

**Gate:** PASS. Every actual finding has a classification and no design-system change has been made yet.

## Task 7 — Fix only proven DS gaps — COMPLETE

For system-caused failures, make the smallest correction: contract clarification, usage guidance, composition rule, token, or pattern.

Task 6 proved exactly two ambiguities and no missing component/token/runtime pattern:

1. **A1 — evaluation fixture values vs do-not-guess policy**
   - Added canonical rule `uncertainty.evaluation-placeholder`.
   - Deterministic evaluation/demo placeholders are allowed only as explicitly labeled non-production evidence when production generation/allocation remains unresolved.
   - The placeholder must not assert a production format, allocation rule, or reusable product behavior.

2. **A2 — Create Flow scope for invitations**
   - Added `behavior.scope-boundary` to approved Create Flow guidance.
   - Create Flow applies when the primary outcome is creation of the first-class product entity/record.
   - Invite/invitation, add-member, and access-grant workflows remain product-owned Dialog workflows unless separate approved guidance explicitly includes them.

Supporting changes:

- authoring-policy validator now requires `uncertainty.evaluation-placeholder`;
- human AI Authoring Rules guidance updated;
- human AI Composition Guidance updated;
- Storybook AI Readiness evidence continues to render canonical JSON directly, so no duplicated Storybook rule source was added.

TDD evidence:

- CI run **565**: RED — exactly 2 new missing-rule tests failed.
- CI run **568**: RED — validator-removal test failed because the new policy rule was not yet required.
- CI run **570**: GREEN on exact implementation HEAD `4f51b6a40bdc81161b5f065eb2f01d3e325595a2`.

Run 005 — API Keys rerun: **COMPLETED** at `1f9bb1bd232626a95e573035d64a6a0b20c70d48`. A1 is resolved. The run proved a new A3 contract gap: Application Shell exists at runtime but its approved pattern contract did not expose the consumer export/props required by a blind agent.

A3 is classified as an **Ambiguous/incomplete contract**, not an agent mistake. The Application Shell contract now includes structured pattern `publicApi` metadata matching the runtime export and props. CI run 574 passed on exact fix HEAD `f66213e74cb3e77a1db5b960e504f0475dc9f1c4`.

Run 006 — API Keys rerun: **COMPLETED** at `65cfefdd99e67b7d5847c027890133eb949bf9ed`.

Results:

- A1 evaluation-placeholder ambiguity: RESOLVED.
- A3 Application Shell consumer API: RESOLVED.
- A4 token mode activation: new missing token consumer guidance proven and fixed.
- A5 modal host stacking: new missing composition guidance proven and fixed.
- A6 Storybook package authority: incomplete evaluation context proven and fixed.
- A7 verification boundary: ambiguous evaluation protocol proven and fixed.
- M1 `font-weight: 700` brand styling: agent mistake; no DS fix.

Run 007 was invalidated before agent execution because it used an older baseline. Run 008 is COMPLETED at `0de8fbd33733940eff0148726f2798ba95b03561`. It proves A1/A3/A5/A6/A7 resolved and the A4 machine authority available. One remaining defect, failure to apply `data-language`, is classified as agent mistake M2; no DS fix is justified. Team Management is now the active rerun for A2.

Run 009 — Team Management rerun: **COMPLETED** at `fd87e55a2d79a8f99c30bf68e88ac192ed6de705`.

Result:

- A2 Create Flow invitation boundary: RESOLVED.
- Invitation remains a product-owned short Dialog workflow.
- No new missing component, pattern, token, or composition guidance was proven.
- Narrow contextual detail remains the expected unresolved escalation.

**Task 7 gate: PASS.** All system-caused gaps discovered by the blind evaluations have been corrected and re-proven. Remaining agent-authored defects are carried into Task 8 rather than prompting further DS changes.

Add a component/API only when evidence genuinely requires it.

After each fix:

- update the machine-readable source first;
- update/regenerate corresponding Storybook evidence;
- rerun only the affected blind task.

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

Tasks are sequential. Tasks 1–7 are complete. Task 8 is next. API Keys and Team reruns proved all system-caused Task 7 gaps resolved. Agent mistakes remain evidence for Task 8 and must not trigger further DS changes.
