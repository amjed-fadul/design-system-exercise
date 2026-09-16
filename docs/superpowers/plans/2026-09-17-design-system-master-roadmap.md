# Design System Components + Patterns Master Implementation Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this roadmap milestone-by-milestone. Each milestone gets its own focused implementation plan, fresh review, and verification gate before the next milestone begins.

**Goal:** Implement every governed public component and product pattern in the Design System Exercise, with machine-readable contracts, React/Pattern package code, Storybook documentation, Figma parity evidence, and deterministic CI validation.

**Architecture:** The repository remains a pnpm monorepo with `@design-system-exercise/tokens` as foundation source, private `@design-system-exercise/contracts` as the legal machine boundary, `@design-system-exercise/react` as the public component package, `@design-system-exercise/patterns` as the composed pattern package, and Storybook as the documentation/parity surface. Every public component or pattern is contract-first. Internal underscore helpers may receive internal contracts when needed by a parent milestone, but they are never exported as public API by default.

**Tech Stack:** Node 24.21.0, pnpm 12.4.2, TypeScript 7.0.2, React 19.3.0 development runtime with React 18.3+ peer support, plain CSS custom properties, Vitest 5, Testing Library, jsdom, Storybook 10.6, Ajv 8, GitHub Actions.

**Specs:**
- `docs/superpowers/specs/2026-09-16-design-system-exercise-design.md`
- `docs/superpowers/specs/2026-09-17-component-contracts-design.md`
- Figma file `tYCXBBYoQ92AUKVbND5WkG`
- AI knowledge pack frame `3024:9796`

## Global Constraints

- Foundations baseline is the verified 223-public-token milestone at commit `751ce383f392b24b8db0495fe221facf0a6eb4f6`.
- The current Figma file contains 247 local variables across 15 collections; Figma and public code token counts are intentionally not 1:1 because internal/helper variables are excluded from public code API.
- Every public component gets one validated `dse.<name>` component contract before its production implementation is accepted.
- Every product pattern gets one validated `dse.pattern.<name>` pattern contract before pattern implementation is accepted.
- Contracts are deterministic/offline governance input. No LLM or network call runs in validation/build paths.
- A valid contract defines supported capability; it does not prove visual parity, runtime correctness, accessibility conformance, or product behavior.
- Figma representation properties do not automatically become React props.
- Browser interaction states such as hover/active/focus-visible remain derived runtime states unless the contract explicitly exposes a semantic state.
- Internal helpers remain private. A contract for an underscore-prefixed helper does not make it public.
- No public component may depend on Figma-only collections `Button / Internal`, `Component / Icon Render`, or `Component / Layout` as public token inputs.
- Components consume only public foundation/semantic tokens from `@design-system-exercise/tokens` plus component-local private CSS decisions.
- Light/Dark and English/Arabic/RTL remain inherited mode/context dimensions, not per-component theme/language props.
- Patterns compose components from `@design-system-exercise/react`; they do not recreate lower-level primitives.
- Pattern state may coordinate query, selection, draft, request state, intended exit, and recovery. Product code still owns real data, permissions, policy, backend operations, and authoritative outcomes.
- Each milestone uses TDD: failing focused test -> minimal implementation -> focused pass -> relevant full suite -> Storybook/manual parity -> fresh reviewer -> commit.
- Do not merge `main`, publish npm packages, or start the next milestone without explicit user direction.

---

## Verified Figma inventory

### Public components — 17

| # | Component | Figma source | Planned contract | Internal dependency bundled here |
| --- | --- | --- | --- | --- |
| C01 | Button | `93:1230` | `dse.button` | `_Button / Busy indicator` remains implementation-private |
| C02 | Icon Button | `110:1339` | `dse.icon-button` | — |
| C03 | Link | `114:13` | `dse.link` | — |
| C04 | Text Field | `112:263` | `dse.text-field` | `_Input Control` `111:22` |
| C05 | Search Field | `112:1710` | `dse.search-field` | reuses `_Input Control` from C04 |
| C06 | Radio Group | `116:175` | `dse.radio-group` | `_Radio Option` `116:174` |
| C07 | Inline Feedback | `127:30` | `dse.inline-feedback` | — |
| C08 | Avatar | `128:14` | `dse.avatar` | — |
| C09 | Status Badge | `128:1821` | `dse.status-badge` | — |
| C10 | Dialog | `133:6` | `dse.dialog` | — |
| C11 | Side Panel | `137:2` | `dse.side-panel` | — |
| C12 | Empty State | `131:2` | `dse.empty-state` | — |
| C13 | Sidebar | `146:166` | `dse.sidebar` | `_Navigation Item` `143:2948` |
| C14 | Top Navbar | `228:18954` | `dse.top-navbar` | — |
| C15 | Breadcrumbs | `139:20` | `dse.breadcrumbs` | `_Breadcrumb Link Item` `139:16` |
| C16 | Page Heading | `142:2488` | `dse.page-heading` | reuses Breadcrumbs |
| C17 | Table | `152:3730` | `dse.table` | `_Table Header` `152:3685`, `_Table Row` `152:3729` |

