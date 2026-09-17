# Design System Components + Patterns Progress Tracker

**Master roadmap:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md`  
**Contract architecture:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`  
**Internal-visibility amendment:** `docs/superpowers/specs/2026-09-17-component-contracts-visibility-amendment.md`  
**Planning branch:** `plan/all-components-patterns`  
**Active implementation branch:** `feat/search-field`  
**Foundations baseline:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Figma source:** `tYCXBBYoQ92AUKVbND5WkG`  
**Status:** C01 BUTTON COMPLETE; C02 ICON BUTTON COMPLETE; C03 LINK COMPLETE; C04 TEXT FIELD COMPLETE; C05 SEARCH FIELD COMPLETE — exact final record HEAD CI pending; C06 has not started

## Review policy

Per user direction, implementation reviews are performed inline by ChatGPT without sub-agents. They are recorded as **inline self-review**, not independent review.

## Progress summary

- Public components complete: **5 / 17** — C01 Button, C02 Icon Button, C03 Link, C04 Text Field, C05 Search Field
- Public components in progress: **0 / 17**
- Internal helpers governed with parent milestones: **1 / 6 complete** — `_Input Control`
- Product patterns: **0 / 5 complete**
- Overall public milestones complete: **5 / 22**
- Next planned milestone: **C06 Radio Group — not started**

## Component milestones

| ID | Component | Contract | Figma | Depends on | Status | Latest implementation/parity SHA | Review | CI evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C01 | Button | `dse.button@1.0.0` | `93:1230` | contract infrastructure | Complete | `5514dcb5ff83cf90587fb27ecafb7cc972eec02f` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 61 PASS on exact final C01 HEAD |
| C02 | Icon Button | `dse.icon-button@1.0.0` | `110:1339` | C01 package infrastructure | Complete | `7c5e27ea123c31706d920bb5b6d6ffc1036c63b3` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 87 PASS on exact final C02 record HEAD |
| C03 | Link | `dse.link@1.0.0` | `114:13` | C01 package infrastructure | Complete | `7e28ce06542e257a2e0edab492d3eec58dcc92e6` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 101 PASS on exact final C03 record HEAD |
| C04 | Text Field | `dse.text-field@1.0.0` | `112:263` | internal `_Input Control` | Complete | `64300dd8559c86a33d1c2180ecfa9527afd9695f` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 137 PASS on exact final C04 record HEAD `cc4e6ef10cc04f787f0ef51ac78000208acba148` |
| C05 | Search Field | `dse.search-field@1.0.0` | `112:1710` | C02, C04 internal input shell | Complete — final record HEAD CI pending | `ba06bb1cb71f409e1b4076815ff184f57b18862b` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 152 PASS on final implementation/review HEAD; final record HEAD must also PASS |
| C06 | Radio Group | `dse.radio-group` | `116:175` | internal `_Radio Option` | Not started | — | — | — |
| C07 | Inline Feedback | `dse.inline-feedback` | `127:30` | component package infrastructure | Not started | — | — | — |
| C08 | Avatar | `dse.avatar` | `128:14` | component package infrastructure | Not started | — | — | — |
| C09 | Status Badge | `dse.status-badge` | `128:1821` | component package infrastructure | Not started | — | — | — |
| C10 | Dialog | `dse.dialog` | `133:6` | C01, C02 | Not started | — | — | — |
| C11 | Side Panel | `dse.side-panel` | `137:2` | C01, C02 | Not started | — | — | — |
| C12 | Empty State | `dse.empty-state` | `131:2` | C01/C03 for action stories | Not started | — | — | — |
| C13 | Sidebar | `dse.sidebar` | `146:166` | internal `_Navigation Item`, C03 | Not started | — | — | — |
| C14 | Top Navbar | `dse.top-navbar` | `228:18954` | C08 for account story | Not started | — | — | — |
| C15 | Breadcrumbs | `dse.breadcrumbs` | `139:20` | internal `_Breadcrumb Link Item`, C03 | Not started | — | — | — |
| C16 | Page Heading | `dse.page-heading` | `142:2488` | C01/C03, C15 | Not started | — | — | — |
| C17 | Table | `dse.table` | `152:3730` | internal header/row, C08, C09, C03/C01 stories | Not started | — | — | — |

## Internal helper tracking

