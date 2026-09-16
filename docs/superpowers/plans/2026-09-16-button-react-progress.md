# Button Contract + React Implementation Progress

**Plan:** `docs/superpowers/plans/2026-09-16-button-react-implementation.md`  
**Contract architecture:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`  
**Figma source:** Button component set `93:1230` in `tYCXBBYoQ92AUKVbND5WkG`  
**Contract:** `dse.button@1.0.0`  
**Foundations base:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Planning branch:** `plan/all-components-patterns`  
**Implementation branch:** `feat/contracts-button`  
**Implementation status:** IN PROGRESS — Tasks 1-4 complete; Task 5 next  
**Scope:** Contract infrastructure + Button only

## Review policy

Per user direction, this implementation uses no sub-agents. Reviews are performed inline by ChatGPT and recorded as **inline self-review**, never as independent review.

## Task tracker

| Task | Deliverable | Status | Contract verification | Implementation commit | Review | Verification evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Contract schemas + validator + `dse.button@1.0.0` | Complete | PASS | `cb6e187` + corrections | Inline self-review APPROVED | RED run 6; GREEN runs 9/11; reviewed HEAD `bd114d4` PASS |
| 2 | React package + contract-backed semantic Button API | Complete | PASS | `f632aa8` + export `04d5474` | Inline self-review APPROVED | RED `fc382d1` / run 23; GREEN `04d5474` / run 25 PASS |
| 3 | Token-driven visual states within contract | Complete | PASS | CSS `81c9804` + class binding `bfa9b28` | Inline self-review APPROVED | RED `8a1d8a0` / run 28; GREEN `bfa9b28` / run 30 PASS |
| 4 | Loading, icons, intrinsic width, RTL + package assets | Complete | PASS | behavior/assets through `e457b65`; React build CI gate `9f2572b` | Inline self-review APPROVED; no Critical/Important findings | RED `dcc425c` / run 33 (+ busy guard RED run 35); GREEN `9f2572b` / run 40 PASS |
| 5 | Storybook contract docs + four-context Figma parity | Not started | — | — | — | — |
| 6 | CI, packed-consumer proof + final milestone gate | Not started | — | — | — | — |

**Progress:** 4 / 6 implementation tasks complete.

## Task 1 evidence

- Correct contract RED captured; `dse.button@1.0.0`, schemas and validator implemented.
- Ajv type correction followed root-cause analysis.
- Permanent `contracts:validate` CI gate added.
- Reviewed HEAD `bd114d4fb324ed9123f0f1264e8fa10c5cd67237`, CI run 11 PASS.
- Inline self-review APPROVED.

## Task 2 evidence

- Correct RED HEAD `fc382d12c37b805697adf71b75085784952b3b6e`, CI run 23: 5/5 intended failures from absent Button module.
- GREEN implementation `f632aa80307d26c0cafcf15470aa445bb54da539`; public barrel `04d5474c5264d960c6407c8165ae4f04c7b7a985`.
- CI run 25 on exact `04d5474`: PASS across contracts, tokens, React tests, typecheck and Storybook build.
- Inline self-review APPROVED.

## Task 3 evidence

- RED HEAD `8a1d8a0a14759922ebbadea5614c7000771a98f4`, CI run 28: existing API/contract tests stayed green; all 3 visual-contract tests failed only because `Button.css` did not exist.
- GREEN CSS implementation `81c9804427446a4f1e5220546f14cfa315c24ac7`; Button class binding `bfa9b28e961431b7b06ab3ec13e01bd3667d7c1a`.
- CI run 30 on exact `bfa9b28`: PASS.
- Inline self-review APPROVED.

## Task 4 evidence

- RED HEAD `dcc425ccc208332ead2b0c0e037018ef3456c077`, CI run 33: prior tests remained green; 4 Task-4 failures proved missing intrinsic layering, loading accessible state, icon composition, and disabled+loading behavior. A separate busy-state CSS guard was added test-first and observed red in run 35.
- Exact loader source was read from Figma node `86:11830` using the Figma Plugin API `SVG_STRING` export and stored at `packages/react/src/assets/loader-circle.svg` without redrawing its path.
- Runtime behavior implemented from `8bb61c2`: loading remains focusable, sets `aria-busy=true` + `aria-disabled=true`, blocks consumer activation/default action, and preserves native disabled when `disabled` is also true.
- Normal/loading content layers occupy the same intrinsic grid cell; inactive layer uses `visibility:hidden` + `aria-hidden`, never `display:none`.
- Optional icons are decorative, render only when supplied, and use logical DOM order for leading/trailing; flex/inherited direction handles RTL without left/right swapping.
- The exact black source SVG is used as a CSS mask inside a `currentColor` busy glyph, preserving source geometry while inheriting the Button foreground across default/critical and light/dark contexts.
- Build copies `Button.css` to `dist/styles.css` and the exact loader to `dist/assets/loader-circle.svg`; missing sources fail via `copyFile`.
- Permanent CI now runs `pnpm --filter @design-system-exercise/react build` before tests.
- GREEN HEAD `9f2572b5039e25d1e020fb8c4fcb25049dfbbeb4`, CI run 40: PASS — frozen install, contract validation, 223-token validate/build, React package build, all tests, full typecheck, Storybook production build, existing token consumer smoke.
- Inline self-review: APPROVED; no unresolved Critical/Important findings.

## Contract governance checklist

- [x] Deterministic component/pattern schemas and validation.
- [x] Exactly one real C01 contract: `dse.button@1.0.0`.
- [x] Current Figma source/legal enums represented accurately.
- [x] Figma-only/unsupported keys excluded from public React API.
- [x] React package has no production dependency on private contracts.
- [x] Button visual CSS uses governed public token variables and logical properties only.
- [x] Loading, icon composition, intrinsic width, RTL-safe layout and deterministic package assets implemented.
- [ ] Storybook contract documentation + four-context parity — Task 5.
- [ ] Packed React consumer proof + final milestone gate — Task 6.

## Scope guard

Icon Button, Link, fields, Radio Group, feedback/surface/navigation/data-display components, patterns, npm publication, contract-driven Figma/React generation, Code Connect, and new Button variants remain outside this C01 plan.