### Internal helpers — 6 governed implementation units

| Helper | Figma source | Planned visibility | First milestone that may create its contract/code |
| --- | --- | --- | --- |
| `_Input Control` | `111:22` | internal only | C04 Text Field |
| `_Radio Option` | `116:174` | internal only | C06 Radio Group |
| `_Navigation Item` | `143:2948` | internal only | C13 Sidebar |
| `_Breadcrumb Link Item` | `139:16` | internal only | C15 Breadcrumbs |
| `_Table Header` | `152:3685` | internal only | C17 Table |
| `_Table Row` | `152:3729` | internal only | C17 Table |

`_Button / Busy indicator` (`93:24`) remains a Button implementation detail and does not get an independent consumer-facing contract.

### Product patterns — 5

| # | Pattern | Figma guide | Planned contract |
| --- | --- | --- | --- |
| P01 | Application Shell | `68:494` | `dse.pattern.application-shell` |
| P02 | Form Submit and Recover | `68:2` | `dse.pattern.form-submit-recover` |
| P03 | Unsaved-change Guard | `68:371` | `dse.pattern.unsaved-change-guard` |
| P04 | Edit, Save and Recover | `68:240` | `dse.pattern.edit-save-recover` |
| P05 | Search, List and Detail | `68:121` | `dse.pattern.search-list-detail` |

---

## Dependency order

```text
Foundations + contracts infrastructure
  |
  +-- C01 Button
  +-- C02 Icon Button
  +-- C03 Link
  +-- C04 _Input Control + Text Field
  |     \-- C05 Search Field
  +-- C06 _Radio Option + Radio Group
  +-- C07 Inline Feedback
  +-- C08 Avatar
  +-- C09 Status Badge
  +-- C10 Dialog
  +-- C11 Side Panel
  +-- C12 Empty State
  +-- C13 _Navigation Item + Sidebar
  +-- C14 Top Navbar
  +-- C15 _Breadcrumb Link Item + Breadcrumbs
  |     \-- C16 Page Heading
  +-- C17 _Table Header + _Table Row + Table

All public components complete
  |
  +-- P01 Application Shell
  +-- P02 Form Submit and Recover
  +-- P03 Unsaved-change Guard
  |     \-- P04 Edit, Save and Recover
  |              \-- P05 Search, List and Detail
  \------------------------------^ uses Application Shell context
```

This order is about implementation safety, not visual importance. Independent leaf components can be executed in another order only when their declared dependencies are already complete and the progress tracker is updated first.

---

## Standard component milestone contract-first cycle

Every C01-C17 milestone follows the same acceptance shape. The component-specific sub-plan must spell out the actual live Figma properties, runtime mapping, files, and tests; it may not simply say “same as previous component.”

1. **Re-read live Figma source** using the exact canonical node ID and capture current property definitions before writing code.
2. **Author/validate contract** in `packages/contracts/components/<name>.contract.json`.
3. **Add internal contract only if needed** for the parent implementation; prefix ID with `dse._` and mark internal visibility.
4. **Write failing contract parity tests** for legal public values, forbidden Figma-only controls, native semantics, and declared token dependencies.
5. **Implement React API** in `packages/react/src/<name>/` using native semantics where available.
6. **Implement token-driven CSS** with logical properties and no public raw foundation values.
7. **Add focused behavior/accessibility tests** for keyboard/native/ARIA behavior that belongs to the component boundary.
8. **Add Storybook stories** with controls derived from contract legal values, plus Light/Dark × English/Arabic parity stories.
9. **Build/package smoke test** through the public package export and stylesheet.
10. **Fresh review** must report no unresolved Critical/Important findings before milestone completion.
11. **Update `2026-09-17-design-system-progress.md`** with exact commit/test/review evidence before the next milestone starts.

### Standard component file shape

