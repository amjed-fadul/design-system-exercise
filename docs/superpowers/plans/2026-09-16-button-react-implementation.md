# Button React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Button as the first production component in `@design-system-exercise/react`, matching the audited Figma Button contract while preserving the existing foundation-token architecture.

**Architecture:** Activate the reserved React package with a small public Button API built on the native `<button>` element. Browser/CSS state drives hover, pressed and focus; component props express semantic choices (`emphasis`, `tone`, `loading`, `icon`, `iconPosition`). Styling consumes only `@design-system-exercise/tokens` CSS variables. Storybook documents the real package API, and CI packs the React package and verifies a clean consumer can install and render it.

**Tech Stack:** React, TypeScript 7.0.2, plain CSS custom properties, `@design-system-exercise/tokens`, Vitest 5, Testing Library, jsdom, Storybook 10.6, pnpm 12.4.2, Node 24.21.0.

**Spec:** `docs/superpowers/specs/2026-09-16-design-system-exercise-design.md` plus Figma Button component set `93:1230` in `Design System Exercise (Arabic/English, Light/Dark)`.

## Global Constraints

- Planning base: `751ce383f392b24b8db0495fe221facf0a6eb4f6`.
- Scope is Button only. Do not start Icon Button, Link, fields, patterns, or any other component.
- Do not merge PR #1, merge to `main`, or publish to npm as part of this plan.
- `tone="critical"` is a Button tone, not a separate `ButtonCritical` component.
- Public API must not expose Figma-only controls: `state`, `focusVisible`, or `showIcon`.
- Do not add `size`, `danger`, or `success` variants; Figma explicitly does not support them.
- Hover, pressed, focus-visible, and disabled visuals must come from native browser/CSS semantics rather than public state props.
- `disabled` uses the native `disabled` attribute. `loading` remains focusable, exposes `aria-busy="true"` and `aria-disabled="true"`, and suppresses activation without switching to disabled styling.
- Loading must preserve the greater of normal-label width and loading-label width, matching the Figma hidden-measurement intent.
- Loader motion is out of scope. The Figma busy indicator is static in this milestone.
- All color, spacing, typography, radius, border and icon-size values must come from generated `--dse-*` variables. Do not copy raw foundation values into component CSS.
- English/Arabic and Light/Dark remain mode dimensions owned by the token package and Storybook decorators; Button must inherit them rather than create parallel theme or language props.
- Component CSS remains package-local. Do not create new global foundation tokens unless a real missing semantic is proven during implementation and explicitly reviewed.
- Execution branch should descend from this planning branch. Until PR #1 lands, any Button PR should target `feat/foundations-storybook` as a stacked PR.

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
- Consumes: native `button` attributes and `@design-system-exercise/tokens` as a workspace dependency.
- Produces: `Button`, `ButtonProps`, `ButtonEmphasis`, `ButtonTone`, and `ButtonIconPosition` from `@design-system-exercise/react`.

- [ ] **Step 1: Configure the package and test harness**

Set `packages/react/package.json` to an npm-ready ESM package with `files: ["dist"]`, root export `./dist/index.js`, types `./dist/index.d.ts`, and `./styles.css` reserved for Task 2. Add scripts:

```json
{
  "build": "tsc -p tsconfig.build.json && node scripts/copy-assets.mjs",
  "test": "vitest run",
  "typecheck": "tsc --noEmit -p tsconfig.json"
}
```

Use `@design-system-exercise/tokens: "workspace:*"` as a dependency, React as a peer supporting React 18.3+ and 19, and React 19.3.0 plus Testing Library/jsdom/Vitest/TypeScript as development dependencies.

`tsconfig.json` extends the root config, sets `jsx: "react-jsx"`, includes `src`, tests, and `vitest.config.ts`. `tsconfig.build.json` emits declarations and JS from `src` into `dist` and excludes test files.

- [ ] **Step 2: Write the failing semantic API tests**

