# Design System Components + Patterns Progress Tracker

**Master roadmap:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md`  
**Contract architecture:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`  
**Internal-visibility amendment:** `docs/superpowers/specs/2026-09-17-component-contracts-visibility-amendment.md`  
**Planning branch:** `plan/all-components-patterns`  
**Active implementation branch:** `feat/dialog`  
**Foundations baseline:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Figma source:** `tYCXBBYoQ92AUKVbND5WkG`  
**Status:** C01 BUTTON COMPLETE; C02 ICON BUTTON COMPLETE; C03 LINK COMPLETE; C04 TEXT FIELD COMPLETE; C05 SEARCH FIELD COMPLETE; C06 RADIO GROUP COMPLETE; C07 INLINE FEEDBACK COMPLETE; C08 AVATAR COMPLETE; C09 STATUS BADGE COMPLETE; C10 DIALOG COMPLETE — final record HEAD CI pending; C11 has not started

## Review policy

Per user direction, implementation reviews are performed inline by ChatGPT without sub-agents. They are recorded as **inline self-review**, not independent review.

## Progress summary

- Public components implemented through C10: **10 / 17** — C01 Button, C02 Icon Button, C03 Link, C04 Text Field, C05 Search Field, C06 Radio Group, C07 Inline Feedback, C08 Avatar, C09 Status Badge, C10 Dialog
- Public components in progress: **0 / 17**; C10 awaits only the exact final-record CI check for this documentation commit
- Internal helpers governed with parent milestones: **2 / 6 complete** — `_Input Control`, `_Radio Option`
- Product patterns: **0 / 5 complete**
- Overall public milestones implemented: **10 / 22**
- Next planned milestone: **C11 Side Panel — not started**

## Component milestones

| ID | Component | Contract | Figma | Depends on | Status | Latest implementation/parity SHA | Review | CI evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C01 | Button | `dse.button@1.0.0` | `93:1230` | contract infrastructure | Complete | `5514dcb5ff83cf90587fb27ecafb7cc972eec02f` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 61 PASS on exact final C01 HEAD |
| C02 | Icon Button | `dse.icon-button@1.0.0` | `110:1339` | C01 package infrastructure | Complete | `7c5e27ea123c31706d920bb5b6d6ffc1036c63b3` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 87 PASS on exact final C02 record HEAD |
| C03 | Link | `dse.link@1.0.0` | `114:13` | C01 package infrastructure | Complete | `7e28ce06542e257a2e0edab492d3eec58dcc92e6` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 101 PASS on exact final C03 record HEAD |
| C04 | Text Field | `dse.text-field@1.0.0` | `112:263` | internal `_Input Control` | Complete | `64300dd8559c86a33d1c2180ecfa9527afd9695f` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 137 PASS on exact final C04 record HEAD `cc4e6ef10cc04f787f0ef51ac78000208acba148` |
| C05 | Search Field | `dse.search-field@1.0.0` | `112:1710` | C02, C04 internal input shell | Complete | `6f0d23d6bc40979e61ce68092a831ea449aaf7cc` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 153 PASS on exact final C05 record HEAD |
| C06 | Radio Group | `dse.radio-group@1.0.0` | `116:175` | internal `_Radio Option` | Complete | `ed631c7c98e866becf453b0b6befbf2bfc7e6f05` | Inline self-review APPROVED; accessibility-name defect corrected; no unresolved Critical/Important findings | Run 169 PASS on exact final C06 record HEAD |
| C07 | Inline Feedback | `dse.inline-feedback@1.0.0` | `127:30` | component package infrastructure | Complete | `6aa208229a277e6d1314f6c391a94c32800eca38` | Inline self-review APPROVED; width-fill, WebKit mask, and Dark × Arabic evidence gaps corrected | Run 203 PASS on exact final C07 HEAD |
| C08 | Avatar | `dse.avatar@1.0.0` | `128:14` | component package infrastructure | Complete | `e5c2491d028f1c27b99ed79ac383c0575ba59c9c` | Inline self-review APPROVED; source-inventory and self-contained prepack corrections applied; no unresolved Critical/Important findings | Run 218 PASS on implementation/package HEAD; run 219 PASS on exact final C08 record HEAD `f9ea71fb7839c7a9701b07b130be01fbd68145d5` |
| C09 | Status Badge | `dse.status-badge@1.0.0` | `128:1821` | component package infrastructure | Complete | `367d462812a47525c8bdf3207ed7ab4c08c6aee8` | Inline self-review APPROVED; package verifier existence and contract-alignment corrections applied; no unresolved Critical/Important findings | Run 229 PASS on implementation/package HEAD; run 231 PASS on exact final C09 record HEAD `db5d10b1f09631ca9f49fdc3b3a520b09aea4025` |
| C10 | Dialog | `dse.dialog@1.0.0` | `133:6` | C01, C02 | Complete — final record HEAD CI pending | `57a02ff8100527321432dbf72cbc1a5639e0aab0` | Inline self-review APPROVED; focus test, native close-label mapping, null description/actions, token inventory, and runtime-default parity corrections applied; no unresolved Critical/Important findings | Run 248 PASS on exact implementation/package HEAD; this record commit must also PASS |
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
| `_Radio Option` | `dse._radio-option@1.0.0` | `116:174` | C06 | Complete with C06 — validated `visibility=internal`, used only by Radio Group, absent from root JS/TypeScript exports and blocked as a package subpath |
| `_Navigation Item` | `dse._navigation-item` | `143:2948` | C13 | Not started |
| `_Breadcrumb Link Item` | `dse._breadcrumb-link-item` | `139:16` | C15 | Not started |
| `_Table Header` | `dse._table-header` | `152:3685` | C17 | Not started |
| `_Table Row` | `dse._table-row` | `152:3729` | C17 | Not started |

