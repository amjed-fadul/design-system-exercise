# Button Contract + React Implementation Progress

**Plan:** `docs/superpowers/plans/2026-09-16-button-react-implementation.md`  
**Contract architecture:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`  
**Figma source:** Button component set `93:1230` in `tYCXBBYoQ92AUKVbND5WkG`  
**Planned contract:** `dse.button@1.0.0`  
**Foundations base:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Planning branch:** `plan/button-react-milestone`  
**Implementation status:** PLANNED — implementation has not started  
**Scope:** Contract infrastructure + Button only

## Branch and PR strategy

The planning branch descends from the verified foundations HEAD. When implementation starts, create the implementation branch from the final planning-branch HEAD so the contract spec, implementation plan, and progress tracker travel with the work.

Until foundations PR #1 is merged, the Button PR should be stacked against `feat/foundations-storybook`. After PR #1 lands, retarget the Button PR to `main` without changing implementation history.

Do not merge PR #1, merge Button work, or publish npm packages as part of executing this plan unless separately requested.

## Planning + knowledge-pack update evidence

The contract architecture was approved and incorporated before implementation starts.

Figma AI knowledge pack updates completed on 2026-09-17:

- added `contracts.md · governed machine boundary` at frame `3032:19`;
- updated `INDEX.md` to v1.5 and added contract-first reading/authority rules;
- regenerated `foundations.md` from the live Figma variable inventory: **247 local variables / 15 collections**;
- explicitly distinguished that Figma inventory from the **223 public code tokens** in the foundations milestone;
- refreshed Button from the live source: **60 variants = 3 emphasis × 2 tone × 5 state × 2 iconPosition**;
- added live Button `tone=default|critical` facts and public-vs-Figma representation mapping;
- updated controls, feedback/surfaces, structure, pattern guidance, agent instructions, checks/limitations, references, and intent-map terminology;
- added Equinor Component Contracts as governance reference `CC01`;
- replaced stale prior-file source links with current file `tYCXBBYoQ92AUKVbND5WkG`;
- final Figma scan found zero occurrences of the stale prior file key, `exact source contracts`, `Current pattern contracts`, `patterns.md contract`, `222 variables`, or `not a running React library`.

This documentation update does **not** count as contract implementation evidence. `dse.button@1.0.0` remains planned/unvalidated until Task 1 creates the JSON contract and `pnpm contracts:validate` passes.

## Task tracker

| Task | Deliverable | Status | Contract verification | Implementation commit | Fresh review | Verification evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Contract schemas + validator + `dse.button@1.0.0` | Not started | — | — | — | — |
| 2 | React package + contract-backed semantic Button API | Not started | — | — | — | — |
| 3 | Token-driven visual states within contract | Not started | — | — | — | — |
| 4 | Loading, icons, intrinsic width, RTL + package assets | Not started | — | — | — | — |
| 5 | Storybook contract docs + four-context Figma parity | Not started | — | — | — | — |
| 6 | CI, packed-consumer proof + final milestone gate | Not started | — | — | — | — |

**Progress:** 0 / 6 implementation tasks complete.

## Required record after every task

Update this document before starting the next task with:

- starting HEAD;
- resulting HEAD and commit SHA;
- exact changed files;
- contract IDs/versions added or changed;
- exact `contracts:validate` result where relevant;
- focused tests run and their result;
- relevant package/repo typecheck/build result;
- fresh reviewer identity and verdict;
- any correction commit produced by review;
- remaining known risk or blocker.

A task is not `Complete` while contract validation, focused tests, typecheck/build, or fresh review required by that task is unresolved.

## Contract governance checklist

- [ ] `component-contract.schema.json` exists and rejects unknown/malformed governed fields.
- [ ] `pattern-contract.schema.json` exists and validates real pattern fixtures without creating fake pattern contracts.
- [ ] `pnpm contracts:validate` is deterministic and offline.
- [ ] Exactly one real component contract exists in this milestone: `dse.button@1.0.0`.
- [ ] No placeholder future component contracts exist.
- [ ] No product pattern contract is invented before its implementation milestone.
- [ ] `dse.button` records current Figma source `tYCXBBYoQ92AUKVbND5WkG / 93:1230`.
- [ ] Button contract legal enums are exactly `emphasis=primary|secondary|text`, `tone=default|critical`, `iconPosition=leading|trailing`.
- [ ] Contract explicitly excludes public `state`, `focusVisible`, `showIcon`, `size`, `danger`, and `success` APIs.
- [ ] Contract distinguishes native/derived/public/Figma-only state representation.
- [ ] Contract token dependencies contain only public token namespaces, not excluded Figma internal collections.
- [ ] React Button package has no production dependency on the private contracts package.

## Final verification checklist

- [ ] `pnpm contracts:validate` passes on final HEAD.
- [ ] Contracts package tests pass.
- [ ] Contracts package typecheck passes.
- [ ] React package build passes.
- [ ] Button focused tests pass, including contract parity tests.
- [ ] Full `pnpm test` passes.
- [ ] Full `pnpm typecheck` passes.
- [ ] `pnpm tokens:validate` passes with the existing 223 public code-token contract unchanged unless an explicitly reviewed foundation amendment was required.
- [ ] `pnpm tokens:build` passes.
- [ ] Storybook contract-control test passes.
- [ ] Storybook production build passes.
- [ ] Light + English manually matches Figma.
- [ ] Dark + English manually matches Figma.
- [ ] Light + Arabic/RTL manually matches Figma.
- [ ] Dark + Arabic/RTL manually matches Figma.
- [ ] Packed token package installs in a clean scratch consumer.
- [ ] Packed React package installs in the same clean scratch consumer.
- [ ] Scratch consumer can SSR-render Button through the public package export.
- [ ] Public React stylesheet export resolves from the packed package.
- [ ] React tarball does not contain source contracts or contract package files.
- [ ] Fresh final review reports no unresolved findings.
- [ ] GitHub Actions passes on the exact final implementation HEAD.

## AI knowledge-pack alignment record

The Figma AI knowledge pack is a guidance/evidence surface, not the contract source of truth. It now distinguishes:

```text
Contract       = legal supported boundary
Implementation = runtime behavior
Figma snapshot = factual design representation
Knowledge      = when/why/how to choose supported capabilities
Reference      = external principle/provenance
```

Current inventory language distinguishes 247 local Figma variables across 15 collections from the 223 public code tokens in the foundations milestone; those inventories are intentionally not assumed to be 1:1 because Figma contains internal/helper variables excluded from the public code API.

## Scope guard

The following remain outside this plan:

- implementation of Icon Button, Link, fields, Radio Group, feedback components, surfaces, navigation components, Table, and all product patterns;
- placeholder contracts for those future units;
- npm publication;
- contract-driven React/Figma generation;
- Code Connect rollout;
- automatic Figma/code synchronization;
- loader animation;
- new Button size variants;
- `danger` or `success` Button variants;
- changes to the existing 223 public foundation-token model unless a missing public semantic is proven and separately reviewed.

## Current state

The contract architecture, six-task plan, progress tracker, and Figma AI knowledge pack are aligned for a contract-first Button milestone. No production contract package, React implementation, or CI contract gate has been implemented yet. The first execution action remains Task 1: contract schemas, deterministic validator, and the real `dse.button@1.0.0` contract.
