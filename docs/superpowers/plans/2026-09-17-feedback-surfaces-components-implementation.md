# Feedback + Surfaces Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Execute C07-C12 one public milestone at a time and update the master progress tracker after each accepted milestone.

**Goal:** Implement Inline Feedback, Avatar, Status Badge, Dialog, Side Panel, and Empty State with validated contracts, runtime semantics, Storybook coverage, and Figma parity.

**Architecture:** These components are public React components. Feedback components present authored state supplied by product/pattern code; surface components own composition and local interaction semantics but do not absorb request/business state. Dialog is modal; Side Panel is explicitly non-modal unless a pattern wraps it in modal behavior.

**Tech Stack:** React, TypeScript, plain CSS custom properties, Vitest, Testing Library, Storybook, Ajv contract validation.

**Spec:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md` and `docs/superpowers/specs/2026-09-17-component-contracts-design.md`.

## Global Constraints

- Sources: Inline Feedback `127:30`, Avatar `128:14`, Status Badge `128:1821`, Dialog `133:6`, Side Panel `137:2`, Empty State `131:2`.
- Contract-valid presentation never infers product outcome. Product/pattern code supplies actual state.
- Dialog and Side Panel composition slots accept public React content; they do not gain submit/request props.
- Side Panel remains non-modal at component level.
- All CSS uses public tokens + local private decisions only.

---

## C07 — Inline Feedback

**Live Figma facts:** title/message/showTitle and `intent=error|success`. No warning/info/loading/dismiss/action slot exists.

**Files:**
- `packages/contracts/components/inline-feedback.contract.json`
- `packages/contracts/tests/inline-feedback.contract.test.ts`
- `packages/react/src/inline-feedback/InlineFeedback.tsx`
- `packages/react/src/inline-feedback/InlineFeedback.css`
- `packages/react/src/inline-feedback/InlineFeedback.test.tsx`
- `apps/storybook/src/components/InlineFeedback.stories.tsx`
- modify public React barrel

**Public API:**

```ts
export type InlineFeedbackIntent = 'error' | 'success';
export interface InlineFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  intent: InlineFeedbackIntent;
  title?: React.ReactNode;
  children: React.ReactNode;
  announce?: 'polite' | 'assertive' | 'off';
}
```

`announce` controls runtime live-region behavior without inventing a Figma visual variant. Default: error -> assertive; success -> polite. Contract forbids warning/info/loading/dismiss/action APIs.

**Acceptance:** contract RED/GREEN; runtime tests for role/live behavior, no duplicate accessible title, long message wrapping; Storybook error/success/titleless/Arabic; full verification; fresh review; commit `feat(react): add Inline Feedback`.

---

## C08 — Avatar

**Live Figma facts:** initials text, `size=sm|lg`, `content=initials|fallback`. No photo/status/role/verified/selected variants.

**Files:** contract/test + `packages/react/src/avatar/Avatar.tsx`, `Avatar.css`, `Avatar.test.tsx`, Storybook story, public barrel.

**Public API:**

```ts
export type AvatarSize = 'sm' | 'lg';
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  initials?: string;
  size?: AvatarSize;
  'aria-label'?: string;
}
```

When initials are absent, render the governed fallback glyph/shape from the design source. If `aria-label` is omitted, Avatar is decorative (`aria-hidden=true`); if supplied, expose meaningful image-like semantics. Do not infer initials from a person name in v1.

**Acceptance:** contract forbids photo/online/role/status; tests cover initials/fallback/decorative/labeled behavior; Storybook sm/lg/fallback/Arabic context; verification; commit `feat(react): add Avatar`.

---

## C09 — Status Badge

**Live Figma facts:** only `label` text property. Product labels like Active/Invitation pending are data.

**Files:** contract/test + `StatusBadge.tsx/css/test`, Storybook, public barrel.

**Public API:**

```ts
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}
```

Contract forbids tone/status enum/size/icon/dismiss/selected APIs. Component is non-interactive and does not announce changes by itself.

**Acceptance:** tests prove plain text semantics and native attr forwarding; Storybook uses multiple product-supplied labels without variants; verification; commit `feat(react): add Status Badge`.

---

## C10 — Dialog

**Live Figma facts:** title, description, showDescription, showClose, Body slot, Actions slot.

**Files:**
- contract/test
- `packages/react/src/dialog/Dialog.tsx`
- `Dialog.css`
- `Dialog.test.tsx`
- `Dialog.stories.tsx`
- public barrel

**Public API:**

```ts
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showClose?: boolean;
  closeLabel?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}
```

Use a native `<dialog>` when browser behavior and testability satisfy the contract; otherwise implement equivalent `role="dialog"`, `aria-modal="true"` semantics with explicit focus management. The dedicated implementation plan must keep one choice consistently across runtime/tests.

Contract runtime requirements: accessible title relationship, optional description relationship, background inertness while open, initial focus, contained Tab navigation, Escape close when allowed, focus restoration, named close button. Contract forbids `onSubmit`, `requestStatus`, business outcomes, and a visual `state` prop.

**Acceptance tests:** open/close, Escape, close button label, title/description IDs, focus entry/containment/restoration, action/body composition. Storybook uses Button actions but Dialog does not interpret them. Full verification; commit `feat(react): add Dialog`.

---

## C11 — Side Panel

**Live Figma facts:** eyebrow, showClose, Header/Body/Actions slots. Component guidance explicitly says Side Panel itself does not establish modality.

**Files:** contract/test + `SidePanel.tsx/css/test`, Storybook, public barrel.

**Public API:**

```ts
export interface SidePanelProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showClose?: boolean;
  closeLabel?: string;
  onClose?: () => void;
}
```

Render a semantic complementary/section surface, not `aria-modal`. Body must own the scroll region when constrained; header/actions remain structurally separate. Contract forbids `modal`, focus trap, request state, and product selection APIs.

**Acceptance:** tests confirm non-modal semantics, close callback, slot order, scroll/body classes, no focus trap; Storybook wide panel + long body + Arabic/RTL; verification; commit `feat(react): add Side Panel`.

---

## C12 — Empty State

**Live Figma facts:** Actions slot, icon swap/showIcon, title, body/showBody.

**Files:** contract/test + `EmptyState.tsx/css/test`, Storybook, public barrel.

**Public API:**

```ts
export interface EmptyStateProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}
```

Presence of `icon` derives icon visibility. Component represents absence only; error/loading/pending are forbidden semantic uses and not variants. Actions are composed public Button/Link elements.

**Acceptance:** contract forbids `state=error|loading`; runtime tests for optional icon/body/actions and heading relationship; Storybook no-results, empty-directory, actionless, Arabic; verification; commit `feat(react): add Empty State`.

---

## Feedback + Surfaces completion gate

Run the permanent repo verification chain and packed consumer import/render for all six new exports. Dialog must additionally pass keyboard/focus tests in a real browser-capable test if jsdom cannot prove focus containment/restoration behavior. Record that distinction in the progress tracker rather than claiming jsdom proves browser modality.