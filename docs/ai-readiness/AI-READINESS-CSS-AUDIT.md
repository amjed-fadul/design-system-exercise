# AI Readiness CSS Audit

**Task:** AI Readiness Validation V1 — Task 1  
**Status:** COMPLETE — awaiting review before Task 2  
**Implementation baseline audited:** `f860c65345ef6ffab8f116fad803747acb64dd56`  
**Audit date:** 2026-09-19

## Purpose

This audit answers one question: when Storybook or the product prototypes use custom CSS, is the styling decision already governed, legitimately product-owned, missing machine-readable guidance, missing a reusable DS pattern/token, or unjustified?

No component API, token, pattern, or runtime implementation is changed in Task 1.

## Classification

- **Governed** — an existing DS component/token/rule already owns the decision.
- **Allowed composition** — the consuming product/story legitimately owns the decision.
- **Missing guidance** — the decision is valid, but the DS does not yet tell an AI how to make it.
- **Missing pattern/token** — a repeated/non-trivial decision should graduate into governed DS knowledge.
- **Unjustified** — no authority was found.

## Scope

Reviewed:

- Storybook global/foundation presentation CSS.
- Component-story canvas/fixture styling.
- `Patterns/Application Shell` fixture composition.
- `Connected Product Prototype` CSS/inline styling.
- `Projects Management Prototype` CSS/inline styling.
- RTL/directional-icon presentation behavior.
- Existing spacing, radius, layout, icon-size and elevation token sources.

The audit intentionally distinguishes Storybook evidence framing from product-authoring rules.

---

## A. Storybook evidence and documentation styling

### A1. Storybook shell and foundation visualizations

Files:

- `apps/storybook/src/styles.css`
- Foundation stories and `TokenTable`

Examples include Storybook canvas padding, token-table layout, swatches, token specimens, two-column documentation layout, elevation demonstrations and Docs Canvas background.

**Classification:** Allowed composition — documentation/evidence infrastructure.

**Reason:** These rules exist to display the design system itself. They are not product UI authoring rules and must not be treated as patterns an AI should copy into product code.

Where semantic colors/radii are relevant, the current implementation already uses DS variables. Raw specimen dimensions are acceptable because they are visualization scaffolding rather than product decisions.

### A2. Component-story canvas framing

Examples:

- Search Field evidence width: 360.
- Radio Group / Inline Feedback evidence width: 464.
- Dialog evidence height: 620.
- Sidebar evidence height: 640.
- Side Panel evidence heights/host widths: 612 / 640.
- Table evidence widths: 736 / 1168.
- generic 32px canvas padding/min-height values.
- Application Shell viewport fixtures: 1440, 960, 1200, 1199, 720 and 320.

**Classification:** Allowed composition — Storybook evidence harness.

**Reason:** These values create deterministic review/test canvases. They do not grant an AI authority to use those dimensions in product UI. Product authoring must derive dimensions from contracts/tokens/product requirements instead.

**AI implication:** Storybook framing must be explicitly excluded from future AI training/context as product layout guidance.

---

## B. Existing governance that custom Storybook/product code should use

These decisions already have DS authority. If an AI authors equivalent product code, raw values are not acceptable.

| Decision | Existing authority | Current audit result |
| --- | --- | --- |
| 20px governed icon size | `--dse-icons-size-md` | Governed |
| 12px reusable gap | `--dse-spacing-primitive-space-300` | Governed |
| 16px reusable gap | `--dse-spacing-semantic-gap-md` / space-400 as appropriate | Governed |
| 24px page-region separation | `--dse-layout-semantic-region-gap` | Governed |
| 32px page inset | layout page-inset token | Governed |
| 1440px wide viewport | layout primitive viewport-wide | Governed |
| 960px narrow viewport | layout primitive viewport-narrow | Governed |
| 1200px expanded-shell breakpoint | layout primitive breakpoint expanded-shell | Governed |
| 20px/24px icon geometry when it represents DS icon size | icon-size tokens | Governed |
| Sidebar footer label typography | semantic label-default typography | Governed |
| Sidebar footer secondary typography | semantic caption-default typography | Governed |
| 4px reusable stack gap | space-100 / semantic stack-sm when semantically appropriate | Governed |
| semantic foreground/background/border colors | color semantic tokens | Governed |
| ordinary surface/control radii | radius semantic tokens | Governed |

