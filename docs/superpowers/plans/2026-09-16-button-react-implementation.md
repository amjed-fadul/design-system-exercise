# Button React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Button as the first production component in `@design-system-exercise/react`, matching the audited Figma Button contract while preserving the existing foundation-token architecture.

**Architecture:** Activate the reserved React package with a small semantic API built on the native `<button>` element. Browser/CSS state owns hover, pressed and focus; public props own semantic choices (`emphasis`, `tone`, `loading`, `icon`, `iconPosition`). Styling uses only generated `@design-system-exercise/tokens` CSS variables. Storybook consumes the public package, and CI packs both tokens and React into a clean scratch consumer.

**Tech Stack:** React, TypeScript 7.0.2, plain CSS custom properties, Vitest 5, Testing Library, jsdom, Storybook 10.6, pnpm 12.4.2, Node 24.21.0.

**Spec:** `docs/superpowers/specs/2026-09-16-design-system-exercise-design.md` plus Figma Button component set `93:1230` in `Design System Exercise (Arabic/English, Light/Dark)`.

## Global Constraints

- Planning base: `751ce383f392b24b8db0495fe221facf0a6eb4f6`.
- Scope is Button only. Do not start Icon Button, Link, fields, patterns, or any other component.
- Do not merge PR #1, merge to `main`, or publish to npm as part of this plan.
- `tone="critical"` is a Button tone, not a separate `ButtonCritical` component.
- Do not expose Figma-only `state`, `focusVisible`, or `showIcon` props.
- Do not add `size`, `danger`, or `success`; Figma explicitly does not support them.
- Native/CSS semantics own hover, pressed, focus-visible and disabled visuals.
- Native `disabled` uses the real `disabled` attribute. `loading` stays focusable, exposes `aria-busy="true"` and `aria-disabled="true"`, and blocks activation without adopting disabled styling.
- Loading must preserve the greater of normal-label width and loading-label width, matching the Figma hidden-measurement intent.
- Loader motion is out of scope; the Figma busy indicator is static.
- All component dimensions, color, type, radius, border and icon sizes must reference generated `--dse-*` variables; no copied raw foundation values.
- Light/Dark and English/Arabic are inherited token modes, not Button props.
- Component-private decisions remain local; do not create new public foundation tokens unless a missing semantic is proven and separately reviewed.
- Execution should branch from the final planning-branch HEAD. Until PR #1 lands, target `feat/foundations-storybook` with a stacked Button PR.

---

### Task 1: Activate the React package and establish the semantic Button API

**Files:**
- Modify: `packages/react/package.json`
- Modify: `packages/react/README.md`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/tsconfig.build.json`
- Create: `packages/react/vitest.config.ts`
- Create: `packages/react/src/button/Button.tsx`
- Create: `packages/react/src/button/Button.test.tsx`
- Create: `packages/react/src/index.ts`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: native button attributes and `@design-system-exercise/tokens`.
- Produces: `Button`, `ButtonProps`, `ButtonEmphasis`, `ButtonTone`, `ButtonIconPosition`.

- [ ] **Step 1: Configure the package and test harness**

Make `packages/react/package.json` an npm-ready ESM package. Keep `files: ["dist"]`; export `./dist/index.js` with `./dist/index.d.ts`; reserve `./styles.css` for the Task 3 artifact. Start with:

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "@design-system-exercise/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=18.3.0 <20"
  }
}
```

Use React/React DOM 19.3.0 for local tests, with their type packages plus Testing Library, user-event, jest-dom, jsdom, Vitest 5.0.1 and TypeScript 7.0.2 as dev dependencies. `tsconfig.json` extends the root config and sets `jsx: "react-jsx"`; `tsconfig.build.json` emits JS + declarations from `src` to `dist` and excludes tests.

- [ ] **Step 2: Write failing semantic API tests**

```tsx
it('renders a native button with safe default type', () => {
  render(<Button>Send invite</Button>);
  expect(screen.getByRole('button', { name: 'Send invite' })).toHaveAttribute('type', 'button');
});

it('uses native disabled semantics', () => {
  render(<Button disabled>Send invite</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});

it('exposes semantic emphasis and tone', () => {
  render(<Button emphasis="secondary" tone="critical">Remove</Button>);
  const button = screen.getByRole('button', { name: 'Remove' });
  expect(button).toHaveAttribute('data-emphasis', 'secondary');
  expect(button).toHaveAttribute('data-tone', 'critical');
});
```

Also test native prop forwarding (`name`, `value`, `aria-*`, `onClick`) and `forwardRef<HTMLButtonElement>`.

