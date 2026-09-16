# Product Patterns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Execute P01-P05 sequentially unless the master dependency graph explicitly permits otherwise. Every pattern begins with a validated pattern contract and ends with fresh review + exact-HEAD CI.

**Goal:** Implement the five governed Team & Access product patterns as reusable compositions of approved React components without moving backend/product authority into the design-system packages.

**Architecture:** `@design-system-exercise/patterns` composes public components from `@design-system-exercise/react`. Pattern contracts govern component dependencies, state ownership, transitions, invariants, exits, responsive behavior, and forbidden capabilities. Runtime pattern code may own draft/query/request UI state, but product applications supply actual records, permissions, policy, navigation adapters, and async operations.

**Tech Stack:** React, TypeScript, reducer/state-machine-style pure models where useful, Vitest, Testing Library, Storybook interaction stories, Ajv contract validation.

**Spec:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md`, `docs/superpowers/specs/2026-09-17-component-contracts-design.md`, AI knowledge pack pattern guidance, Figma pattern frames `68:2`, `68:121`, `68:240`, `68:371`, `68:494`.

## Global Constraints

- Begin patterns only after C01-C17 are accepted unless a dedicated plan proves every dependency it needs is already complete.
- `packages/patterns` becomes a real public package at P01; it depends on `@design-system-exercise/react` and never reimplements primitives.
- Product/backend authority remains outside patterns: records, authorization, last-admin policy, duplicate-invite policy, persistence, cancellation APIs, idempotency, real search services.
- Storybook uses deterministic fixtures and fake async adapters; fixture behavior is not production backend logic.
- Pattern reducers/models must be testable without rendering.
- No pattern may use a component prop/value absent from its validated component contract.

---

## P01 — Application Shell

**Figma guide:** `68:494`

**Dependencies:** Sidebar, Top Navbar, Breadcrumbs/Page Heading; content region may host Table and other public content.

**Contract:** `dse.pattern.application-shell@1.0.0`

**Files:**
- `packages/contracts/patterns/application-shell.contract.json`
- `packages/contracts/tests/application-shell.contract.test.ts`
- activate `packages/patterns/package.json`
- `packages/patterns/tsconfig.json`
- `packages/patterns/vitest.config.ts`
- `packages/patterns/src/application-shell/ApplicationShell.tsx`
- `packages/patterns/src/application-shell/ApplicationShell.css`
- `packages/patterns/src/application-shell/ApplicationShell.test.tsx`
- `packages/patterns/src/index.ts`
- `apps/storybook/src/patterns/ApplicationShell.stories.tsx`
- lockfile + Storybook dependency updates

**Public API:**

```ts
export interface ApplicationShellProps {
  sidebar: React.ReactNode;
  topNavbar: React.ReactNode;
  pageHeading?: React.ReactNode;
  children: React.ReactNode;
  viewportMode?: 'auto' | 'expanded' | 'compact';
}
```

`auto` uses the documented 1200px expanded-navigation threshold. `expanded/compact` are deterministic Storybook/test overrides, not alternate product states. The shell owns layout regions and responsive placement only; it does not own query/draft/request state.

**Contract invariants:**
- expanded at >=1200 CSS px, compact below 1200 when `viewportMode=auto`;
- changing layout mode does not remount/reset child state;
- logical inline placement supports RTL;
- main region scrolls when viewport height is short;
- Sidebar width/mode and main inset match approved token/layout contract rather than raw copied values.

**Acceptance:** contract RED/GREEN; render tests for landmarks/region order; browser resize test preserving child state; 1199/1200 boundary Storybook proof; 960-1440 desktop evidence; short-window scroll story; full verification; commit `feat(patterns): add Application Shell`.

---

## P02 — Form Submit and Recover

**Figma guide:** `68:2`

**Dependencies:** Dialog, Text Field, Radio Group, Button, Inline Feedback.

**Contract:** `dse.pattern.form-submit-recover@1.0.0`

**Model:**

```ts
export type SubmitStatus = 'idle' | 'validating' | 'submitting' | 'failed' | 'succeeded' | 'unknown';

export interface InviteDraft {
  email: string;
  role: string;
}

export interface InviteValidationErrors {
  email?: string;
  role?: string;
}