`_Button / Busy indicator` (`93:24`) remains a C01 implementation detail, not an independent helper-contract milestone.

## Pattern milestones

| ID | Pattern | Contract | Figma guide | Depends on | Status |
| --- | --- | --- | --- | --- |
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
- Final C05 record HEAD: `6f0d23d6bc40979e61ce68092a831ea449aaf7cc`; run 153 PASS on that exact commit.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.**

## C06 evidence summary

### Figma authority and contracts

- Fresh live-Figma audit used Radio Group `116:175` and `_Radio Option` `116:174` as the authorities before implementation.
- Radio Group exposes Figma `label`, `required`, and an Options slot constrained to `_Radio Option`, with a two-option minimum and no maximum. It does not expose a group-level disabled prop, selected-value prop, product role enum, validation/error API, or arbitrary child composition.
- `_Radio Option` owns `label`, `description`, `showDescription`, `selected=false|true`, and `state=default|hover|focus|pressed|disabled`. `showDescription`, selection, and interaction states are mapped to data/native/CSS behavior instead of public visual-state props.
- `dse.radio-group@1.0.0` is public. `dse._radio-option@1.0.0` is `visibility=internal` and cannot be imported from the package root or via a package subpath.
- Public Radio Group API is `label`, `name`, at-least-two structured `options`, `value`, `defaultValue`, `onValueChange`, and `required` with default `true`. Option data owns `value`, `label`, optional `description`, and optional `disabled`.
- Runtime invariants require at least two options and unique non-empty option values. Member/Admin and Member preselection remain product/story fixtures only.
- Contract RED: run 154 on `2588a79ca1942e6b108d5a7acfcaab9672b9bc3c`.
- Contract GREEN: run 158 on `7553d4d7f7907592cdaba66cac754c2184d55a97` after adding both contracts and the deliberate implemented-contract inventory entry; no shared schema widening was required.

### Runtime, accessibility, CSS, and Storybook