Cover these behaviors in `Button.test.tsx` before implementation:

```tsx
it('renders a native button with safe default type', () => {
  render(<Button>Send invite</Button>);
  expect(screen.getByRole('button', { name: 'Send invite' })).toHaveAttribute('type', 'button');
});

it('uses native disabled semantics', () => {
  render(<Button disabled>Send invite</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});

it('exposes semantic emphasis and tone as data attributes', () => {
  render(<Button emphasis="secondary" tone="critical">Remove</Button>);
  const button = screen.getByRole('button', { name: 'Remove' });
  expect(button).toHaveAttribute('data-emphasis', 'secondary');
  expect(button).toHaveAttribute('data-tone', 'critical');
});
```

Also verify native props (`name`, `value`, `aria-*`, `onClick`) are forwarded and a forwarded ref resolves to `HTMLButtonElement`.

- [ ] **Step 3: Run the focused tests and confirm RED**

Run:

```bash
pnpm --filter @design-system-exercise/react test -- Button.test.tsx
```

Expected: FAIL because `Button` and its package implementation do not exist yet.

- [ ] **Step 4: Implement the minimal semantic Button component**

Use this public shape:

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

Defaults: `emphasis="primary"`, `tone="default"`, `loading=false`, `loadingLabel="Loading…"`, `iconPosition="leading"`, and `type="button"` when `type` is omitted. Use `forwardRef`. Do not add public state/focus/showIcon props.

- [ ] **Step 5: Run package tests and typecheck**

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
- Consumes: generated CSS variables from `@design-system-exercise/tokens/css`.
- Produces: Figma-matched Button visuals for emphasis, tone, native pointer state, focus-visible and disabled.

- [ ] **Step 1: Write a failing CSS contract test**

Read `Button.css` as text and assert it contains the required public token variables and contains no raw hex/rgb color literals. Required variables include:

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
--dse-color-semantic-focus-default
--dse-border-role-base
--dse-border-role-focus
--dse-radius-shape-control
--dse-spacing-space-300
--dse-spacing-inline-md
--dse-spacing-gap-sm
--dse-spacing-space-800
--dse-icons-size-md
--dse-typography-semantic-label-default-family
--dse-typography-semantic-label-default-size
--dse-typography-semantic-label-default-weight
--dse-typography-semantic-label-default-line-height
--dse-typography-semantic-label-default-letter-spacing
```

- [ ] **Step 2: Run the CSS contract test and confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.css.test.ts
```

Expected: FAIL because the stylesheet does not exist.

- [ ] **Step 3: Implement the base geometry and typography**

Implement `.dse-button` using token variables only:

```css
.dse-button {
  min-block-size: var(--dse-spacing-space-800);
  padding-block: var(--dse-spacing-space-300);
  padding-inline: var(--dse-spacing-inline-md);
  border-radius: var(--dse-radius-shape-control);
  font-family: var(--dse-typography-semantic-label-default-family);
  font-size: var(--dse-typography-semantic-label-default-size);
  font-weight: var(--dse-typography-semantic-label-default-weight);
  line-height: var(--dse-typography-semantic-label-default-line-height);
  letter-spacing: var(--dse-typography-semantic-label-default-letter-spacing);
}
```

Use logical properties so RTL is inherited naturally.

- [ ] **Step 4: Implement the emphasis/tone state matrix**

Required mapping:

```text
primary/default:   primary bg + primary fg; hover/pressed use primary hover/pressed
primary/critical:  critical bg + critical on-bg; hover/pressed use critical hover/pressed
secondary/default: secondary bg + secondary fg + secondary border; hover/pressed use secondary hover/pressed
secondary/critical: secondary bg + critical fg + critical border; hover/pressed still use secondary hover/pressed
text/default:      transparent surface + ghost fg; hover/pressed use ghost hover/pressed surfaces
text/critical:     transparent surface + critical fg; hover/pressed use ghost hover/pressed surfaces
```

