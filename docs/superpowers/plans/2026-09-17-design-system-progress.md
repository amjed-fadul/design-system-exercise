# Design System Components + Patterns Progress Tracker

**Master roadmap:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md`  
**Contract architecture:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`  
**Planning branch:** `plan/all-components-patterns`  
**Foundations baseline:** `751ce383f392b24b8db0495fe221facf0a6eb4f6`  
**Figma source:** `tYCXBBYoQ92AUKVbND5WkG`  
**Status:** PLANNED — no component/pattern implementation from this master roadmap has started

## Progress summary

- Public components: **0 / 17 complete**
- Internal helpers governed with parent milestones: **0 / 6 complete**
- Product patterns: **0 / 5 complete**
- Overall public milestones: **0 / 22 complete**

## Component milestones

| ID | Component | Contract | Figma | Depends on | Status | Implementation SHA | Fresh review | CI exact HEAD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C01 | Button | `dse.button` | `93:1230` | contract infrastructure | Not started | — | — | — |
| C02 | Icon Button | `dse.icon-button` | `110:1339` | C01 package infrastructure | Not started | — | — | — |
| C03 | Link | `dse.link` | `114:13` | C01 package infrastructure | Not started | — | — | — |
| C04 | Text Field | `dse.text-field` | `112:263` | internal `_Input Control` | Not started | — | — | — |
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

Internal helper completion is recorded inside the parent public milestone, not as a separate public PR.

| Helper | Internal contract | Figma | Parent milestone | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| `_Input Control` | `dse._input-control` | `111:22` | C04 | Not started | — |
| `_Radio Option` | `dse._radio-option` | `116:174` | C06 | Not started | — |
| `_Navigation Item` | `dse._navigation-item` | `143:2948` | C13 | Not started | — |
| `_Breadcrumb Link Item` | `dse._breadcrumb-link-item` | `139:16` | C15 | Not started | — |
| `_Table Header` | `dse._table-header` | `152:3685` | C17 | Not started | — |
| `_Table Row` | `dse._table-row` | `152:3729` | C17 | Not started | — |

`_Button / Busy indicator` (`93:24`) is an implementation detail inside C01 and is not counted as an independent helper contract milestone.

## Pattern milestones

| ID | Pattern | Contract | Figma guide | Depends on | Status | Implementation SHA | Fresh review | CI exact HEAD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Application Shell | `dse.pattern.application-shell` | `68:494` | C13-C16; content can host C17 | Not started | — | — | — |
| P02 | Form Submit and Recover | `dse.pattern.form-submit-recover` | `68:2` | C01, C04, C06, C07, C10 | Not started | — | — | — |
| P03 | Unsaved-change Guard | `dse.pattern.unsaved-change-guard` | `68:371` | C01, C10 | Not started | — | — | — |
| P04 | Edit, Save and Recover | `dse.pattern.edit-save-recover` | `68:240` | C01, C06, C07, C11, P03 | Not started | — | — | — |
| P05 | Search, List and Detail | `dse.pattern.search-list-detail` | `68:121` | C05, C11, C12, C17, P01, P03, P04 | Not started | — | — | — |

## Required evidence after every milestone

Record these before the next milestone starts:

- starting HEAD;
- resulting HEAD and implementation commit SHA;
- contract ID + version;
- exact files changed;
- focused RED command/result;
- focused GREEN command/result;
- package test result;
- package typecheck result;
- relevant package build result;
- `pnpm contracts:validate` result;
- full `pnpm test` result;
- full `pnpm typecheck` result;
- Storybook production-build result;
- visual parity contexts checked;
- packed-consumer result when a public package changed;
- fresh reviewer identity and verdict;
- correction commit(s), if any;
- GitHub Actions run/status on exact final HEAD;
- remaining risk/blocker.

A milestone must not be marked `Complete` while any required focused test, typecheck, build, fresh review, or exact-HEAD CI gate is unresolved.

## Global final acceptance checklist

- [ ] 17/17 public component contracts validate.
- [ ] 6/6 internal helper contracts are present only where needed and remain non-public.
- [ ] 5/5 pattern contracts validate.
- [ ] `@design-system-exercise/react` exports exactly the approved public components and no underscore helper.
- [ ] `@design-system-exercise/patterns` exports exactly the approved public patterns.
- [ ] No public API directly copies Figma-only state controls unless its contract explicitly approves that mapping.
- [ ] All component CSS consumes public token variables and contains no unauthorized raw foundation color values.
- [ ] Light/Dark Storybook coverage exists for every public component.
- [ ] English/Arabic/RTL Storybook coverage exists for every text-bearing public component.
- [ ] Wide/Narrow coverage exists for every responsive pattern that declares it.
- [ ] All contract/component/pattern tests pass.
- [ ] Full repo typecheck passes.
- [ ] Storybook production build passes.
- [ ] Clean consumer can install packed tokens, React, and patterns packages and render representative exports.
- [ ] AI knowledge pack references validated contract IDs only after those contracts exist.
- [ ] Fresh final system review reports no unresolved Critical/Important findings.
- [ ] GitHub Actions passes on the exact final system HEAD.

## Scope guard

This roadmap does not authorize:

- npm publication;
- merging PRs or `main` without separate instruction;
- automatic Figma-to-code or code-to-Figma generation;
- a generic contract CLI/service;
- product backend, authorization, persistence, or real data services;
- new component variants not present in a reviewed contract change;
- mobile-specific components beyond the current responsive pattern guidance;
- sorting, pagination, bulk selection, or generic data-grid behavior for Table;
- fake placeholder contracts for future components/patterns.