- Runtime RED: run 161 on `f0d9cccf7548e284524f44e25d7046b1ede0257a` with C06 runtime/CSS/Storybook tests present before production code.
- Radio Group renders native `<fieldset>` + `<legend>` and same-named native `<input type="radio">` controls. Browser mutual exclusion and keyboard behavior remain native; there is no `role="radiogroup"`, custom arrow-key handler, or roving tabindex implementation.
- Controlled and uncontrolled selection are supported. Supplying both `value` and `defaultValue` is rejected. No first option is automatically selected when both are omitted.
- Required defaults to true for Figma parity, is applied consistently to every native radio, and the visual asterisk is `aria-hidden`.
- Option-level disabled remains local to each option; a selected disabled value remains selected rather than being cleared.
- The first implementation GREEN attempt, run 162 on `99aca4b960b48614752ad9b3be71b5821b8c7588`, exposed a real accessibility defect: wrapping the description inside the clickable label caused it to join the radio accessible name. The fix added explicit `aria-labelledby` for the label while retaining `aria-describedby` for the description and the full-row click target.
- Accessibility correction HEAD `7924da03ddeb1ebc9cc6426028aa1e2f94f0d749`; run 163 PASS.
- CSS reproduces the audited 64 px minimum row, 8 px padding, 8 px radius, 10 px control/text gap, 28 px control area, 20 px ring, 2 px border, 8 px selected dot, and 2 px text gap. Row height is minimum-only so descriptions can wrap/grow. Logical properties keep RTL direction-safe without mirroring the radio glyph.
- Storybook evidence includes required roles, Team & Access Member/Admin product fixture, controlled selection, descriptions on/off, disabled option, long wrapping description, real native focus, and Arabic RTL.

### Package, knowledge, and review

- Packed-consumer HEAD `74d7cdb528e3c9f2cfcb23478176b51ee0488136`; run 164 PASS.
- Installed-package CI imports and SSR-renders Radio Group, verifies semantic fieldset/legend, two same-named native radios, values, one selected default, required semantics, explicit accessible-name/description bindings, packaged CSS, and absence of invented ARIA group roles.
- Package verification proves `RadioOption` is absent from root JS/TypeScript exports and that the private internal package subpath is rejected with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Run 164 verification totals: contracts **40/40**, tokens **17/17**, React **78/78**, Storybook tests **18/18** = **153 full tests passing**. C06-focused evidence is **26 tests**: 7 contract + 10 runtime + 5 CSS + 4 Storybook. Contract validation reports 8 component contracts / 0 patterns; token validation/build reports 223 logical tokens. Typecheck, React build, Storybook production build, and packed clean-consumer verification all pass.
- Figma C06 code-contract knowledge was appended to both authority descriptions using the marker `CODE CONTRACT / C06 · synced 2026-09-17`; an independent read-back confirmed both records persisted with the public/internal API split, native semantics, geometry, accessibility associations, and package boundary.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.** The material defect found during review/execution was the option accessible-name contamination; it was corrected and verified via run 162 → 163. Boundary review also confirms no arbitrary children escape hatch, group-level disabled/error API, public Figma-state props, custom keyboard state machine, product-role logic, fixed-height clipping, or public `RadioOption` leak.
- Final C06 record HEAD `ed631c7c98e866becf453b0b6befbf2bfc7e6f05`; run 169 PASS on that exact commit.

## C07 evidence summary

### Figma authority, contract, and runtime

- Fresh authority is Inline Feedback component set `127:30`.
- `dse.inline-feedback@1.0.0` requires `intent=error|success` and a non-empty `message`; `title` is optional and Figma `showTitle` is derived solely from title presence.
- Error renders `role="alert"`; success renders `role="status"`. The outcome icon is decorative and the component never moves focus.
- The public boundary contains no arbitrary children/action slot, dismiss API, warning/info/loading/toast variant, `role` override, or `aria-live` override. Retry remains a sibling Button owned by the containing pattern.
- Exact Figma Alert/Check geometry is packaged as mask assets; semantic feedback foreground/surface/border tokens govern Light/Dark recoloring. Messages wrap and grow naturally.

### Storybook, package, knowledge, and review

- Storybook covers error, success, titleless, long-message, and Light/Dark × English/Arabic including Dark × Arabic and RTL.
- Packed-consumer verification imports and SSR-renders both outcome semantics, checks packaged CSS, and validates both installed Figma icon assets.
- Figma implementation knowledge was appended to Inline Feedback `127:30` under `IMPLEMENTATION / C07 · dse.inline-feedback@1.0.0` and read back successfully.
- Inline self-review found and fixed three real gaps: explicit container-width filling, WebKit mask compatibility, and the missing Dark × Arabic Storybook intersection.
- Final C07 HEAD `6aa208229a277e6d1314f6c391a94c32800eca38`; run 203 PASS on that exact commit.
- Final verification totals: contracts **45/45**, tokens **17/17**, React **87/87**, Storybook **21/21** = **170 automated tests passing**; typecheck, Storybook production build, and packed consumer all PASS.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.**