Use `:hover`, `:active`, and `:focus-visible`; do not expose these as props. Implement the Figma focus overlay as an outline using `--dse-border-role-focus`, `--dse-color-semantic-focus-default`, and a logical 2 px-equivalent gap derived from the existing spacing system rather than a raw color or raw foundation value.

Disabled mapping:

```text
primary:   surface.disabled + fg.disabled
secondary: surface.disabled + fg.disabled + border.subtle
text:      transparent + fg.disabled
```

Apply disabled visuals only to actual native `:disabled`, not to loading.

- [ ] **Step 5: Run focused tests and typecheck**

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
- Modify: `packages/react/src/button/Button.tsx`
- Modify: `packages/react/src/button/Button.css`
- Modify: `packages/react/src/button/Button.test.tsx`
- Create: `packages/react/src/assets/loader-circle.svg`

**Interfaces:**
- Consumes: Button semantic props from Task 1 and Figma loader-circle source `86:11830`.
- Produces: stable-width loading behavior, leading/trailing icon composition and non-activating busy state.

- [ ] **Step 1: Add failing interaction tests**

Add tests for:

```tsx
it('announces loading and blocks activation without using disabled styling', async () => {
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

Also verify:
- normal and loading layers both remain in layout so width is based on the wider label;
- the inactive layer is `aria-hidden`;
- `icon` is absent when no icon prop is provided;
- leading/trailing changes semantic DOM order without an LTR-only margin;
- icons are `aria-hidden` because the button label owns the accessible name;
- a real native `disabled` button still wins over loading interaction.

- [ ] **Step 2: Run the focused tests and confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.test.tsx
```

Expected: FAIL on loading and composition behavior.

- [ ] **Step 3: Add the exact static loader asset**

Export the existing Figma `Lucide / loader-circle` source (`86:11830`) and store its exact SVG bytes as `packages/react/src/assets/loader-circle.svg`. Do not redraw or hand-author the path. Motion remains intentionally absent.

- [ ] **Step 4: Implement width-preserving layered content**

Use one grid cell with both normal and loading content participating in intrinsic sizing. Hide only the inactive visual layer with `visibility: hidden` plus `aria-hidden`; do not use `display: none` for the measurement layer. Loading content always includes the static 20 px loader using `--dse-icons-size-md` and the loading label.

- [ ] **Step 5: Implement logical icon placement and loading activation guard**

Render the optional icon before or after the label according to `iconPosition`. Use logical flex/gap behavior only, so `dir="rtl"` inherited from the document naturally mirrors leading/trailing. While `loading`, prevent the component's click activation and expose `aria-disabled`; preserve focusability and loading visuals.

- [ ] **Step 6: Run tests, typecheck, and build**

```bash
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
pnpm --filter @design-system-exercise/react build
```

Expected: PASS.

- [ ] **Step 7: Commit Task 3**

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
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: public `Button` export and `@design-system-exercise/react/styles.css`.
- Produces: Storybook documentation and parity surface for Light/Dark and English/Arabic.

- [ ] **Step 1: Add the React package to Storybook and load its public stylesheet**

Add `@design-system-exercise/react: "workspace:*"` to Storybook dependencies. In `preview.tsx`, import `@design-system-exercise/react/styles.css` immediately after `@design-system-exercise/tokens/css`. Keep the existing theme/language decorators unchanged.

- [ ] **Step 2: Create Button stories using only the public API**

Add stories for:

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

`StateMatrix` should render the semantic variants together for visual review; pointer states remain interactive CSS states rather than fake `state` props. Use Arabic copy in at least one story so the global Arabic control visibly exercises RTL and Arabic typography.

- [ ] **Step 3: Verify Figma parity manually in four global contexts**

Run:

```bash
pnpm storybook
```

Compare against Figma Button component set `93:1230` in:

```text
Light + English
Dark + English
Light + Arabic
Dark + Arabic
```