```text
packages/contracts/components/<name>.contract.json
packages/contracts/tests/<name>.contract.test.ts
packages/react/src/<name>/<Component>.tsx
packages/react/src/<name>/<Component>.css
packages/react/src/<name>/<Component>.test.tsx
apps/storybook/src/components/<Component>.stories.tsx
```

Internal helper code stays under its parent feature area or `packages/react/src/internal/`; it is not exported from `packages/react/src/index.ts`.

---

## Standard pattern milestone contract-first cycle

Every P01-P05 milestone follows this acceptance shape.

1. Re-read the canonical pattern guide and current AI knowledge guidance.
2. Author `packages/contracts/patterns/<name>.contract.json` with declared component dependencies, state model, transitions, invariants, exits, responsive/runtime requirements, and forbidden inventions.
3. Validate every referenced component contract ID/version before pattern code is accepted.
4. Write failing pattern contract tests for state ownership and invariants.
5. Implement the smallest reusable pattern boundary in `packages/patterns/src/<name>/` without moving product/backend authority into the design-system package.
6. Add deterministic Storybook/demo fixtures for success, failure, pending, empty, dirty, and responsive states that the pattern actually supports.
7. Add focused interaction tests and verify state survives the transitions required by the contract.
8. Verify Light/Dark, English/Arabic/RTL, and Wide/Narrow where the pattern contract declares them.
9. Fresh review + full package/repo verification before completing the milestone.

### Standard pattern file shape

```text
packages/contracts/patterns/<name>.contract.json
packages/contracts/tests/<name>.contract.test.ts
packages/patterns/src/<name>/<Pattern>.tsx
packages/patterns/src/<name>/<Pattern>.test.tsx
packages/patterns/src/<name>/model.ts
apps/storybook/src/patterns/<Pattern>.stories.tsx
```

A milestone may use hooks/reducers instead of `model.ts` only when its dedicated plan names the exact alternative and tests the same contract invariants.

---

# Wave A — Contract infrastructure + action/navigation primitives

## C01 Button

Use existing detailed plan:
`docs/superpowers/plans/2026-09-16-button-react-implementation.md`

Figma contract facts include `emphasis=primary|secondary|text`, `tone=default|critical`, `state=default|hover|pressed|disabled|loading`, and `iconPosition=leading|trailing`. Public React API intentionally does not clone Figma `state`, `focusVisible`, or `showIcon`.

Completion unlocks: Dialog actions, Side Panel actions, Empty State actions, Page Heading actions, and all product patterns.

## C02 Icon Button

Source `110:1339`. Contract must distinguish public `accessibleLabel`/icon/disabled semantics from Figma-only hover/pressed/focus representation. No loading contract exists in the live Figma source. Storybook must include close and clear-search examples with distinct accessible names.

Completion unlocks: Search Field clear affordance, Dialog close, Side Panel close, shell utilities.

## C03 Link

Source `114:13`. Implement a semantic anchor/navigation API; hover/focus/pressed are derived browser states. Do not invent disabled or visited variants because the live source does not expose them. Storybook must prove native `href` behavior and RTL-safe text layout.

Completion unlocks: Breadcrumb item semantics and route-oriented examples.

---

# Wave B — Inputs and selection

## C04 `_Input Control` + Text Field

Sources `_Input Control` `111:22`, Text Field `112:263`.

Create internal contract `dse._input-control` only because two public fields depend on the shared visual/interaction shell. Keep it absent from the public React barrel. Text Field public contract must map native value/placeholder/required/disabled/invalid semantics while treating Figma `content=empty|filled` and hover/focus representations as derived rendering facts rather than consumer state controls.

The runtime API must support controlled/uncontrolled native input behavior without inventing a product validation engine. `aria-invalid` and described-by relationships belong to the component boundary; validation rules and request submission do not.

## C05 Search Field

Source `112:1710`; reuses the internal input shell from C04 and Icon Button from C02 for the clear affordance when present.

Contract must require an accessible search name, native text-input behavior, optional controlled value, and a clear event. Figma `content=empty|filled` and pointer/focus states remain derived. Search results, debouncing policy, and result counting remain pattern/product concerns.

## C06 `_Radio Option` + Radio Group

Sources `_Radio Option` `116:174`, Radio Group `116:175`.

Create internal `dse._radio-option` contract and keep it private. Public Radio Group contract owns one-of-many semantics, group label/required relationship, value/change API, keyboard radio behavior, and option composition/cardinality. Do not expose Figma `selected` or `state` as public visual props when native/controlled selection can derive them.