## C08 evidence summary

### Figma authority and contract

- Fresh live-Figma audit established Avatar component set `128:14` as the single authority: `size=sm|lg`, `content=initials|fallback`, optional supplied initials, and no photo/presence/status/role/verified/selected-person variant.
- `dse.avatar@1.0.0` is public. Its API is optional consumer-supplied `initials`, optional `size=sm|lg` defaulting to `sm`, and optional native `aria-label` for a standalone meaningful identity visual.
- Figma `content=initials|fallback` is derived rather than public API. Missing or whitespace-only initials render the governed neutral `@`; Avatar never derives initials from a name, email, gender, or other personal attribute.
- Contract TDD: run 204 proved the missing-contract RED; the first GREEN exposed the deliberate implemented-contract source-inventory gate, which was advanced to C08; run 206 then passed the complete contract gate.

### Runtime, CSS, Storybook, and accessibility

- Runtime RED was proven by run 207 before production Avatar existed. Runtime GREEN checkpoint run 213 passed tests, typecheck, Storybook production build, and package smoke.
- By default Avatar is decorative with `aria-hidden=true`; a non-empty `aria-label` switches to image-like `role="img"` semantics. Conflicting consumer `role`/`aria-hidden` values cannot override the governed semantics, and unsupported interaction/identity props are stripped at runtime for JavaScript callers that bypass TypeScript.
- Geometry is exact to Figma: `sm` 32×32 CSS px and `lg` 48×48 CSS px. CSS consumes `surface/section`, `fg/secondary`, `shape/rounded`, and `label/small` semantic tokens and remains direction-agnostic in LTR/RTL.
- Storybook RED run 214 preceded implementation. Run 215 passed with sm/lg/fallback across Light/Dark × English/Arabic, including all Dark × Arabic intersections and a labeled standalone case.

### Package, knowledge, and review

- React package `prepack` is self-contained: `pnpm build && node scripts/verify-avatar-dist.mjs`. The verifier imports the built public Avatar export, SSR-renders initials/fallback/labeled forms, checks exact semantics, and verifies Avatar CSS is present in `dist/styles.css`.
- Self-review caught that the first prepack version implicitly depended on `dist/` already existing; the correction made direct `pnpm pack` safe instead of relying on CI step order.
- Final implementation/package HEAD `e5c2491d028f1c27b99ed79ac383c0575ba59c9c`; run 218 PASS across all gates. Verification totals: contracts **49/49**, tokens **17/17**, React **99/99**, Storybook **24/24** = **189 automated tests passing**. Contract validation reports 10 component contracts / 0 patterns; token validation/build reports 223 logical tokens. Typecheck, Storybook production build, React prepack distribution verification, and packed clean-consumer verification all pass.
- C08-focused automated evidence is 19 tests: 4 contract + 7 runtime + 3 CSS + 2 runtime/contract parity + 3 Storybook.
- Figma implementation knowledge was appended to Avatar `128:14` under `IMPLEMENTATION / C08 · dse.avatar@1.0.0`; immediate independent read-back confirmed the persisted API, derived fallback, accessibility boundary, excluded APIs, exact geometry/token mapping, and evidence record.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.** Corrections were the stale source-inventory gate, fail-closed runtime prop boundary, and self-contained prepack build/verification.
- Final C08 record HEAD `f9ea71fb7839c7a9701b07b130be01fbd68145d5`; run 219 PASS on that exact commit.

## C09 evidence summary

### Figma authority and contract