Check 48 px minimum control height, 16/12 logical padding, 8 px content gap, 8 px control radius, label typography, critical hierarchy, disabled treatment, focus ring, loading width preservation, and logical icon placement.

- [ ] **Step 4: Run Storybook production build and package checks**

```bash
pnpm --filter @design-system-exercise/react test
pnpm typecheck
pnpm build-storybook
```

Expected: PASS with no Storybook import or accessibility build errors.

- [ ] **Step 5: Commit Task 4**

```bash
git add apps/storybook pnpm-lock.yaml
git commit -m "docs(storybook): add Button documentation"
```

---

### Task 5: Make the React package consumer-verifiable in CI and close the milestone

**Files:**
- Create: `packages/react/scripts/copy-assets.mjs`
- Modify: `packages/react/package.json`
- Modify: `packages/react/README.md`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `docs/superpowers/plans/2026-09-16-button-react-progress.md`

**Interfaces:**
- Consumes: compiled React package, token tarball, current CI pipeline.
- Produces: deterministic packed React package plus clean-consumer smoke verification.

- [ ] **Step 1: Add deterministic style/asset copying to the package build**

`copy-assets.mjs` must copy the component stylesheet into `dist/styles.css` and the exact loader asset into `dist/assets/loader-circle.svg`. It must fail if a required source file is missing. Keep generated `dist` content out of hand-edit workflows.

- [ ] **Step 2: Finalize package exports and README consumer instructions**

The package exports must include:

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  },
  "./styles.css": "./dist/styles.css"
}
```

README usage must show both required stylesheet imports:

```ts
import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
```

and a normal semantic use:

```tsx
<Button emphasis="primary" tone="critical">Delete invitation</Button>
```

- [ ] **Step 3: Wire root build commands to build React before Storybook**

Update root scripts so `storybook`, `build-storybook`, and `build` run token build first, React build second, then Storybook. Do not remove existing token validation gates.

- [ ] **Step 4: Extend GitHub Actions with a packed React consumer smoke test**

After the existing token pack check:
1. build and pack `packages/react`;
2. verify tar contents include `package.json`, `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`, and the loader asset;
3. initialize a clean npm consumer;
4. install the packed token tarball first, then the packed React tarball;
5. SSR-render `<Button tone="critical">Delete</Button>` with `react-dom/server` and assert the output contains a native `<button` plus the expected semantic data attribute;
6. resolve `@design-system-exercise/react/styles.css` and verify the file exists.

Do not publish either package.

- [ ] **Step 5: Run the full milestone verification locally**

```bash
pnpm install --frozen-lockfile
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Then run the same local pack/consumer smoke flow used by CI for tokens and React.

Expected: every command exits 0.

- [ ] **Step 6: Update the progress tracker with final evidence**

Record Task 1–5 commit SHAs, reviewer outcomes, exact verification commands, final HEAD, and whether GitHub Actions passed on that exact HEAD. Do not mark the plan complete until CI is green on the final commit.

- [ ] **Step 7: Commit Task 5**

```bash
git add packages/react package.json .github/workflows/ci.yml docs/superpowers/plans/2026-09-16-button-react-progress.md
git commit -m "ci: verify packed React Button package"
```

---

## Final Review Gate

Before opening or updating the Button PR:

```bash
git diff --check
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Then have a fresh reviewer check only this milestone for:

```text
- public API matches the approved semantic contract
- no Figma-only state props leaked into React
- critical remains a tone, not a duplicate component
- no unsupported size/danger/success variants
- no raw foundation colors/spacing/type values copied into Button CSS
- Light/Dark and English/Arabic inheritance works
- loading preserves width and blocks activation
- native disabled semantics work
- RTL leading/trailing behavior is logical
- package exports and scratch-consumer install work
- no changes to patterns or unrelated components
```

The implementation is complete only when focused tests, full repo tests, typecheck, Storybook production build, package smoke checks, manual Figma parity review, fresh code review, and GitHub Actions all pass on the same final HEAD.