### Remaining evidence-fixture drift

`ApplicationShell.stories.tsx` still contains some raw values that already have governance, including raw 20px icon geometry, 16px/12px account gaps, 14px/12px footer font sizes, and 24px directory separation.

**Classification:** Governed.

**Task 1 action:** record only. Do not edit during the audit.

**AI implication:** a future authoring policy should reject equivalent raw product values when a matching governed token exists.

---

## C. Legitimate product-owned styling

### C1. Northstar brand composition

Repeated values include:

- 14px brand mark/name gap;
- 30×30 mark;
- 32px brand composition height;
- 6px mark radius;
- Latin `Northstar` text kept LTR.

**Classification:** Allowed composition.

**Authority:** Top Navbar explicitly gives the Brand slot to the product. These are Northstar brand decisions rather than generic Top Navbar decisions.

**AI rule required later:** an AI may use these only when supplied by product/brand evidence. It must not invent a 30px mark or 14px brand gap merely because the Storybook example has them.

### C2. Product content inside governed slots

Examples:

- Avatar + identity text inside Table Primary.
- owner identity composition;
- Side Panel header/body detail rows;
- save/guard explanatory copy;
- project/member display content;
- local product icon asset masks while the rendered icon size remains governed.

**Classification:** Allowed composition.

**Reason:** Table, Side Panel, Top Navbar and Sidebar intentionally expose product-owned content slots. The DS governs the container/semantics; the product governs the content composition.

### C3. Micro-gaps with no current matching token

Examples include local 2px identity/footer gaps.

**Classification:** Allowed composition for current product evidence.

**Reason:** the spacing scale starts at 4px. A 2px value should not cause a new token merely because it exists once.

**AI rule required later:** local values below/outside the scale require explicit product/Figma authority.

---

## D. Missing machine-readable guidance

These are valid decisions, but today an AI has to infer them from finished code.

### D1. Directory controls / toolbar composition

Repeated in Application Shell evidence and both product directories:

- Search at logical inline-start.
- Result summary at logical inline-end.
- Horizontal flex layout in wide presentation.
- Search field constrained to 360px.
- Approximate 20px inter-control gap.
- Directory/table region separated by the governed region gap.
- Toolbar stacks vertically below the expanded-shell boundary.
- Result count may wrap in the constrained layout.
- Table wrapper owns horizontal overflow at constrained widths.

**Classification:** Missing guidance, with strong evidence for a future reusable Directory composition/pattern.

**Why this matters:** Claude can select `SearchField` and `Table`, but the current contracts do not tell it how to arrange them.

### D2. Mixed-direction product data

Repeated behavior:

- email addresses remain LTR inside Arabic UI;
- project keys remain LTR;
- project keys use bidi isolation and remain at logical start;
- directional UI layout still follows surrounding RTL.

**Classification:** Missing guidance.

**Why this matters:** component RTL support alone does not tell an AI which product strings should retain intrinsic/LTR direction.

### D3. Directional icons

Current Storybook/product behavior marks directional icons and flips them in RTL.

**Classification:** Missing guidance.

**Why this matters:** the icon-size system exists, but there is no machine-readable distinction between directional icons (chevrons/arrows) and non-directional icons (close, search, avatar, etc.). An AI must currently infer which assets should mirror.

### D4. Product-local dimensions versus arbitrary dimensions

Examples include the 360px search width and product-specific brand dimensions.

**Classification:** Missing guidance.

