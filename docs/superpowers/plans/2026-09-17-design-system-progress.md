# Design System Components + Patterns Progress Tracker

**Master roadmap:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md`  
**Contract architecture:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`  
**Planning branch:** `plan/all-components-patterns`  
**Active implementation branch:** `feat/text-field`  
**Foundations baseline:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Figma source:** `tYCXBBYoQ92AUKVbND5WkG`  
**Status:** C01 BUTTON COMPLETE; C02 ICON BUTTON COMPLETE; C03 LINK COMPLETE; C04 TEXT FIELD IN PROGRESS — internal contract visibility extension complete; contract RED next

## Review policy

Per user direction, implementation reviews are performed inline by ChatGPT without sub-agents. They are recorded as **inline self-review**, not independent review.

## Progress summary

- Public components complete: **3 / 17** — C01 Button, C02 Icon Button, C03 Link
- Public components in progress: **1 / 17** — C04 Text Field
- Internal helpers governed with parent milestones: **0 / 6 complete** — `_Input Control` is now eligible for an internal contract under the verified visibility schema, but its contract has not been authored yet
- Product patterns: **0 / 5 complete**
- Overall public milestones complete: **3 / 22**
- Active milestone: **C04 Text Field + internal `_Input Control` — in progress**

## Component milestones

| ID | Component | Contract | Figma | Depends on | Status | Latest implementation SHA | Review | CI evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C01 | Button | `dse.button@1.0.0` | `93:1230` | contract infrastructure | Complete | `5514dcb5ff83cf90587fb27ecafb7cc972eec02f` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 61 PASS on exact final C01 HEAD |
| C02 | Icon Button | `dse.icon-button@1.0.0` | `110:1339` | C01 package infrastructure | Complete | `7c5e27ea123c31706d920bb5b6d6ffc1036c63b3` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 87 PASS on exact final C02 record HEAD |
| C03 | Link | `dse.link@1.0.0` | `114:13` | C01 package infrastructure | Complete | `7e28ce06542e257a2e0edab492d3eec58dcc92e6` | Inline self-review APPROVED; no unresolved Critical/Important findings | Run 101 PASS on exact final C03 record HEAD |
| C04 | Text Field | `dse.text-field` | `112:263` | internal `_Input Control` | In progress — visibility schema extension complete; C04 contracts not yet authored | `497116b7c96c7d126fd29bc9a69fded1c69d1dde` | Task 0 inline review pending milestone review | Visibility RED run 102 on `a496b87`; visibility GREEN run 110 on `497116b` |
| C05 | Search Field | `dse.search-field` | `112:1710` | C02, C04 internal input shell | Not started | — | — | — |
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
| `_Input Control` | `dse._input-control` | `111:22` | C04 | In progress — visibility schema enabled and verified; internal contract not yet authored |
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

- **Contract:** deterministic private contract package, component/pattern schemas, `dse.button@1.0.0`, offline `contracts:validate`, no placeholder future contracts.
- **React API:** native Button with contract-backed `emphasis`, `tone`, `loading`, `loadingLabel`, `icon`, `iconPosition`, native `disabled`, forwarded native attributes, required visible `children`, and safe `type=button` default.
- **Visuals:** all contract token dependencies, no raw colors, logical CSS, legal emphasis/tone matrix, native/derived visual states.
- **Behavior:** focusable loading with `aria-busy` + `aria-disabled`, duplicate activation suppression, native disabled preservation, intrinsic normal/loading width, decorative logical icons, RTL-safe order.
- **Assets:** exact Figma loader source `86:11830`, deterministic CSS/SVG package output.
- **Storybook:** contract-backed controls and stories; Light/Dark × English/Arabic Chromium parity plus loading/disabled/RTL icon evidence reviewed against live Figma.
- **Packaging:** permanent clean-consumer CI packs tokens + React, rejects source/test/story/contract leakage, SSR-renders Button, and resolves public CSS/loader assets.
- **Final review corrections:** required-children mismatch and contract-default drift were caught by RED tests before the final C01 record.
- **Final HEAD:** `5514dcb5ff83cf90587fb27ecafb7cc972eec02f`; GitHub Actions run 61 PASS.
- **AI knowledge pack:** Button is recorded as validated with `contract_validation=passed`.
- **Review:** inline self-review APPROVED; no unresolved Critical or Important findings.