- [ ] **Step 3: Confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.test.tsx
```

Expected: FAIL because Button does not exist.

- [ ] **Step 4: Implement the minimal semantic API**

```tsx
export type ButtonEmphasis = 'primary' | 'secondary' | 'text';
export type ButtonTone = 'default' | 'critical';
export type ButtonIconPosition = 'leading' | 'trailing';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emphasis?: ButtonEmphasis;
  tone?: ButtonTone;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: ButtonIconPosition;
}
```

Defaults: `emphasis="primary"`, `tone="default"`, `loading=false`, `loadingLabel="Loading…"`, `iconPosition="leading"`, and `type="button"` when omitted. Export the component and types from `src/index.ts`. Do not add public state/focus/showIcon props.

- [ ] **Step 5: Verify Task 1**

```bash
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

```bash
git add packages/react pnpm-lock.yaml
git commit -m "feat(react): establish Button API"
```

---

### Task 2: Implement the token-driven visual contract

**Files:**
- Create: `packages/react/src/button/Button.css`
- Create: `packages/react/src/button/Button.css.test.ts`
- Modify: `packages/react/src/button/Button.tsx`

**Interfaces:**
- Consumes: generated variables from `@design-system-exercise/tokens/css`.
- Produces: Figma-matched emphasis/tone, pointer, focus and disabled visuals.

- [ ] **Step 1: Write a failing CSS contract test**

Read `Button.css` as text. Assert there are no hex/rgb color literals and that these public variables are used:

```text
--dse-color-semantic-action-primary-bg
--dse-color-semantic-action-primary-fg
--dse-color-semantic-action-primary-hover
--dse-color-semantic-action-primary-pressed
--dse-color-semantic-action-secondary-bg
--dse-color-semantic-action-secondary-fg
--dse-color-semantic-action-secondary-border
--dse-color-semantic-action-secondary-hover
--dse-color-semantic-action-secondary-pressed
--dse-color-semantic-action-ghost-fg
--dse-color-semantic-action-ghost-hover
--dse-color-semantic-action-ghost-pressed
--dse-color-semantic-action-critical-bg
--dse-color-semantic-action-critical-on-bg
--dse-color-semantic-action-critical-fg
--dse-color-semantic-action-critical-hover
--dse-color-semantic-action-critical-pressed
--dse-color-semantic-action-critical-border
--dse-color-semantic-surface-disabled
--dse-color-semantic-fg-disabled
--dse-color-semantic-border-subtle
--dse-color-semantic-focus-default
--dse-border-role-base
--dse-border-role-focus
--dse-radius-shape-control
--dse-spacing-primitive-space-300
--dse-spacing-semantic-inset-md
--dse-spacing-semantic-gap-sm
--dse-spacing-primitive-space-800
--dse-icons-size-md
--dse-typography-semantic-label-default-family
--dse-typography-semantic-label-default-size
--dse-typography-semantic-label-default-weight
--dse-typography-semantic-label-default-line-height
--dse-typography-semantic-label-default-letter-spacing
```