| Helper | Internal contract | Figma | Parent milestone | Status |
| --- | --- | --- | --- | --- |
| `_Input Control` | `dse._input-control@1.0.0` | `111:22` | C04 | Complete with C04 — validated `visibility=internal`, used by Text Field and Search Field, absent from public React package exports |
| `_Radio Option` | `dse._radio-option` | `116:174` | C06 | Not started |
| `_Navigation Item` | `dse._navigation-item` | `143:2948` | C13 | Not started |
| `_Breadcrumb Link Item` | `dse._breadcrumb-link-item` | `139:16` | C15 | Not started |
| `_Table Header` | `dse._table-header` | `152:3685` | C17 | Not started |
| `_Table Row` | `dse._table-row` | `152:3729` | C17 | Not started |

`_Button / Busy indicator` (`93:24`) remains a C01 implementation detail, not an independent helper-contract milestone.

## Pattern milestones

| ID | Pattern | Contract | Figma guide | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| P01 | Application Shell | `dse.pattern.application-shell` | `68:494` | C13-C16; content can host C17 | Not started |
| P02 | Form Submit and Recover | `dse.pattern.form-submit-recover` | `68:2` | C01, C04, C06, C07, C10 | Not started |
| P03 | Unsaved-change Guard | `dse.pattern.unsaved-change-guard` | `68:371` | C01, C10 | Not started |
| P04 | Edit, Save and Recover | `dse.pattern.edit-save-recover` | `68:240` | C01, C06, C07, C11, P03 | Not started |
| P05 | Search, List and Detail | `dse.pattern.search-list-detail` | `68:121` | C05, C11, C12, C17, P01, P03, P04 | Not started |

## C01 evidence summary

- `dse.button@1.0.0` governs the public Button API, semantics, tokens, loading/disabled behavior, icons, and derived browser states.
- React uses a native button, safe `type=button`, required visible children, loading semantics, intrinsic width preservation, logical icon placement, and public token CSS.
- Storybook and the clean packed-consumer gate verify the distributable API/assets.
- Final HEAD `5514dcb5ff83cf90587fb27ecafb7cc972eec02f`; run 61 PASS.
- Figma AI knowledge pack records `contract_validation=passed`.

Detailed evidence: `docs/superpowers/plans/2026-09-16-button-react-progress.md`.

## C02 evidence summary

- Live Icon Button `110:1339` was audited as four 40 × 40 states with a 20 × 20 icon and independent Figma focus representation.
- `dse.icon-button@1.0.0` requires `icon` and native `aria-label`, supports native disabled/attributes, and forbids visual-state/loading/size inventions.
- Runtime, CSS, Storybook, and packed-package verification prove native semantics, token states, localization, and private Figma implementation-token exclusion.
- Final record HEAD `7c5e27ea123c31706d920bb5b6d6ffc1036c63b3`; run 87 PASS.
- Figma AI knowledge pack records `contract_validation=passed`.

## C03 evidence summary

- Live Link `114:13` was audited as `default|hover|focus|pressed`, semantic small-label typography, and no disabled/visited/icon/size/loading variants.
- `dse.link@1.0.0` requires visible children, forwards native anchor attributes, and maps Figma interaction states to browser CSS.
- Runtime, Storybook, and installed-package verification prove native anchor semantics, native attributes, Arabic/long-label evidence, and packaged CSS.
- TDD evidence: contract RED/GREEN runs 88/90; runtime RED/GREEN runs 92/97; Storybook RED/GREEN runs 98/99; installed-package run 100 PASS.
- Final record HEAD `7e28ce06542e257a2e0edab492d3eec58dcc92e6`; run 101 PASS.
- Figma AI knowledge pack records `contract_validation=passed`.

## C04 evidence summary

### Figma authority and visual facts

- `_Input Control` `111:22` is **12 variants = 2 sizes × 6 states**: `size=compact|default` and `state=default|hover|focus|disabled|invalid|invalid-focus`.
- Compact is 40 px; default is 44 px. Text Field consumes default; Search Field consumes compact under validated C05.
- Text Field `112:263` is **12 variants = 6 states × content=empty|filled** with `label`, `value`, `placeholder`, `supportingText`, `required`, and `showSupportingText` Figma properties.
- Root field vertical spacing is 8 px. Live label → required-marker spacing is 4 px. Both are governed through existing public spacing tokens rather than raw values.
- Text roles match Figma: label/required marker `fg/primary`; value `fg/primary`; placeholder `fg/tertiary`; support `fg/secondary`; invalid message `feedback/negative/fg`; disabled copy `fg/disabled`.

### Contract architecture and governance