export interface FormSubmitRecoverState {
  draft: InviteDraft;
  errors: InviteValidationErrors;
  status: SubmitStatus;
  message?: string;
}
```

**Public pattern API:**

```ts
export interface FormSubmitRecoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: readonly { value: string; label: string; description?: string }[];
  initialDraft?: Partial<InviteDraft>;
  validate: (draft: InviteDraft) => InviteValidationErrors;
  submit: (draft: InviteDraft) => Promise<{ ok: true } | { ok: false; message: string } | { ok: null; message?: string }>;
  onSuccess?: (draft: InviteDraft) => void;
}
```

Product supplies validation policy + actual async operation. Pattern owns draft retention and UI request lifecycle.

**Required transitions:**
- submit -> validate;
- validation errors -> idle with errors and **no request call**;
- valid -> submitting;
- submitting -> failed/succeeded/unknown;
- failed -> retry keeps exact draft;
- succeeded -> call `onSuccess` once;
- first 10 seconds unresolved: freeze edits/duplicate submit;
- still unresolved after policy threshold: show “Still checking the result”; Close does not claim cancellation and preserves operation/draft for reconciliation.

**Acceptance tests:** pure model/reducer tests first; component interaction tests prove no request on validation failure, draft retention after known failure, role retention, retry exact payload, duplicate suppression, unknown outcome wording. Storybook deterministic member/admin failure-then-retry fixtures and unknown-result fixture. Commit `feat(patterns): add form submit recovery`.

---

## P03 — Unsaved-change Guard

**Figma guide:** `68:371`

**Dependencies:** Dialog, Button.

**Contract:** `dse.pattern.unsaved-change-guard@1.0.0`

**Model:**

```ts
export interface UnsavedChangeGuardState<TExit> {
  open: boolean;
  intendedExit: TExit | null;
}
```

**Public API:**

```ts
export interface UnsavedChangeGuardProps<TExit> {
  open: boolean;
  intendedExit: TExit;
  onKeepEditing: () => void;
  onDiscard: (exit: TExit) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
}
```

**Invariants:**
- intended exit is captured before guard opens;
- Keep editing closes guard and restores exact originating draft/context;
- Escape behaves like Keep editing unless the contract is explicitly amended;
- Discard removes draft at the caller boundary and follows captured exit;
- Discard never changes last confirmed saved value;
- guard does not itself navigate; it returns the captured exit to caller.

**Acceptance:** tests for Keep editing, Escape, Discard exact exit, no mutation of caller saved state, accessible Dialog semantics. Storybook wide/searched/narrow exit examples using typed exit fixtures. Commit `feat(patterns): add unsaved-change guard`.

---

## P04 — Edit, Save and Recover

**Figma guide:** `68:240`

**Dependencies:** Side Panel, Radio Group, Button, Inline Feedback, P03 guard; uses Application Shell responsive context.

**Contract:** `dse.pattern.edit-save-recover@1.0.0`

**Model:**

```ts
export type SaveStatus = 'idle' | 'saving' | 'failed' | 'succeeded' | 'unknown';

export interface EditSaveRecoverState<TValue> {
  saved: TValue;
  draft: TValue;
  status: SaveStatus;
  message?: string;
}
```

**Public API:**

```ts
export interface EditSaveRecoverProps<TValue extends string> {
  savedValue: TValue;
  options: readonly { value: TValue; label: string; description?: string }[];
  onSave: (draft: TValue) => Promise<{ ok: true; value?: TValue } | { ok: false; message: string } | { ok: null; message?: string }>;
  onCommit: (value: TValue) => void;
  onExit: () => void;
  presentation: 'wide-modal' | 'narrow-page';
  title: React.ReactNode;
  identity?: React.ReactNode;
}
```

**Invariants:**
- selecting option changes draft only;
- saved value remains unchanged until confirmed success;
- known failure retains draft and saved separately;
- retry submits the same draft unless user edits after failure;
- success commits draft before exit/update callback;
- dirty/failed exit invokes P03;
- reverting draft to saved returns clean state;
- wide presentation wraps Side Panel in modal semantics at pattern level;
- narrow presentation is a page and must not inherit modal focus trap.

**Acceptance:** reducer tests for saved/draft separation; interaction tests for failure/retry/success/guard; wide + narrow Storybook flows; resize/presentation switch preserves state; unknown outcome uses same pending contract as P02. Commit `feat(patterns): add edit save recovery`.

---

## P05 — Search, List and Detail

**Figma guide:** `68:121`

**Dependencies:** Search Field, Table, Empty State, Side Panel, P01 shell, P03 guard, P04 edit/save flow.

**Contract:** `dse.pattern.search-list-detail@1.0.0`

**Generic record boundary:**

```ts
export interface SearchListRecord {
  id: string;
  primary: React.ReactNode;
  secondary: React.ReactNode;
  status: React.ReactNode;
  actionLabel: string;
  searchText: string;
}

export interface SearchListDetailProps<TRecord extends SearchListRecord> {
  records: readonly TRecord[];
  query: string;
  onQueryChange: (query: string) => void;
  selectedId?: string | null;
  onSelectedIdChange: (id: string | null) => void;
  renderDetail: (record: TRecord) => React.ReactNode;
  renderEmptyActions?: () => React.ReactNode;
  resultLabel: (count: number) => string;
}
```

Product supplies records and filtering strategy in production. Storybook fixture may use deterministic local filtering (`sara`, `zoe`) only as demo evidence.

**Invariants:**
- query and selection are separate state;
- opening/closing detail retains query;
- no-results state is Empty State, not validation error;
- clear query restores full list;
- selected detail does not rewrite search query;
- wide detail uses modal-wrapper behavior defined by P04; narrow detail uses page presentation;
- dirty/failed detail exit uses P03;
- saved edit updates the visible list before closing/returning;
- product sorting/pagination/bulk actions remain absent.

**Acceptance:** controlled state tests, deterministic local fixture Storybook for one-result/no-result/clear/detail/edit-failure/retry/success, wide/narrow state continuity, result count announcement test, RTL mixed-direction search fixture. Final system integration review follows this milestone. Commit `feat(patterns): add search list detail`.

---

## Patterns package and final CI gate

At P01, activate `@design-system-exercise/patterns` as an npm-ready ESM package with React peer dependency and `@design-system-exercise/react` workspace dependency. It must not depend on `@design-system-exercise/contracts` at runtime.

After P05, run:

```bash
pnpm install --frozen-lockfile
pnpm contracts:validate
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Then pack tokens, React, and patterns into one clean scratch consumer. The consumer must import representative component exports plus all five pattern exports, resolve public CSS, and SSR-render at least ApplicationShell and one form/detail pattern without accessing workspace source paths.

A final fresh system reviewer must inspect contract boundaries, package exports, pattern state ownership, forbidden capability leakage, and Figma/Storybook evidence before the roadmap can be considered complete.