- Fresh live-Figma audit established Status Badge `128:1821` as a neutral-only component with one public property: `label`. `Active` and `Invitation pending` are product-supplied example values, not component variants.
- `dse.status-badge@1.0.0` requires one non-empty `label` and deliberately does not forward arbitrary native attributes. It exposes no status/tone/size/icon/selected/dismissible/href/click API and no public closed status enum.
- Static visible text carries the meaning. Status Badge is not an alert or live region; it has no focus target or keyboard activation. A containing workflow owns announcements if a dynamic status change needs one.
- Contract RED: run 220 failed only because the new contract file was intentionally absent. Adding the contract made the four C09 contract tests green; run 221 then exposed only the frozen C08 source-inventory gate. Advancing that inventory to C09 produced full contract GREEN on run 222.

### Runtime, CSS, Storybook, and accessibility

- Runtime/CSS RED: run 223 failed exactly seven C09 tests because `StatusBadge.tsx` and `StatusBadge.css` were intentionally absent while the existing 99 React tests stayed green.
- Runtime GREEN: run 224 passed the new runtime/CSS boundary. The implementation renders a native static `<span>`, preserves product-supplied text, rejects empty/whitespace labels, and ignores untyped attempts to inject children, role, aria-live, tabIndex, click behavior, tone, status, or icons.
- Visual mapping is exact to Figma: 28px height, 5px block padding, 10px logical inline padding, content-driven width, `surface/section`, `fg/primary`, `shape/surface`, and `label/small`. No physical left/right spacing is used, so RTL geometry remains direction-safe.
- Storybook RED: run 225 failed only the three new C09 Storybook contract tests because the story file was intentionally absent. Run 226 passed with `Active` and `Invitation pending` across Light/Dark × English/Arabic, including both Dark × Arabic intersections.

### Package, knowledge, and review

- C09 extends the self-contained React `prepack` verifier chain with `verify-status-badge-dist.mjs`. The built-package verifier imports the public export, SSR-renders Status Badge, checks the non-interactive boundary, rejects whitespace labels, and verifies the packaged 28px/5px/10px CSS plus neutral semantic tokens.
- Package-hardening RED run 227 caught that `prepack` referenced the new verifier before the verifier file existed. Inline self-review then caught a second test-authoring mistake before closure: the first verifier draft assumed native-attribute forwarding and `fg/secondary`, conflicting with the already-locked contract (`forwardNativeAttributes=false`, `fg/primary`). The verifier was corrected instead of widening or changing the component API.
- Final implementation/package HEAD `367d462812a47525c8bdf3207ed7ab4c08c6aee8`; run 229 PASS across install, 11-contract validation, 223-token validation/build, **53/53 contract tests**, **17/17 token tests**, **106/106 React tests**, **27/27 Storybook tests** = **203 automated tests passing**, typecheck, Storybook production build, and packed package smoke/prepack verification.
- Figma implementation knowledge was appended to Status Badge `128:1821` under `IMPLEMENTATION / C09 · dse.status-badge@1.0.0`; a separate read-back confirmed the marker, run 229 evidence, neutral-only boundary, exact geometry, semantic mapping, and runtime rules persisted.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.** Scope comparison from C08 to the C09 implementation/package HEAD contains only C09 contract/runtime/CSS/Storybook/export/build/package-verifier work plus the deliberate source-inventory advance. C10 has not started.
- Final C09 record HEAD `db5d10b1f09631ca9f49fdc3b3a520b09aea4025`; run 231 PASS on that exact commit.

## C10 evidence summary

### Figma authority and contract

- Fresh Figma re-read used Dialog `133:6` as the authority before implementation. The locked component boundary is a modal surface with required title, optional description, optional close affordance, Body and Actions composition, and no product request/business-state ownership.
- `dse.dialog@1.0.0` is public and controlled: required `open`, `onOpenChange`, `title`, and `children`; optional `description`, `actions`, `showClose` default `true`, native `closeLabel` default `Close dialog`, and optional `initialFocusRef`. Arbitrary native attributes are not forwarded.
- Figma `showDescription` is derived from description presence. `showClose` remains a presentation affordance only; hiding it does not change Escape behavior or define pending-request exit policy.
- Unsupported workflow APIs remain forbidden: `onSubmit`, `requestStatus`, visual/business `state`, `pending`, `validation`, `dirty`, `dismissOnBackdrop`, `showDescription`, success/error/loading state APIs.
- Initial RED run 232 proved the contract/runtime source did not yet exist and the deliberate C10 source-inventory gate had not advanced.