---

# Wave C — Feedback, identity, surfaces

## C07 Inline Feedback

Source `127:30`. Public `intent=error|success` is legal because it is authored as semantic presentation, not product outcome inference. Contract must define title/message visibility and runtime announcement expectations without claiming that Figma proves screen-reader behavior. No warning/info/loading intent may be invented.

## C08 Avatar

Source `128:14`. Contract exposes `size=sm|lg` and supported initials/fallback content only. Do not invent photo, online, verified, selected-person, role, or status variants. Accessible treatment depends on whether the avatar is decorative beside visible identity text or meaningful standalone content; contract/stories must cover both rules explicitly.

## C09 Status Badge

Source `128:1821`. Contract exposes label/content only unless live source changes. Product values such as `Active` and `Invitation pending` are data, not variants. Badge remains non-interactive.

## C10 Dialog

Source `133:6`. Contract defines title/description/close affordance and Body/Actions composition slots. Runtime implementation must own dialog semantics, focus containment/restoration, Escape policy, and background inertness appropriate to a modal dialog. It must not own request status or submit business logic. Action children are composed public components, not Dialog variants.

## C11 Side Panel

Source `137:2`. Contract defines eyebrow/showClose/Header/Body/Actions composition. Side Panel itself does not establish modality. It must support the layout/scroll behavior defined by guidance while leaving modal wrapper vs dedicated page choice to patterns.

## C12 Empty State

Source `131:2`. Contract defines icon/title/body/actions composition. It represents genuinely absent content/results, not failure/loading. Actions are composed Buttons/Links; the component does not own recovery business logic.

---

# Wave D — Structure and data display

## C13 `_Navigation Item` + Sidebar

Sources `_Navigation Item` `143:2948`, Sidebar `146:166`.

Create internal `dse._navigation-item`. Internal item contract owns expanded/compact representation, current-route state, and native link/focus semantics. Sidebar public contract owns mode, Navigation slot, Footer slot, workspace label, and persistent navigation structure. Product route configuration remains consumer data.

## C14 Top Navbar

Source `228:18954`. Contract owns context label visibility, Brand/Account composition slots, and current supported ordering. Do not invent page-level Save/Invite actions into the navbar. Brand/account content remains supplied composition.

## C15 `_Breadcrumb Link Item` + Breadcrumbs

Sources `_Breadcrumb Link Item` `139:16`, Breadcrumbs `139:20`.

Create internal `dse._breadcrumb-link-item`. Breadcrumbs public contract owns ordered ancestors + current location semantics. Ancestor items use native links; current label is not interactive. Contract must require correct nav/breadcrumb semantics and accessible current-page treatment.

## C16 Page Heading

Source `142:2488`; depends on C15 Breadcrumbs and C01 Button/Link composition through Actions.

Contract owns title, optional description, Breadcrumbs slot, and Actions slot. It must not absorb global shell identity. Storybook covers with/without description, breadcrumbs, and actions across language/theme contexts.

## C17 `_Table Header` + `_Table Row` + Table

Sources `_Table Header` `152:3685`, `_Table Row` `152:3729`, Table `152:3730`.

Create internal contracts for header and row because the public Table composition depends on their exact anatomy. Public Table contract owns header/row/footer composition and semantic table structure. Row `state=hover|selected` must be mapped carefully: hover is derived, while selected may be public only if the runtime Table contract intentionally exposes selection. Do not invent sorting, pagination, bulk selection, query, or generic data-grid capabilities unless the live source/contract is deliberately extended first.

Completion of C17 closes the public component foundation and unlocks pattern implementation.

---

# Wave E — Product patterns

## P01 Application Shell

Source `68:494`. Dependencies: C13 Sidebar, C14 Top Navbar, C16 Page Heading; may host C17 Table/content regions.

Contract owns responsive shell composition and the 1200px expanded-navigation threshold already documented in the knowledge pack. It must preserve content/state across layout changes and use logical start/end placement. It must not own product data or route authorization.

## P02 Form Submit and Recover

Source `68:2`. Dependencies: C10 Dialog, C04 Text Field, C06 Radio Group, C01 Button, C07 Inline Feedback.

Contract state model includes draft field values, selected role, validation state, request state, and retained failure recovery. Validation failure does not send a request; known request failure preserves draft; retry reuses retained draft. Product code supplies the actual invitation operation and authoritative result.

## P03 Unsaved-change Guard