- C04 first required real internal-helper contract support. The schema now requires `visibility=public|internal`.
- Public IDs cannot begin `dse._`; internal IDs must begin `dse._`; internal contracts cannot declare a public implementation package; pattern dependencies resolve only against public component contracts.
- Existing Button, Icon Button, and Link contracts were migrated explicitly to `visibility=public` without runtime changes.
- Visibility RED: run 102 on `a496b8718b29b2406fb4f455a2463e2e35226121`.
- Visibility GREEN: run 110 on `497116b7c96c7d126fd29bc9a69fded1c69d1dde`.
- The implemented model is documented by `2026-09-17-component-contracts-visibility-amendment.md` and supersedes the original spec only where that spec called internal visibility a future extension.

### Contracts

- `dse._input-control@1.0.0`: `visibility=internal`, no public implementation package, internal `size=compact|default`, and all visual states derived from the descendant native input. The helper never owns the accessible name, value, validation, keyboard behavior, or public events.
- `dse.text-field@1.0.0`: public `label`, `supportingText`, `invalid`, `errorMessage`, native `required`/`disabled`, and forwarded native input attributes.
- Figma `state`, `content`, `showSupportingText`, and helper `size` remain derived/internal and are forbidden public Text Field API. `children` is also forbidden because the runtime element is a native input.
- Contract RED: run 112 on `7f724bb0631bb98f83e7dae2cb31dae8118b6a73`.
- Contract GREEN: run 115 on `a3352795b3f401ebb3d5f3d223e9fa83ee307efb`.

### Runtime and CSS

- Private `InputControl` composes the shell but is absent from `packages/react/src/index.ts`.
- Text Field is a `forwardRef<HTMLInputElement>` native input with explicit label association, stable generated ID when omitted, native value/defaultValue/onChange behavior, native required/disabled, merged consumer + generated `aria-describedby`, and semantic `aria-invalid`.
- Invalid uses `errorMessage` when supplied; otherwise supporting text remains the described message.
- Native `className` and other native attributes stay on the input rather than being repurposed as composite-wrapper props.
- `_Input Control` default 44 px height is token-derived as 40 px + 4 px; no new global token was invented.
- Shell hover/focus/disabled/invalid/invalid-focus are derived from the descendant input via CSS, with no JavaScript/Figma state machine.
- Runtime/CSS RED: run 117 on `6c4d3f526ae945f9ab79937abadf335d90a60f94`.
- Runtime GREEN after two test-harness/type-only corrections: run 127 on `a797c713444193c204bacc885ece61645cd1eac8`.

### Storybook, package, and parity

- Storybook contains Playground, Empty, Filled, Required, Disabled, Invalid, real-focus InvalidFocused, LongSupportingText, and ArabicEmail evidence.
- Storybook does not expose `state`, `content`, `size`, `showSupportingText`, or `children` as controls.
- Storybook RED/GREEN: runs 128/129.
- Compile-time public-API hardening caught a real inherited React `content` key that would have leaked the Figma `content` name into `TextFieldProps`; production now explicitly omits that key.
- Package-hardening RED: run 131 on `66f8c5e0e5afc52e1c36a34cfe82339a0705d61e`; GREEN: run 132 on `5d6713f3198e0315d081b3c6406ae9310ec8297a`.
- Installed-package CI imports and SSR-renders Text Field, checks label/input/message associations and packaged CSS, and explicitly proves `InputControl` is absent from root JS and TypeScript exports.
- Fresh live-Figma review then caught the missing 4 px label-to-required-indicator gap. Parity RED: run 133 on `8d81a76407149a6bb840a3628acb5ff87d6273f7`; parity GREEN: run 135 on `64300dd8559c86a33d1c2180ecfa9527afd9695f`.

### Knowledge and review

- At C04 completion, the Figma INDEX recorded four validated public contracts — Button, Icon Button, Link, Text Field — plus validated internal `dse._input-control@1.0.0` with `visibility=internal`.
- `components-controls.md` records the exact public Text Field mapping and private helper mapping; `contracts.md` records both validated boundaries and keeps later contracts unavailable.
- Read-back verification confirmed the public/internal distinction, private export boundary, derived content/state mapping, 44 px shell, token-governed 4 px marker gap, and future-contract availability rules.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.** Corrections found by review were the inherited `content` API leak and missing 4 px Figma label-marker gap; both went through explicit RED → GREEN evidence before this record.
- Final implementation/parity HEAD: `64300dd8559c86a33d1c2180ecfa9527afd9695f`; run 135 PASS with five-contract validation, 223-token validation/build, full tests, TypeScript typecheck, Storybook production build, and packed clean-consumer verification.
- Final C04 record HEAD: `cc4e6ef10cc04f787f0ef51ac78000208acba148`; run 137 PASS on that exact commit.

## C05 evidence summary

### Figma authority and contract