Detailed evidence: `docs/superpowers/plans/2026-09-16-button-react-progress.md`.

## C02 evidence summary

- **Figma audit:** canonical Icon Button `110:1339` re-audited live. Four 40 × 40 variants are present: default `110:1322`, hover `110:1327`, pressed `110:1331`, disabled `110:1335`; the icon is 20 × 20 and `focusVisible` remains an independent Figma representation control.
- **Public token mapping:** Figma-only `Component / Icon Render` foreground helpers were resolved to public semantic `fg/primary` and `fg/disabled` rather than exported. Hover, pressed and focus use public `action/ghost/hover`, `action/ghost/pressed` and `focus/default` roles.
- **Contract:** `dse.icon-button@1.0.0` requires `icon` and native `aria-label`, supports native `disabled` and forwarded native button attributes, and explicitly forbids public `state`, `focusVisible`, duplicate `accessibleLabel`, `loading`, `success` and `size` APIs.
- **React API:** native `<button>`, safe `type=button`, ref/native-attribute forwarding, required accessible name, decorative icon semantics and native disabled activation suppression.
- **Visuals:** fixed 40 × 40 target, 20 × 20 icon, token-driven radius/foreground/hover/pressed/focus/disabled styling, no raw colors and logical direction-safe CSS. No generic icon mirroring is introduced.
- **Storybook:** `Components/Controls/Icon Button` includes real Close, Clear Search and Disabled examples, English/Arabic accessible names and the existing Light/Dark × English/Arabic globals. Hover/pressed/focus are documented and exercised as derived CSS/browser states rather than fake public controls.
- **Packaging:** React package exports `IconButton`/`IconButtonProps`; built `styles.css` includes Icon Button; clean-consumer CI imports and SSR-renders the installed Icon Button tarball, verifies accessible name/safe type/decorative icon semantics and confirms packaged CSS.
- **RED/GREEN evidence:** contract RED run 62 on `462139f04184162c8e20b273efc9619ed17a3acd`; contract GREEN run 64 on `0e636b60756060fc284a46547a655d489ee2b0a9`; runtime/CSS RED run 66 on `8dcf7b34eaa3c05c0c4dde86c3d41a2a1183d753`.
- **Debug correction:** full-suite CI exposed an unstable `fileURLToPath(import.meta.url)` assumption in the new CSS test. GitHub Actions logs isolated `ERR_INVALID_URL_SCHEME`; the test harness now resolves from the package working directory. Production Icon Button code did not require correction.
- **Self-review hardening:** all contract-declared token dependencies are now checked directly against CSS; default enabled behavior is explicitly protected; compile-time guards keep `icon` and `aria-label` required and unsupported APIs absent.
- **Final HEAD:** `7c5e27ea123c31706d920bb5b6d6ffc1036c63b3`; GitHub Actions run 87 PASS with contract validation, 223-token validation/build, full tests, typecheck, Storybook production build and packed clean-consumer verification.
- **AI knowledge pack:** Icon Button is recorded as validated with `contract_validation=passed`.
- **Review:** inline self-review APPROVED; no unresolved Critical or Important findings.

## C03 evidence summary