**Why this matters:** the DS currently does not provide an explicit authoring rule explaining when a local Figma/product dimension is legal and when a raw value is an unsupported invention.

---

## E. Missing reusable pattern knowledge

### E1. Modal detail host around Side Panel — strongest gap

Both product prototypes use the same non-trivial host behavior around the governed `SidePanel`:

- overlay/backdrop outside the panel;
- backdrop starts below the persistent Top Navbar;
- host fills remaining viewport block size;
- background shell becomes inert/hidden from assistive technology;
- focus moves into detail;
- Tab focus is contained;
- Escape closes detail;
- focus returns to the row action;
- Side Panel fills host height;
- outer logical-end panel radii are flattened to meet the viewport edge;
- overlay/detail width uses governed layout width;
- a local shadow is applied because no governed shadow token currently exists.

The Side Panel contract explicitly says these responsibilities belong to a containing pattern/workflow.

**Classification:** Missing pattern.

**Recommendation for later tasks:** capture this as a governed modal-detail/list-detail composition before considering any new Side Panel API. Do not move modal behavior into Side Panel itself.

### E2. Directory page composition

The same directory skeleton appears across Team and Projects:

1. Page Heading.
2. Search + summary toolbar.
3. Table or Empty State.
4. selected row associated with contextual detail.
5. create flow through Dialog.

**Classification:** Missing pattern/guidance.

**Recommendation for later tasks:** first express this as machine-readable composition guidance. Only introduce a reusable runtime pattern if blind-agent evidence proves guidance alone is insufficient.

---

## F. Raw shadows and elevation

The prototype modal detail host uses raw `drop-shadow(...rgba(...))` values.

Current elevation tokens encode plane numbers only; there is no governed shadow token.

**Classification:** Allowed composition today, but tied to the missing modal-detail pattern.

**Decision:** do not add a shadow token in Task 1. During blind-agent evaluation, determine whether the shadow needs explicit pattern guidance or a reusable elevation/shadow token.

---

## G. Responsive breakpoint expression

The prototype toolbar uses a raw `1199px` max-width media query corresponding to the governed 1200px expanded-shell breakpoint.

**Classification:** Governed decision expressed through implementation-local CSS + Missing guidance.

**Reason:** the breakpoint itself is governed. Standard CSS custom properties cannot directly replace media-query conditions in ordinary authoring, so the implementation may still require a literal/compiled value.

**AI implication:** an agent should derive this boundary from the governed breakpoint, never invent 1199 independently.

---

## H. Unjustified styling

**Finding: no styling decision was classified as clearly Unjustified.**

The problematic custom CSS is not random; it falls into one of three buckets:

1. Storybook-only evidence framing.
2. legitimate product-owned composition.
3. valid product/pattern behavior whose authority is not yet machine-readable.

This is important: the AI-readiness gap is primarily **missing knowledge/authority**, not poor implementation quality.

---

## Task 1 conclusion

The current DS is **not yet proven AI-ready**.

It is strong at component/API governance, tokens, package boundaries, accessibility and RTL component behavior. The custom-CSS audit shows that an AI would still need undocumented human judgment in four important areas:

1. **Directory composition** — search/summary/table/empty-state structure and responsive layout.
2. **Modal list-detail composition** — Side Panel host, modality, focus, overlay and restoration behavior.
3. **Mixed-direction content rules** — emails, project keys and similar intrinsic-LTR data inside RTL UI.
4. **Directional-icon rules** — which icons mirror and which do not.

A smaller issue also remains in Storybook evidence: some Application Shell fixture values are raw even though existing DS tokens already govern them. That is implementation drift, not a missing token.

## Task 1 gate

**PASS.**

Every audited custom styling family now has an explicit classification and authority/reason.

No new pattern, token or component API was introduced.

## Next step

Do not begin Task 2 until this audit is reviewed.

Task 2 should convert these findings into an explicit AI styling/authoring authority policy, without yet building new runtime patterns.
