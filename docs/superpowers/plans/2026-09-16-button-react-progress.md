# Button React Implementation Progress

**Plan:** `docs/superpowers/plans/2026-09-16-button-react-implementation.md`  
**Figma source:** Button component set `93:1230`  
**Foundations base:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Planning branch:** `plan/button-react-milestone`  
**Implementation status:** PLANNED — implementation has not started  
**Scope:** Button only

## Branch and PR strategy

The planning branch descends from the verified foundations HEAD. When implementation starts, create the implementation branch from the final planning-branch HEAD so both planning documents travel with the work.

Until foundations PR #1 is merged, the Button PR should be stacked against `feat/foundations-storybook`. After PR #1 lands, retarget the Button PR to `main` without changing implementation history.

Do not merge PR #1, merge the Button work, or publish npm packages as part of executing this plan unless separately requested.

## Task tracker

| Task | Deliverable | Status | Implementation commit | Fresh review | Verification evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Activate React package + semantic Button API | Not started | — | — | — |
| 2 | Token-driven Button visual contract | Not started | — | — | — |
| 3 | Loading, icons, width preservation, RTL-safe behavior | Not started | — | — | — |
| 4 | Storybook documentation + four-context Figma parity | Not started | — | — | — |
| 5 | Package build, packed-consumer CI, final milestone gate | Not started | — | — | — |

**Progress:** 0 / 5 tasks complete.

## Required record after every task

Update this document before starting the next task with:

- starting HEAD;
- resulting HEAD and commit SHA;
- exact changed files;
- focused tests run and their result;
- relevant package/repo typecheck result;
- fresh reviewer identity and verdict;
- any correction commit produced by review;
- remaining known risk or blocker.

A task is not `Complete` while its focused test, typecheck, or fresh review is unresolved.

## Final verification checklist

- [ ] React package build passes.
- [ ] Button focused tests pass.
- [ ] Full `pnpm test` passes.
- [ ] Full `pnpm typecheck` passes.
- [ ] `pnpm tokens:validate` passes with the existing 223-token contract unchanged unless an explicitly reviewed foundation amendment was required.
- [ ] `pnpm tokens:build` passes.
- [ ] Storybook production build passes.
- [ ] Light + English manually matches Figma.
- [ ] Dark + English manually matches Figma.
- [ ] Light + Arabic/RTL manually matches Figma.
- [ ] Dark + Arabic/RTL manually matches Figma.
- [ ] Packed token package installs in a clean scratch consumer.
- [ ] Packed React package installs in the same clean scratch consumer.
- [ ] Scratch consumer can SSR-render Button through the public package export.
- [ ] Public React stylesheet export resolves from the packed package.
- [ ] Fresh final review reports no unresolved findings.
- [ ] GitHub Actions passes on the exact final implementation HEAD.

## Scope guard

The following remain outside this plan:

- Icon Button, Link, fields, Radio Group, feedback components, surfaces, navigation components, Table, and all patterns;
- npm publication;
- Figma edits or automatic Figma/code synchronization;
- Code Connect setup;
- loader animation;
- new Button size variants;
- `danger` or `success` Button variants;
- changes to the existing 223 public foundation-token model unless a missing public semantic is proven and reviewed first.

## Current state

No implementation code has been changed by this planning work. The first execution action is Task 1 from the linked implementation plan.