- **Figma audit:** canonical Link `114:13` re-audited live. The component set contains `state=default|hover|focus|pressed`; each source variant is 24 px high, with semantic small-label typography. No disabled, visited, icon, size, or loading variant exists.
- **Public token mapping:** default/hover/pressed use public semantic `link/default`, `link/hover`, and `link/pressed`; focus uses public `focus/default`, focus border role, and `radius/sm`; the 24 px minimum target uses public `space/500`.
- **Contract:** `dse.link@1.0.0` requires visible `children`, forwards native anchor attributes, maps Figma label to children and interaction states to CSS, and explicitly forbids public `state`, `disabled`, `visited`, `icon`, `size`, and `loading` APIs.
- **React API:** native `<a>` with required visible children, ref/class/native-attribute forwarding, native pointer activation, and native Enter activation when `href` is supplied. No JavaScript interaction-state machine or automatic target/rel rewriting is introduced.
- **Visuals:** semantic small-label typography, 24 px minimum block size, token-driven default/hover/pressed colors, and a token-driven `:focus-visible` ring. CSS has no raw colors, visited styling, disabled styling, or physical left/right positioning rules.
- **Storybook:** `Components/Controls/Link` includes Playground, Long Label, explicit Arabic Label, and External Target examples. Only `children` and `href` are documented as controls; `target`/`rel` are demonstrated as ordinary native anchor attributes, while hover/pressed/focus remain derived browser states.
- **Packaging:** React package exports `Link`/`LinkProps`; built `styles.css` includes Link; clean-consumer CI imports and SSR-renders the installed Link tarball and verifies native anchor output, href/target/ARIA forwarding, visible content, and packaged CSS.
- **RED/GREEN evidence:** contract RED run 88 on `923451748735278278cc9427e81cc355c1fcbc9f`; contract GREEN run 90 on `16c6a0de5010932d68d76a884e82095f0838ebc3`; runtime/CSS RED run 92 on `24a135a92df8711492d4e3eebcbf2834e92d86d0`; runtime GREEN run 97 on `3dffe87c053842fb0ee8a92ff987685cce0c0457`; Storybook RED run 98 on `67d22dd2dad8d7faee9cfba9683224664db2b8de`; Storybook GREEN run 99 on `1235c98ade92d9dc1d42bbe24fe158863526eb14`.
- **Implementation/package HEAD:** `f137d77190dee78aba55744885015a95b5ecea8f`; GitHub Actions run 100 PASS with contract validation, 223-token validation/build, full tests, typecheck, Storybook production build and packed clean-consumer verification.
- **Final record HEAD:** `7e28ce06542e257a2e0edab492d3eec58dcc92e6`; GitHub Actions run 101 PASS.
- **AI knowledge pack:** Link is recorded as validated with `contract_validation=passed`.
- **Review:** inline self-review APPROVED; no unresolved Critical or Important findings.

## C04 evidence summary — in progress

- **Figma audit:** `_Input Control` `111:22` is 12 variants = `size=compact|default` × `state=default|hover|focus|disabled|invalid|invalid-focus`; compact is 40 px high and default is 44 px. Text Field `112:263` is 12 variants = six states × `content=empty|filled`, with `label`, `value`, `placeholder`, `supportingText`, `required`, and `showSupportingText` properties. Text Field uses the default 44 px internal shell.
- **Token audit:** `_Input Control` resolves to public surface/control-border/focus/disabled/negative-border roles, `shape/control`, and base/focus border roles. Text Field additionally uses `fg/primary`, `fg/secondary`, `fg/tertiary`, `fg/disabled`, `feedback/negative/fg`, semantic label/default typography, body/default typography, and body/small typography.
- **Visibility schema prerequisite:** component contracts now require `visibility=public|internal`; public IDs cannot begin `dse._`; internal IDs must begin `dse._`; internal contracts cannot declare a public implementation package; pattern dependencies resolve only against public component contracts. Existing Button, Icon Button, and Link contracts were migrated explicitly to `visibility=public` without runtime changes.
- **Visibility RED/GREEN evidence:** run 102 RED on `a496b8718b29b2406fb4f455a2463e2e35226121`; run 110 GREEN on exact extension HEAD `497116b7c96c7d126fd29bc9a69fded1c69d1dde` with full contracts/tokens/React tests, typecheck, Storybook build, and packed-consumer smoke.
- **Next gate:** author contract RED for `dse._input-control@1.0.0` and `dse.text-field@1.0.0`. No C04 component contract exists yet at this record point.

## Milestone completion rule

For every task/milestone record RED/GREEN evidence, contract validation, focused/full tests, typecheck/build, visual parity when applicable, packed-consumer proof when applicable, inline self-review verdict, corrections, and exact-HEAD CI. Do not mark a milestone complete with an unresolved gate.

Documentation/knowledge-only record commits after a verified implementation milestone must also pass PR CI before merge. The passing PR HEAD is the authoritative record check; it does not require another tracker mutation solely to record its own run number.

## Scope guard

This roadmap does not authorize npm publication, PR/main merges, automatic Figma/code generation, product backend/authorization/persistence, unreviewed variants, mobile-specific expansion beyond current responsive guidance, generic Table sorting/pagination/bulk selection, or placeholder contracts for future units. C04 is explicitly authorized and in progress. C05 must not start without explicit user authorization.