- Live Search Field authority is component set `112:1710`. It uses the compact 40 px `_Input Control`, fixed 20 px Search glyph, native query viewport, and a conditional X clear affordance using the governed Icon Button.
- `dse.search-field@1.0.0` is public and requires native `aria-label` plus `clearButtonLabel`, supports native value/defaultValue/placeholder/disabled/onChange/ref and compatible native input attributes, and adds optional component-owned `onClear`.
- The contract schema gained the smallest required callback prop type so `onClear` is represented honestly rather than mislabeled as a native attribute.
- Figma `state` and `content` remain derived/native runtime behavior. Public `state`, `content`, `size`, `children`, `type`, `invalid`, `aria-invalid`, `loading`, `results`, `resultCount`, `suggestions`, `selectedPerson`, and `debounce` are forbidden.
- Contract RED: run 138 on `d7a06e88240ad9fb657e68dadbef54449bc9a125`; contract GREEN: run 141 on `a75f86f60d739142b3c9d9078079bc6fc2549179`.

### Runtime, CSS, and package

- Search Field renders a native `<input type="search">` inside the private compact shell; `_Input Control` contains only that native input. Search and clear affordances stay owned by Search Field as siblings outside the helper.
- Empty/filled content is derived from the live query. The clear Icon Button appears only when the query is non-empty; disabled + filled keeps it visible but disabled.
- Uncontrolled clear empties the query, invokes `onClear` once when supplied, and restores focus. Controlled owners clear through `onClear`; focus is restored to the native search input.
- CSS uses logical inline positioning, semantic typography/foreground tokens, a 20 px governed icon token, and suppresses the browser-native search cancel affordance. Search and X glyphs do not mirror in RTL.
- Exact Figma Search `110:21` and X `110:19` SVG exports are packaged and checked for source-path drift in the clean consumer gate.
- Runtime/CSS RED: run 142 on `e46deab3edd68747c46665e5c7b8f247777a5718`. Runtime, Storybook, package and parity implementation reached run 148 PASS on `3e5d25e5705810885dd786797ad46ab0bc5e3c07`.
- Compile-time hardening keeps every forbidden contract name absent from `SearchFieldProps`. Installed-package CI verifies SearchField public export/SSR output/CSS/assets and continued absence of private `InputControl` root exports.

### Storybook, knowledge, and review

- Storybook contains Playground, Empty, Filled, real-focus FocusedEmpty/FocusedFilled, DisabledEmpty/DisabledFilled, LongQuery, and ArabicLatinEmail evidence at the 360 px Figma evidence width while keeping width layout-owned.
- Figma AI knowledge pack read-back confirms the C05 public contract, compact private shell, clear Icon Button composition, forbidden result/validation APIs, runtime requirements, and five-public-plus-one-internal validated-contract inventory.
- Inline self-review found and fixed three material boundary issues before completion: inherited native `results` could leak an intentionally unsupported result API; Search/X affordances initially widened `_Input Control` beyond its C04 child boundary; and untyped forbidden props could leak through to the native input (with `children` able to crash React's void input element).
- The helper-composition correction was proven RED on run 149 (`39723575a91ad93cbdada6cef285d7419742b41e`) and GREEN on run 150 (`0452bf112949a51ff420cb13adfded03986137f5`).
- Full runtime fail-closed hardening was proven RED on run 151 (`b86af802aa6cfbd2751f3d13f45e55373fa6ebd4`) and GREEN on run 152 (`ba06bb1cb71f409e1b4076815ff184f57b18862b`).
- Final implementation/review HEAD: `ba06bb1cb71f409e1b4076815ff184f57b18862b`; run 152 PASS with six-contract validation, 223-token validation/build, full tests, TypeScript typecheck, Storybook production build, and packed clean-consumer verification.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.** C06 remains untouched.
- This documentation/knowledge record commit must also pass PR CI on its exact HEAD before C05 is treated as the authoritative completed record.

## Milestone completion rule

For every task/milestone record RED/GREEN evidence, contract validation, focused/full tests, typecheck/build, visual parity when applicable, packed-consumer proof when applicable, inline self-review verdict, corrections, and exact-HEAD CI. Do not mark a milestone complete with an unresolved gate.

Documentation/knowledge-only record commits after a verified implementation milestone must also pass PR CI before merge. The passing PR HEAD is the authoritative record check; it does not require another tracker mutation solely to record its own run number.

## Scope guard

This roadmap does not authorize npm publication, PR/main merges, automatic Figma/code generation, product backend/authorization/persistence, unreviewed variants, mobile-specific expansion beyond current responsive guidance, generic Table sorting/pagination/bulk selection, or placeholder contracts for future units. C05 is complete subject only to its exact final-record CI gate. **C06 must not start without explicit user authorization.**