Source `68:371`. Dependencies: C10 Dialog, C01 Button.

Contract owns captured intended exit, dirty-state confirmation, Keep editing, Discard, and Escape behavior. Keep editing restores exact originating draft/context; Discard removes draft and follows the captured exit while preserving last confirmed saved data.

## P04 Edit, Save and Recover

Source `68:240`. Dependencies: C11 Side Panel, C06 Radio Group, C01 Button, C07 Inline Feedback, P03 guard; responsive presentation may use P01 shell context.

Contract keeps saved value and draft value separate, retains draft across known failure, commits only after success, and invokes guard for dirty/failed exits. Wide presentation may wrap Side Panel in modal behavior; narrow presentation is a dedicated page. Side Panel itself remains non-modal.

## P05 Search, List and Detail

Source `68:121`. Dependencies: C05 Search Field, C17 Table, C12 Empty State, C11 Side Panel, P04 edit flow, P03 guard, P01 shell.

Contract owns query, selected member, detail open/close state, saved/draft value continuity, and no-result recovery. Closing detail retains query. Clearing search restores full directory. The pattern must never encode product records, permissions, sorting, bulk actions, or backend policy as component variants.

P05 is the final integration milestone because it exercises the largest number of component and pattern contracts together.

---

## CI evolution

The permanent CI gate grows incrementally but must remain one deterministic chain:

```text
pnpm install --frozen-lockfile
pnpm contracts:validate
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
package-consumer smoke tests
```

As packages become real:

- pack/install `@design-system-exercise/tokens`;
- pack/install `@design-system-exercise/react` after C01;
- pack/install `@design-system-exercise/patterns` after P01;
- SSR/render one public export from each package in the clean consumer;
- verify public CSS exports resolve;
- contracts package remains private and is not npm-packed for consumers.

---

## Branch and PR strategy

- Planning lives on `plan/all-components-patterns`.
- Each implementation milestone gets its own branch from the latest accepted implementation base.
- One public component/pattern milestone per PR by default.
- Internal helper changes travel in the parent public milestone PR that first needs them.
- Do not create one giant PR for all 17 components or all 5 patterns.
- After a milestone merges, the next milestone rebases/branches from the accepted head according to the user's merge instructions.

Suggested branch names:

```text
feat/contracts-button
feat/icon-button
feat/link
feat/text-field
feat/search-field
feat/radio-group
feat/inline-feedback
feat/avatar
feat/status-badge
feat/dialog
feat/side-panel
feat/empty-state
feat/sidebar
feat/top-navbar
feat/breadcrumbs
feat/page-heading
feat/table
feat/pattern-application-shell
feat/pattern-form-submit-recover
feat/pattern-unsaved-change-guard
feat/pattern-edit-save-recover
feat/pattern-search-list-detail
```

---

## Milestone acceptance gate

A component/pattern milestone is `Complete` only when all applicable evidence exists on the same final HEAD:

- validated contract and cross-reference checks;
- focused RED/GREEN tests recorded;
- package tests pass;
- package typecheck passes;
- relevant package build passes;
- full repo `pnpm test` passes;
- full repo `pnpm typecheck` passes;
- `pnpm contracts:validate` passes;
- token validation/build passes without unauthorized foundation expansion;
- Storybook production build passes;
- required Light/Dark × English/Arabic/RTL visual parity checked;
- required Wide/Narrow pattern context checked;
- clean packed-consumer smoke test passes for affected public packages;
- fresh reviewer reports no unresolved Critical/Important findings;
- GitHub Actions passes on the exact final HEAD;
- master progress tracker is updated before any next milestone begins.

---

## Execution order summary

```text
C01 Button
C02 Icon Button
C03 Link
C04 Text Field + _Input Control
C05 Search Field
C06 Radio Group + _Radio Option
C07 Inline Feedback
C08 Avatar
C09 Status Badge
C10 Dialog
C11 Side Panel
C12 Empty State
C13 Sidebar + _Navigation Item
C14 Top Navbar
C15 Breadcrumbs + _Breadcrumb Link Item
C16 Page Heading
C17 Table + _Table Header + _Table Row
P01 Application Shell
P02 Form Submit and Recover
P03 Unsaved-change Guard
P04 Edit, Save and Recover
P05 Search, List and Detail
```

The roadmap intentionally ends with Search/List/Detail because it is the broadest integration proof of component contracts, pattern contracts, responsive behavior, recovery semantics, and composition boundaries.