- [ ] **Step 2: Confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.css.test.ts
```

Expected: FAIL because the stylesheet does not exist.

- [ ] **Step 3: Implement geometry and typography**

```css
.dse-button {
  min-block-size: var(--dse-spacing-primitive-space-800);
  padding-block: var(--dse-spacing-primitive-space-300);
  padding-inline: var(--dse-spacing-semantic-inset-md);
  border-radius: var(--dse-radius-shape-control);
  font-family: var(--dse-typography-semantic-label-default-family);
  font-size: var(--dse-typography-semantic-label-default-size);
  font-weight: var(--dse-typography-semantic-label-default-weight);
  line-height: var(--dse-typography-semantic-label-default-line-height);
  letter-spacing: var(--dse-typography-semantic-label-default-letter-spacing);
}
```

Use `--dse-spacing-semantic-gap-sm` for the content gap and `--dse-icons-size-md` for icon/busy glyph boxes. Use logical CSS properties only for directional spacing.

- [ ] **Step 4: Implement the emphasis/tone state matrix**

```text
primary/default:    primary bg + primary fg; primary hover/pressed
primary/critical:   critical bg + critical on-bg; critical hover/pressed
secondary/default:  secondary bg + secondary fg + secondary border; secondary hover/pressed
secondary/critical: secondary bg + critical fg + critical border; secondary hover/pressed
text/default:       transparent + ghost fg; ghost hover/pressed surfaces
text/critical:      transparent + critical fg; ghost hover/pressed surfaces
```

Use `:hover`, `:active`, and `:focus-visible`, never a visual-state prop. Match the Figma independent focus overlay with:

```css
outline: var(--dse-border-role-focus) solid var(--dse-color-semantic-focus-default);
outline-offset: var(--dse-border-role-focus);
```

Disabled mapping:

```text
primary:   surface.disabled + fg.disabled
secondary: surface.disabled + fg.disabled + border.subtle
text:      transparent + fg.disabled
```

Apply disabled visuals only to native `:disabled`.

- [ ] **Step 5: Verify Task 2**

```bash
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add packages/react/src/button
git commit -m "feat(react): style Button from design tokens"
```

---

### Task 3: Add loading, icon composition, width preservation and RTL-safe behavior

**Files:**
- Modify: `packages/react/package.json`
- Modify: `packages/react/src/button/Button.tsx`
- Modify: `packages/react/src/button/Button.css`
- Modify: `packages/react/src/button/Button.test.tsx`
- Create: `packages/react/src/assets/loader-circle.svg`
- Create: `packages/react/scripts/copy-assets.mjs`

**Interfaces:**
- Consumes: Task 1 public props and Figma `Lucide / loader-circle` source `86:11830`.
- Produces: stable-width loading, logical icon placement, busy-state semantics and deterministic style/asset build output.

- [ ] **Step 1: Add failing behavior tests**

```tsx
it('announces loading and blocks activation without native disabled', async () => {
  const onClick = vi.fn();
  render(<Button loading loadingLabel="Sending…" onClick={onClick}>Send invite</Button>);
  const button = screen.getByRole('button', { name: 'Sending…' });
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toHaveAttribute('aria-disabled', 'true');
  expect(button).not.toBeDisabled();
  await userEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
});
```

Also test that both normal/loading layers remain in intrinsic layout; the inactive layer is `aria-hidden`; icon output exists only when `icon` exists; leading/trailing changes DOM order without left/right margins; icons are `aria-hidden`; and real native `disabled` remains disabled even if `loading` is also true.

- [ ] **Step 2: Confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.test.tsx
```

Expected: FAIL on loading/composition behavior.

- [ ] **Step 3: Add the exact static loader asset**

Export Figma node `86:11830` and store its exact SVG bytes at `packages/react/src/assets/loader-circle.svg`. Do not redraw or hand-author the path. Reference it from `Button.tsx` with:

```ts
const loaderUrl = new URL('../assets/loader-circle.svg', import.meta.url).href;
```

This relative path must remain valid after compilation from `dist/button` to `dist/assets`.

- [ ] **Step 4: Implement width-preserving layered content**

Put normal and loading content in the same grid cell so both contribute intrinsic width. Hide only the inactive visual layer with `visibility: hidden` plus `aria-hidden`; never `display: none` the measurement layer. Loading always shows the static loader at `--dse-icons-size-md` plus `loadingLabel`.

- [ ] **Step 5: Implement logical icon placement and activation guard**

Render the optional icon before/after the label according to `iconPosition`. Use flex `gap` and inherited direction so RTL mirrors logical leading/trailing automatically. During loading, wrap `onClick`: call `event.preventDefault()` and do not call the consumer handler; do not set native `disabled` solely because loading is true.

- [ ] **Step 6: Add deterministic CSS/SVG copying**

Create `packages/react/scripts/copy-assets.mjs`:

```js
import { copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/assets/', import.meta.url), { recursive: true });
await copyFile(
  new URL('../src/button/Button.css', import.meta.url),
  new URL('../dist/styles.css', import.meta.url),
);
await copyFile(
  new URL('../src/assets/loader-circle.svg', import.meta.url),
  new URL('../dist/assets/loader-circle.svg', import.meta.url),
);
```

Then change the package build script to:

```json
"build": "tsc -p tsconfig.build.json && node scripts/copy-assets.mjs"
```

`copyFile` must be allowed to fail if a required source is missing.

- [ ] **Step 7: Verify Task 3**

```bash
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
pnpm --filter @design-system-exercise/react build
```

Expected: PASS and `dist/` contains JS, declarations, `styles.css`, and `assets/loader-circle.svg`.

- [ ] **Step 8: Commit Task 3**

```bash
git add packages/react
git commit -m "feat(react): complete Button interaction behavior"
```

---

### Task 4: Document and visually validate Button in Storybook

**Files:**
- Modify: `apps/storybook/package.json`
- Modify: `apps/storybook/.storybook/preview.tsx`
- Create: `apps/storybook/src/components/Button.stories.tsx`
- Create: `apps/storybook/src/assets/system-plus.svg`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: public Button export and `@design-system-exercise/react/styles.css`.
- Produces: Storybook documentation and four-context parity surface.

- [ ] **Step 1: Wire Storybook to the public React package**