### Runtime, accessibility, CSS, and Storybook

- Dialog renders through a body portal with `role="dialog"`, `aria-modal=true`, required title association, optional description association, background `inert` + `aria-hidden`, initial focus movement, contained Tab/Shift+Tab navigation, and focus restoration to the invoking control on controlled close.
- Escape requests `onOpenChange(false)` whether the close Icon Button is visible or hidden. The governed close Icon Button uses a non-empty accessible label. Backdrop/outside pointer activation does not dismiss in v1.
- Body and Actions are composition slots only; Dialog does not interpret product actions, validation, submission, pending state, dirty checks, or outcomes. `null`/`false` optional description/actions content is treated as absent so no empty accessibility relationship or divider/footer is created.
- CSS follows the audited 520px maximum overlay surface, semantic overlay/elevated surfaces, overlay radius, title/body typography, subtle divider, exact local Figma elevation, responsive viewport maximum height, logical alignment, and RTL-safe layout.
- Storybook composes existing public Button, Text Field, and Radio Group and covers Invite Member in Light/Dark × English/Arabic, plus confirm-discard and description-absent evidence. Production Storybook build passes.

### Package, TDD corrections, knowledge, and review

- React package now lists `react-dom` as a peer because Dialog uses `createPortal`, includes Dialog CSS in the built stylesheet, reuses packaged `x.svg`, and extends the self-contained `prepack` chain with `verify-dialog-dist.mjs`.
- Packed verification checks the public Dialog export, SSR-safe closed output, packaged Dialog CSS, 520px surface rule, overlay/elevated/radius token references, and copied close asset.
- Self-review corrections were each kept narrow and verified: TypeScript focus-array narrowing; the focus-trap test's incorrect assumption about visible Close tab order; missing spacing/icon token dependencies; `closeLabel` corrected from generic content to native accessibility data (RED run 242); `description={null}` treated as absent (RED run 243); `actions={null}` treated as absent (RED run 245); and runtime defaults locked against contract drift (RED run 247).
- Run 248 PASS on exact implementation/package HEAD `57a02ff8100527321432dbf72cbc1a5639e0aab0` across frozen install, 12-component contract validation, 223-token validation/build, full automated tests, TypeScript typecheck, Storybook production build, and packed-package smoke/prepack verification.
- Figma source authority and the AI knowledge-pack frame were re-read during C10. No C10 knowledge-pack write/read-back is claimed in this record because the available Figma connection in this chat did not expose its required write guidance safely; the code/contract evidence remains authoritative until that separate sync can be performed.
- Inline self-review: **APPROVED — no unresolved Critical or Important findings.** Final scope comparison from C09 to C10 contains only Dialog contract/runtime/CSS/Storybook/export/package work plus the deliberate source-inventory advance and `react-dom` peer required by the portal implementation.
- Final implementation/package HEAD `57a02ff8100527321432dbf72cbc1a5639e0aab0`; run 248 PASS. This documentation record commit must also pass PR CI on its exact HEAD before the C10 record is authoritative.

## Milestone completion rule

For every task/milestone record RED/GREEN evidence, contract validation, focused/full tests, typecheck/build, visual parity when applicable, packed-consumer proof when applicable, inline self-review verdict, corrections, and exact-HEAD CI. Do not mark a milestone complete with an unresolved gate.

Documentation/knowledge-only record commits after a verified implementation milestone must also pass PR CI before merge. The passing PR HEAD is the authoritative record check; it does not require another tracker mutation solely to record its own run number.

## Scope guard

This roadmap does not authorize npm publication, PR/main merges, product backend/authorization/persistence, unreviewed variants, mobile-specific expansion beyond current responsive guidance, generic Table sorting/pagination/bulk selection, or placeholder contracts for future units. Figma implementation-knowledge synchronization remains authorized only for the milestone being completed and has been performed through C09; C10 source parity is complete but knowledge-pack write/read-back remains pending as noted above. **C11 Side Panel has not been started.**
