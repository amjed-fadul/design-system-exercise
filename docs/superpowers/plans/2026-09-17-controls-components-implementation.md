# Controls Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Execute one public milestone at a time, update the master progress tracker, and obtain a fresh review before continuing.

**Goal:** Implement Button, Icon Button, Link, Text Field, Search Field, and Radio Group with contract-first governance and private shared helpers.

**Architecture:** Public controls live in `@design-system-exercise/react`. The private contracts package governs public API and runtime semantics. `_Input Control` and `_Radio Option` are implementation helpers with internal contracts only when their parent milestone begins; they are never exported from the React barrel.

**Tech Stack:** React, TypeScript, plain CSS custom properties, Vitest, Testing Library, Storybook, Ajv contract validation.

**Spec:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md` and `docs/superpowers/specs/2026-09-17-component-contracts-design.md`.

## Global Constraints

- Figma file: `tYCXBBYoQ92AUKVbND5WkG`.
- Public controls: Button `93:1230`, Icon Button `110:1339`, Link `114:13`, Text Field `112:263`, Search Field `112:1710`, Radio Group `116:175`.
- Internal helpers: `_Input Control` `111:22`, `_Radio Option` `116:174`.
- Browser hover/active/focus are derived states, not public visual-state props.
- Native semantics win over Figma representation controls.
- Every public milestone adds a validated contract, focused runtime tests, token-driven CSS, Storybook, and exact-HEAD CI evidence.
- Internal helper exports from `packages/react/src/index.ts` are forbidden.

---

## C01 — Button

Execute the existing dedicated plan:

`docs/superpowers/plans/2026-09-16-button-react-implementation.md`

Do not duplicate or diverge from that plan here.

---

## C02 — Icon Button

**Figma:** `110:1339`

**Live Figma facts:** `accessibleLabel` text, icon swap, `focusVisible` boolean, `state=default|hover|pressed|disabled`. No loading state exists.

**Files:**
- Create `packages/contracts/components/icon-button.contract.json`
- Create `packages/contracts/tests/icon-button.contract.test.ts`
- Create `packages/react/src/icon-button/IconButton.tsx`
- Create `packages/react/src/icon-button/IconButton.css`
- Create `packages/react/src/icon-button/IconButton.test.tsx`
- Create `apps/storybook/src/components/IconButton.stories.tsx`
- Modify `packages/react/src/index.ts`

**Public runtime boundary:**

```ts
export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}
```

The contract forbids public `state`, `focusVisible`, `accessibleLabel` duplicate prop, `loading`, and `success`. Figma `accessibleLabel` maps to native `aria-label`; Figma `state` maps to native/CSS state.

**TDD acceptance:**

- [ ] Write contract tests proving required `aria-label`, no loading capability, and representation mappings.
- [ ] Run `pnpm --filter @design-system-exercise/contracts test -- icon-button.contract.test.ts` and confirm RED.
- [ ] Author `dse.icon-button@1.0.0`; run `pnpm contracts:validate`.
- [ ] Write runtime tests for native `<button>`, safe default `type="button"`, ref/native prop forwarding, required accessible name, disabled semantics, and decorative icon `aria-hidden` wrapper.
- [ ] Confirm runtime RED with `pnpm --filter @design-system-exercise/react test -- IconButton.test.tsx`.
- [ ] Implement component/CSS using public tokens only; use `:hover`, `:active`, `:focus-visible`, `:disabled`.
- [ ] Add Storybook examples `Close`, `Clear search`, disabled, Light/Dark, English/Arabic page context.
- [ ] Run package tests/typecheck/build, full repo tests/typecheck, Storybook build, contract validation, packed-consumer smoke.
- [ ] Fresh review; commit `feat(react): add Icon Button`.

---

## C03 — Link

**Figma:** `114:13`

**Live Figma facts:** `label` text; `state=default|hover|focus|pressed`. No disabled/visited/icon API exists.

**Files:**
- Create `packages/contracts/components/link.contract.json`
- Create `packages/contracts/tests/link.contract.test.ts`
- Create `packages/react/src/link/Link.tsx`
- Create `packages/react/src/link/Link.css`
- Create `packages/react/src/link/Link.test.tsx`
- Create `apps/storybook/src/components/Link.stories.tsx`
- Modify `packages/react/src/index.ts`

**Public runtime boundary:**

```ts
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}
```

Contract requires native anchor semantics and an `href` for navigational examples. It forbids visual `state`, disabled, visited, and icon variants unless a future contract change adds them.

**TDD acceptance:**

- [ ] Contract test legal source mapping and forbidden inventions; confirm RED.
- [ ] Author `dse.link@1.0.0`; validate.
- [ ] Runtime tests: renders `<a>`, forwards `href/target/rel/aria-*`, keyboard activation remains native, ref resolves to `HTMLAnchorElement`.
- [ ] Implement token CSS for default/hover/active/focus-visible; no JS state machine.
- [ ] Storybook: normal destination, long label, Arabic label, external-target example only using native anchor attrs.
- [ ] Full milestone verification + fresh review; commit `feat(react): add Link`.

---

## C04 — `_Input Control` + Text Field

**Figma:** `_Input Control` `111:22`; Text Field `112:263`.

**Live Figma facts:**
- `_Input Control`: `size=compact|default`; `state=default|hover|focus|disabled|invalid|invalid-focus`.
- Text Field: label/value/placeholder/supportingText, required/showSupportingText, `state=default|hover|focus|disabled|invalid|invalid-focus`, `content=empty|filled`.

**Files:**
- Create `packages/contracts/components/_input-control.contract.json`
- Create `packages/contracts/components/text-field.contract.json`
- Create `packages/contracts/tests/text-field.contract.test.ts`
- Create `packages/react/src/internal/input-control/InputControl.tsx`
- Create `packages/react/src/internal/input-control/InputControl.css`
- Create `packages/react/src/text-field/TextField.tsx`
- Create `packages/react/src/text-field/TextField.test.tsx`
- Create `apps/storybook/src/components/TextField.stories.tsx`
- Modify `packages/react/src/index.ts`

**Internal boundary:** `_Input Control` is not exported. Its internal `size` may be consumed by Text Field/Search Field implementation only.

**Public runtime boundary:**

```ts
export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: React.ReactNode;
  supportingText?: React.ReactNode;
  invalid?: boolean;
  errorMessage?: React.ReactNode;
}
```

Native `value/defaultValue/placeholder/required/disabled/name/id/onChange` remain forwarded attributes. Figma `content` and `state` are derived and forbidden as public props. `invalid` is semantic runtime state and maps to `aria-invalid` plus described-by content.

**TDD acceptance:**

- [ ] Internal contract proves private visibility and exact size/state source facts.
- [ ] Public contract proves Figma state/content are representation mappings, not public visual controls.
- [ ] Runtime tests: explicit label association, generated/stable id when omitted, supporting/error described-by, required/disabled/invalid semantics, controlled and uncontrolled value support, ref forwarding.
- [ ] Implement internal shell + native `<input>`; CSS derives hover/focus/disabled/invalid.
- [ ] Storybook: empty, filled, required, disabled, invalid, invalid-focus via interaction test, long supporting text, Arabic label with Latin email.
- [ ] Verify internal helper absent from public barrel/package exports.
- [ ] Full milestone verification + fresh review; commit `feat(react): add Text Field`.

---

## C05 — Search Field

**Figma:** `112:1710`; reuses C04 internal input shell and C02 Icon Button behavior.

**Live Figma facts:** value/placeholder/accessibleLabel, `state=default|hover|focus|disabled`, `content=empty|filled`.

**Files:**
- Create `packages/contracts/components/search-field.contract.json`
- Create `packages/contracts/tests/search-field.contract.test.ts`
- Create `packages/react/src/search-field/SearchField.tsx`
- Create `packages/react/src/search-field/SearchField.css`
- Create `packages/react/src/search-field/SearchField.test.tsx`
- Create `apps/storybook/src/components/SearchField.stories.tsx`
- Modify `packages/react/src/index.ts`

**Public runtime boundary:**

```ts
export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  'aria-label': string;
  onClear?: () => void;
}
```

Render `type="search"` or a text input with search semantics consistently; contract fixes the chosen native element. Clear affordance appears only when there is content and `onClear` is supplied. Search results/debounce/counting are outside component authority.

**TDD acceptance:**

- [ ] Contract maps `accessibleLabel` to native `aria-label`; forbids public `state/content`.
- [ ] Runtime tests: accessible search name, controlled/uncontrolled values, clear button name, clear callback exactly once, disabled semantics, no result/business logic.
- [ ] Implement using private InputControl and public IconButton behavior without exporting helper internals.
- [ ] Storybook: empty/filled/disabled, clear action, Arabic UI with Latin query.
- [ ] Full verification + fresh review; commit `feat(react): add Search Field`.

---

## C06 — `_Radio Option` + Radio Group

**Figma:** `_Radio Option` `116:174`; Radio Group `116:175`.

**Live Figma facts:**
- option: label/description/showDescription, `selected=false|true`, `state=default|hover|focus|pressed|disabled`;
- group: label, required, Options slot.

**Files:**
- Create `packages/contracts/components/_radio-option.contract.json`
- Create `packages/contracts/components/radio-group.contract.json`
- Create `packages/contracts/tests/radio-group.contract.test.ts`
- Create `packages/react/src/internal/radio-option/RadioOption.tsx`
- Create `packages/react/src/radio-group/RadioGroup.tsx`
- Create `packages/react/src/radio-group/RadioGroup.css`
- Create `packages/react/src/radio-group/RadioGroup.test.tsx`
- Create `apps/storybook/src/components/RadioGroup.stories.tsx`
- Modify `packages/react/src/index.ts`

**Public data boundary:**

```ts
export interface RadioGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: React.ReactNode;
  name: string;
  options: readonly RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}
```

The internal option owns rendering of native radio inputs. Figma `selected` and visual `state` are derived from value/native interaction. Public API must not export `RadioOption`.

**TDD acceptance:**

- [ ] Contract tests enforce exactly one group-owned selection model and private option contract.
- [ ] Runtime tests: radiogroup/group label semantics, shared name, one checked value, arrow-key/native radio behavior, disabled group/option, controlled/uncontrolled value, descriptions associated to each radio.
- [ ] Implement internal option + group mapping with logical CSS.
- [ ] Storybook: required roles, Member/Admin fixture, descriptions on/off through data, disabled option, Arabic labels.
- [ ] Verify `RadioOption` is absent from public exports.
- [ ] Full verification + fresh review; commit `feat(react): add Radio Group`.

---

## Controls wave completion gate

Before moving to Feedback & Surfaces:

```bash
pnpm contracts:validate
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Packed consumer must import and render Button, IconButton, Link, TextField, SearchField, and RadioGroup through public package exports. Internal `_Input Control` and `_Radio Option` must be unreachable through package exports.