Add `@design-system-exercise/react: "workspace:*"` to Storybook dependencies. In `preview.tsx`, import `@design-system-exercise/react/styles.css` immediately after `@design-system-exercise/tokens/css`. Keep the current theme/language decorators unchanged.

- [ ] **Step 2: Add the real shared Plus story asset**

Export the existing Figma `System Plus / shared` instance/source represented at node `121:1220` and store the exact SVG bytes at `apps/storybook/src/assets/system-plus.svg`. Use that asset in icon-placement stories; do not hand-draw a replacement.

- [ ] **Step 3: Create stories using only the public API**

Create:

```text
Primary
Secondary
Text
CriticalPrimary
CriticalSecondary
CriticalText
Disabled
Loading
LeadingIcon
TrailingIcon
StateMatrix
```

`StateMatrix` renders semantic variants; pointer states remain real CSS interactions rather than fake `state` args. Include Arabic copy in at least one story so the global Arabic control visibly exercises RTL and Arabic typography.

- [ ] **Step 4: Manually verify Figma parity**

```bash
pnpm storybook
```

Review Button `93:1230` in:

```text
Light + English
Dark + English
Light + Arabic
Dark + Arabic
```

Check minimum height 48, inline/block padding 16/12, gap 8, radius 8, label typography, critical hierarchy, disabled treatment, focus ring, loading width preservation and logical icon placement. Also inspect the Storybook a11y panel for the public stories.

- [ ] **Step 5: Verify Task 4**

```bash
pnpm --filter @design-system-exercise/react test
pnpm typecheck
pnpm build-storybook
```

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add apps/storybook pnpm-lock.yaml
git commit -m "docs(storybook): add Button documentation"
```

---

### Task 5: Make the React package consumer-verifiable in CI and close the milestone

**Files:**
- Modify: `packages/react/README.md`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `docs/superpowers/plans/2026-09-16-button-react-progress.md`

**Interfaces:**
- Consumes: compiled React package, packed token package and existing CI.
- Produces: clean-consumer package proof and final milestone evidence.

- [ ] **Step 1: Finish consumer documentation**

README must show:

```ts
import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
```

and:

```tsx
<Button emphasis="primary" tone="critical">Delete invitation</Button>
```

Document native `disabled`, `loading`, and logical `iconPosition`. Explicitly list size, danger/success, and public visual-state props as unsupported.

- [ ] **Step 2: Build React before Storybook from root scripts**

Update root `storybook`, `build-storybook`, and `build` so they run token build, React build, then Storybook. Preserve all existing token validation gates.

- [ ] **Step 3: Extend GitHub Actions with a packed React consumer smoke test**

After the token pack check:
1. build and pack `packages/react`;
2. assert the tar contains `package/package.json`, `package/dist/index.js`, `package/dist/index.d.ts`, `package/dist/styles.css`, and `package/dist/assets/loader-circle.svg`;
3. create a clean npm consumer;
4. install the packed token tarball first, then the packed React tarball;
5. install React/React DOM only as scratch-consumer peer runtime dependencies;
6. SSR-render `<Button tone="critical">Delete</Button>` with `react-dom/server` and assert native `<button` plus `data-tone="critical"` appear;
7. resolve `@design-system-exercise/react/styles.css` and verify the file exists.

Do not publish anything.

- [ ] **Step 4: Run full local verification**

```bash
pnpm install --frozen-lockfile
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Then run the same local pack/clean-consumer smoke flow used by CI for both packages. Expected: every command exits 0.

- [ ] **Step 5: Update the progress tracker**

Record Task 1–5 commit SHAs, reviewer verdicts, exact verification commands, corrections, final HEAD and GitHub Actions status for that exact HEAD. Do not mark complete until CI is green on the final implementation commit.

- [ ] **Step 6: Commit Task 5**

```bash
git add packages/react/README.md package.json .github/workflows/ci.yml docs/superpowers/plans/2026-09-16-button-react-progress.md
git commit -m "ci: verify packed React Button package"
```

---

## Final Review Gate

Run fresh:

```bash
git diff --check
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Then use a fresh reviewer to check:

```text
- public API matches the approved semantic contract
- no Figma-only state props leaked into React
- critical remains a tone, not a duplicate component
- no unsupported size/danger/success variants
- no raw foundation values copied into Button CSS
- Light/Dark and English/Arabic inheritance works
- loading preserves width and blocks activation while remaining focusable
- native disabled semantics work
- RTL leading/trailing behavior is logical
- package exports and clean-consumer install work
- no patterns or unrelated components changed
```

The milestone is complete only when focused tests, full repo tests, typecheck, Storybook production build, package smoke checks, manual Figma parity review, fresh review and GitHub Actions all pass on the same final HEAD.
