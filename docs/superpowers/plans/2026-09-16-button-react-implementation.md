# Button Contract + React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `dse.button@1.0.0` as the first validated component contract and ship Button as the first production component in `@design-system-exercise/react`, with contract, Figma, React, Storybook, and CI evidence kept distinct and consistent.

**Architecture:** Add a private `@design-system-exercise/contracts` workspace package containing JSON Schemas, deterministic validation, and the real Button contract. React Button is implemented against that boundary but does not depend on contracts at runtime. Figma remains design evidence, the contract defines legal supported capability, Storybook documents the public React surface, and focused parity tests prove the implementation stays within the Button contract.

**Tech Stack:** Node 24.21.0, pnpm 12.4.2, TypeScript 7.0.2, JSON Schema + Ajv 8, React 19.3.0 development runtime with React 18.3+ peer support, Vitest 5, Testing Library, jsdom, plain CSS custom properties, Storybook 10.6.

**Specs:**
- `docs/superpowers/specs/2026-09-16-design-system-exercise-design.md`
- `docs/superpowers/specs/2026-09-17-component-contracts-design.md`
- Figma Button component set `93:1230` in file `tYCXBBYoQ92AUKVbND5WkG`

## Global Constraints

- Planning base for the foundations work: `751ce383f392b24b8db0495fe221facf0a6eb4f6`.
- Scope is Button plus the minimum reusable contract infrastructure required to govern Button. Do not implement Icon Button, Link, fields, other components, or product patterns.
- Create both component and pattern contract schemas now, but do not create placeholder contracts for future units.
- `dse.button` is the only real component contract authored in this milestone.
- Do not merge PR #1, merge the Button work, or publish any npm package unless separately requested.
- Until PR #1 lands, the implementation branch descends from the final planning branch and the Button PR targets `feat/foundations-storybook` as a stacked PR.
- A validated contract defines legal supported capability; it is not proof of visual parity, runtime correctness, accessibility conformance, or product behavior.
- Contract validation must be deterministic and offline. No LLM/network call may run in the contract validation/build path.
- `tone="critical"` is a Button tone, not a separate component.
- Public React API must not expose Figma-only `state`, `focusVisible`, or `showIcon` controls.
- Do not add Button `size`, `danger`, or `success` APIs.
- Native/CSS semantics own hover, pressed, focus-visible, and disabled visuals.
- Native `disabled` uses the real `disabled` attribute. `loading` remains focusable, exposes `aria-busy="true"` and `aria-disabled="true"`, and suppresses duplicate activation without adopting disabled styling.
- Loading preserves the greater intrinsic width of normal and loading content.
- Loader motion is out of scope; the Figma busy glyph is static.
- All Button color, spacing, typography, radius, border, and icon-size values reference generated `--dse-*` variables. No copied raw foundation values.
- Light/Dark and English/Arabic are inherited token modes, not Button props.
- Component-private decisions remain local. Do not create new public tokens merely to satisfy implementation convenience.
- Internal helpers remain private even if future internal contracts are added.

---

## Task 1: Add contract infrastructure and `dse.button@1.0.0`

**Files:**
- Create: `packages/contracts/package.json`
- Create: `packages/contracts/tsconfig.json`
- Create: `packages/contracts/schema/component-contract.schema.json`
- Create: `packages/contracts/schema/pattern-contract.schema.json`
- Create: `packages/contracts/components/button.contract.json`
- Create: `packages/contracts/src/types.ts`
- Create: `packages/contracts/src/load.ts`
- Create: `packages/contracts/src/validate.ts`
- Create: `packages/contracts/tests/schema.test.ts`
- Create: `packages/contracts/tests/button.contract.test.ts`
- Create: `packages/contracts/tests/references.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces repository command `pnpm contracts:validate`.
- Produces validated component contract ID `dse.button`, version `1.0.0`.
- Produces reusable component and pattern JSON Schemas, but no future placeholder contracts.
- Contract package is private build/governance input and is not a runtime dependency of `@design-system-exercise/react`.

- [ ] **Step 1: Configure the private contracts package**

Create `packages/contracts/package.json`:

```json
{
  "name": "@design-system-exercise/contracts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "validate": "tsx src/validate.ts",
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "devDependencies": {
    "ajv": "8.17.1",
    "@types/node": "24.13.4",
    "tsx": "4.23.13",
    "typescript": "7.0.2",
    "vitest": "5.0.1"
  }
}
```

`packages/contracts/tsconfig.json` extends `../../tsconfig.base.json`, includes `src/**/*.ts` and `tests/**/*.ts`, and enables JSON module resolution already provided by the root config.

Add to root `package.json`:

```json
"contracts:validate": "pnpm --filter @design-system-exercise/contracts validate"
```

Run `pnpm install` so `pnpm-lock.yaml` captures Ajv and the workspace package.

- [ ] **Step 2: Write failing schema tests**

`schema.test.ts` must prove all of these fail before schemas are complete:

```ts
it('rejects a component without a stable id', () => {
  expect(validateComponent({ kind: 'component', version: '1.0.0' })).toEqual(
    expect.objectContaining({ valid: false }),
  );
});

it('rejects unknown component top-level fields', () => {
  const candidate = validComponentFixture();
  (candidate as Record<string, unknown>).invented = true;
  expect(validateComponent(candidate).valid).toBe(false);
});

it('rejects a pattern with a missing state model', () => {
  const candidate = validPatternFixture();
  delete (candidate as Record<string, unknown>).stateModel;
  expect(validatePattern(candidate).valid).toBe(false);
});
```

The schemas use `additionalProperties: false` at governed object boundaries. They require semantic version strings matching `^\\d+\\.\\d+\\.\\d+$` and contract IDs matching `^dse\\.[a-z0-9.-]+$`.

- [ ] **Step 3: Confirm RED**

```bash
pnpm --filter @design-system-exercise/contracts test -- schema.test.ts
```

Expected: FAIL because validator/schema implementation does not exist.

- [ ] **Step 4: Implement the component contract schema**

Require these top-level fields:

```text
$schema
id
kind
version
status
name
description
sources
publicApi
representations
anatomy
tokenDependencies
states
semantics
composition
events
forbidden
provenance
```

`kind` must equal `component`. `status` enum is `draft | approved | deprecated`.

`publicApi.props[]` requires `name`, `description`, `type`; `type` accepts exactly one of `boolean`, `content`, `native`, or an `enum` array. `default` is optional. `forwardNativeAttributes` is boolean.

`representations[]` requires `source`, `kind` (`public | derived | figma-only | native`), and `mapsTo`.

`anatomy[]` requires `name`, `required`, and `description`.

`states[]` requires `name`, `ownership` (`public | native | derived`), and `description`.

`semantics` requires `element`, `accessibleName`, `keyboardActivation`, and `focus`.

`composition` requires an `icon` rule with `optional` and `accessibleNameOwner` for Button-compatible contracts; keep the schema generic by allowing a keyed object of slot rules.

`events[]` requires `name`, `trigger`, and optional `suppressedWhen`.

`forbidden` is a unique string array.

`provenance` requires `lastReviewed` (`YYYY-MM-DD`) and non-empty `references`.

- [ ] **Step 5: Implement the pattern contract schema**

Require:

```text
$schema
id
kind
version
status
name
description
sources
componentDependencies
stateModel
transitions
invariants
exits
responsiveRules
runtimeRequirements
forbidden
provenance
```

`kind` must equal `pattern`. `componentDependencies[]` requires a contract ID and optional minimum version. `stateModel[]` requires state key + owner description. `transitions[]` requires `from`, `event`, `to`. `invariants`, `runtimeRequirements`, and `forbidden` are non-empty strings when present. This schema is validated using test fixtures only in this milestone; do not add a fake product pattern contract.

- [ ] **Step 6: Implement deterministic loaders and validators**

`src/types.ts` defines minimal TypeScript types matching the schema fields used by validation.

`src/load.ts`:

```ts
export const contractsRoot = fileURLToPath(new URL('../', import.meta.url));
export const componentsDir = join(contractsRoot, 'components');
export const patternsDir = join(contractsRoot, 'patterns');
```

Load only `*.contract.json`, sort paths before validation, and return parsed JSON plus source path.

`src/validate.ts` must:

1. compile both schemas with Ajv;
2. validate every component and pattern contract found;
3. reject duplicate IDs;
4. reject duplicate `id@version` pairs;
5. ensure every pattern component dependency resolves to an existing component contract when pattern files exist;
6. reject public component contracts whose `id` starts with `dse._`;
7. print deterministic `path: JSON-pointer: message` errors sorted by path and pointer;
8. exit non-zero on any error and zero only when all contracts validate.

Export `validateComponent` and `validatePattern` so tests can exercise schemas without spawning a process.

- [ ] **Step 7: Write the failing Button contract tests**

`button.contract.test.ts` must load `components/button.contract.json` and assert:

```ts
expect(contract.id).toBe('dse.button');
expect(contract.version).toBe('1.0.0');
expect(enumFor(contract, 'emphasis')).toEqual(['primary', 'secondary', 'text']);
expect(enumFor(contract, 'tone')).toEqual(['default', 'critical']);
expect(enumFor(contract, 'iconPosition')).toEqual(['leading', 'trailing']);
expect(contract.forbidden).toEqual(
  expect.arrayContaining(['state', 'focusVisible', 'showIcon', 'size', 'danger', 'success']),
);
expect(contract.sources.figma).toEqual({
  fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
  nodeId: '93:1230',
});
```

Also assert representation mappings include:

```text
figma.state.hover -> css:hover (derived)
figma.state.pressed -> css:active (derived)
figma.focusVisible -> css:focus-visible (derived)
figma.showIcon -> publicApi.icon presence (figma-only)
figma.state.disabled -> native disabled (native)
figma.state.loading -> publicApi.loading (public)
```

- [ ] **Step 8: Confirm Button contract RED**

```bash
pnpm --filter @design-system-exercise/contracts test -- button.contract.test.ts
```

Expected: FAIL because `button.contract.json` does not exist.

- [ ] **Step 9: Author `button.contract.json`**

The contract must encode exactly this public boundary:

```text
children         content, required visible label
emphasis         primary | secondary | text      default primary
tone             default | critical              default default
loading          boolean                         default false
loadingLabel     content                         default "Loading…"
icon             content, optional
iconPosition     leading | trailing               default leading
disabled         native boolean
forwardNativeAttributes = true
```

Semantics:

```text
element = button
accessibleName = visible children/loadingLabel; icon never owns the name
keyboardActivation = native
focus = focus-visible
native disabled = actual disabled state
loading = aria-busy true + aria-disabled true + focusable + activation suppressed
safe default type = button
```

Token dependencies are the public Button tokens already identified in the Figma/token audit, including primary/secondary/ghost/critical action colors, disabled surface/foreground, focus, border roles, control radius, spacing, icon size, and label typography. Do not reference `Button / Internal`, `Component / Icon Render`, or `Component / Layout` variables.

Provenance references include:

```text
figma:tYCXBBYoQ92AUKVbND5WkG:93:1230
https://equinor.github.io/component-contracts/
https://github.com/equinor/component-contracts
https://www.w3.org/WAI/ARIA/apg/patterns/button/
```

- [ ] **Step 10: Add reference/integrity tests**

`references.test.ts` must assert all component token dependencies begin with approved public namespaces and no contract references these excluded Figma implementation collection names:

```text
Button / Internal
Component / Icon Render
Component / Layout
```

Also assert no future placeholder contract files exist: the component contract directory contains exactly `button.contract.json` and the pattern directory contains zero `*.contract.json` files at the end of Task 1.

- [ ] **Step 11: Verify Task 1**

```bash
pnpm contracts:validate
pnpm --filter @design-system-exercise/contracts test
pnpm --filter @design-system-exercise/contracts typecheck
```

Expected: all pass and validator reports exactly one real component contract, `dse.button@1.0.0`.

- [ ] **Step 12: Commit Task 1**

```bash
git add package.json pnpm-lock.yaml packages/contracts
git commit -m "feat(contracts): govern Button API"
```

Update the progress tracker before Task 2 and obtain a fresh reviewer verdict for Task 1.

---

## Task 2: Activate the React package and implement the contract-backed Button API

**Files:**
- Modify: `packages/react/package.json`
- Modify: `packages/react/README.md`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/tsconfig.build.json`
- Create: `packages/react/vitest.config.ts`
- Create: `packages/react/src/button/Button.tsx`
- Create: `packages/react/src/button/Button.test.tsx`
- Create: `packages/react/src/button/Button.contract.test.ts`
- Create: `packages/react/src/index.ts`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `dse.button@1.0.0` as test/governance input only, native button attributes, and `@design-system-exercise/tokens`.
- Produces: `Button`, `ButtonProps`, `ButtonEmphasis`, `ButtonTone`, `ButtonIconPosition` from `@design-system-exercise/react`.
- React package must not include `@design-system-exercise/contracts` as a production dependency.

- [ ] **Step 1: Configure React package and test harness**

Make `packages/react/package.json` an npm-ready ESM package with `files: ["dist"]`, root JS/types exports, and `./styles.css` reserved for Task 4 build output.

Scripts:

```json
{
  "build": "tsc -p tsconfig.build.json",
  "test": "vitest run",
  "typecheck": "tsc --noEmit -p tsconfig.json"
}
```

Dependencies:

```text
@design-system-exercise/tokens = workspace:*
```

Peer dependency:

```text
react >=18.3.0 <20
```

Development dependencies include React/React DOM 19.3.0, their types, Testing Library, user-event, jest-dom, jsdom, Vitest 5.0.1, and TypeScript 7.0.2.

`tsconfig.json` extends the root config and sets `jsx: react-jsx`. `tsconfig.build.json` emits JS/declarations from `src` to `dist` and excludes tests.

- [ ] **Step 2: Write semantic API tests first**

```tsx
it('renders a native button with a safe default type', () => {
  render(<Button>Send invite</Button>);
  expect(screen.getByRole('button', { name: 'Send invite' })).toHaveAttribute('type', 'button');
});

it('uses native disabled semantics', () => {
  render(<Button disabled>Send invite</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});

it('exposes contract-backed emphasis and tone', () => {
  render(<Button emphasis="secondary" tone="critical">Remove</Button>);
  const button = screen.getByRole('button', { name: 'Remove' });
  expect(button).toHaveAttribute('data-emphasis', 'secondary');
  expect(button).toHaveAttribute('data-tone', 'critical');
});
```

Also verify native `name`, `value`, `aria-*`, `onClick` forwarding and a forwarded ref resolving to `HTMLButtonElement`.

- [ ] **Step 3: Add a failing contract parity test**

`Button.contract.test.ts` reads `../../../contracts/components/button.contract.json` from the test location. Assert the implementation's accepted runtime enum arrays match the contract exactly.

Define internal constants in `Button.tsx`:

```ts
export const buttonEmphases = ['primary', 'secondary', 'text'] as const;
export const buttonTones = ['default', 'critical'] as const;
export const buttonIconPositions = ['leading', 'trailing'] as const;
```

Keep them package-internal: do not re-export from `src/index.ts`.

The parity test compares those arrays to contract enums and verifies forbidden Figma-only names are not keys in a representative `ButtonProps` compile fixture.

- [ ] **Step 4: Confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.test.tsx Button.contract.test.ts
```

Expected: FAIL because Button implementation does not exist.

- [ ] **Step 5: Implement minimal public API**

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

Defaults:

```text
emphasis = primary
tone = default
loading = false
loadingLabel = Loading…
iconPosition = leading
type = button when omitted
```

Use `forwardRef`. Do not add public `state`, `focusVisible`, `showIcon`, `size`, `danger`, or `success` props.

- [ ] **Step 6: Verify Task 2**

```bash
pnpm contracts:validate
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
```

Expected: all pass.

- [ ] **Step 7: Commit Task 2**

```bash
git add packages/react pnpm-lock.yaml
git commit -m "feat(react): establish contracted Button API"
```

Update tracker and obtain fresh review before Task 3.

---

## Task 3: Implement token-driven Button visual states within the contract

**Files:**
- Create: `packages/react/src/button/Button.css`
- Create: `packages/react/src/button/Button.css.test.ts`
- Modify: `packages/react/src/button/Button.tsx`
- Modify: `packages/react/src/button/Button.contract.test.ts`

**Interfaces:**
- Consumes contract token dependency list and generated token CSS.
- Produces legal Button emphasis/tone, hover, active, focus-visible, and native disabled visuals.

- [ ] **Step 1: Write the CSS/contract test first**

Read Button contract `tokenDependencies` and Button CSS text. For each declared token dependency that applies to v1 visual styling, assert its generated CSS variable name appears in `Button.css`. Also reject raw color literals:

```ts
expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
```

Required variables include:

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
pnpm --filter @design-system-exercise/react test -- Button.css.test.ts Button.contract.test.ts
```

Expected: FAIL because Button CSS does not exist.

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

Use `--dse-spacing-semantic-gap-sm` for content gap and `--dse-icons-size-md` for icon/busy boxes. Use logical CSS properties for direction-sensitive geometry.

- [ ] **Step 4: Implement legal emphasis/tone matrix**

```text
primary/default:    primary bg + primary fg; primary hover/pressed
primary/critical:   critical bg + critical on-bg; critical hover/pressed
secondary/default:  secondary bg + secondary fg + secondary border; secondary hover/pressed
secondary/critical: secondary bg + critical fg + critical border; secondary hover/pressed
text/default:       transparent + ghost fg; ghost hover/pressed surfaces
text/critical:      transparent + critical fg; ghost hover/pressed surfaces
```

Use `:hover`, `:active`, and `:focus-visible`; never represent them with public props.

Focus:

```css
outline: var(--dse-border-role-focus) solid var(--dse-color-semantic-focus-default);
outline-offset: var(--dse-border-role-focus);
```

Disabled:

```text
primary:   surface.disabled + fg.disabled
secondary: surface.disabled + fg.disabled + border.subtle
text:      transparent + fg.disabled
```

Disabled visuals apply only to native `:disabled`, not `loading`.

- [ ] **Step 5: Verify Task 3**

```bash
pnpm contracts:validate
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
```

Expected: all pass.

- [ ] **Step 6: Commit Task 3**

```bash
git add packages/react/src/button
git commit -m "feat(react): style Button within contract"
```

Update tracker and obtain fresh review before Task 4.

---

## Task 4: Implement loading, icons, intrinsic width, RTL, and package assets

**Files:**
- Modify: `packages/react/package.json`
- Modify: `packages/react/src/button/Button.tsx`
- Modify: `packages/react/src/button/Button.css`
- Modify: `packages/react/src/button/Button.test.tsx`
- Modify: `packages/react/src/button/Button.contract.test.ts`
- Create: `packages/react/src/assets/loader-circle.svg`
- Create: `packages/react/scripts/copy-assets.mjs`

**Interfaces:**
- Consumes Figma loader source `86:11830` and contract loading/icon semantics.
- Produces stable-width loading, logical icon placement, non-activating busy state, and deterministic CSS/SVG build output.

- [ ] **Step 1: Add failing loading/interaction tests**

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

Also test:

- both normal/loading layers remain in intrinsic layout;
- inactive content is `aria-hidden`;
- icon output is absent when no icon is supplied;
- leading/trailing changes semantic DOM order without left/right margins;
- decorative icons are `aria-hidden`;
- `disabled + loading` remains natively disabled;
- loading semantics match the contract record.

- [ ] **Step 2: Confirm RED**

```bash
pnpm --filter @design-system-exercise/react test -- Button.test.tsx Button.contract.test.ts
```

Expected: FAIL on loading/composition behavior.

- [ ] **Step 3: Add exact loader asset**

Export Figma node `86:11830` and store the exact SVG bytes in `packages/react/src/assets/loader-circle.svg`. Do not redraw the glyph. Motion remains absent.

Reference it with:

```ts
const loaderUrl = new URL('../assets/loader-circle.svg', import.meta.url).href;
```

- [ ] **Step 4: Implement width-preserving content layers**

Put normal and loading content in the same grid cell so both contribute intrinsic width. Hide only the inactive visual layer with `visibility: hidden` plus `aria-hidden`; never `display: none` the measurement layer. Loading shows the static loader sized by `--dse-icons-size-md` plus `loadingLabel`.

- [ ] **Step 5: Implement logical icon placement and activation guard**

Render optional icon before/after label according to `iconPosition`. Use flex `gap` and inherited `direction`, so RTL mirrors logical leading/trailing without manual left/right swapping.

During loading, intercept activation:

```ts
if (loading) {
  event.preventDefault();
  return;
}
consumerOnClick?.(event);
```

Do not set native disabled only because loading is true.

- [ ] **Step 6: Add deterministic asset copy**

`packages/react/scripts/copy-assets.mjs`:

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

Change React build script to:

```json
"build": "tsc -p tsconfig.build.json && node scripts/copy-assets.mjs"
```

Missing required sources must fail the build through `copyFile`.

- [ ] **Step 7: Verify Task 4**

```bash
pnpm contracts:validate
pnpm --filter @design-system-exercise/react test
pnpm --filter @design-system-exercise/react typecheck
pnpm --filter @design-system-exercise/react build
```

Expected: all pass; `dist` includes JS, declarations, `styles.css`, and `assets/loader-circle.svg`.

- [ ] **Step 8: Commit Task 4**

```bash
git add packages/react
git commit -m "feat(react): complete contracted Button behavior"
```

Update tracker and obtain fresh review before Task 5.

---

## Task 5: Add Storybook contract documentation and four-context Figma parity

**Files:**
- Modify: `apps/storybook/package.json`
- Modify: `apps/storybook/.storybook/preview.tsx`
- Create: `apps/storybook/src/components/Button.stories.tsx`
- Create: `apps/storybook/src/components/Button.stories.test.ts`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes public `Button`, public React stylesheet, and `dse.button` contract as documentation/test evidence only.
- Produces Storybook controls constrained to contract values and a manual parity surface for Light/Dark + English/Arabic.

- [ ] **Step 1: Add React package to Storybook**

Add:

```json
"@design-system-exercise/react": "workspace:*"
```

Import `@design-system-exercise/react/styles.css` in `.storybook/preview.tsx` after token CSS.

Keep existing theme/language decorators authoritative:

```text
light / dark -> data-theme
english / arabic -> data-language en/ar + document dir ltr/rtl
```

Do not add Button-specific theme/language props.

- [ ] **Step 2: Write failing Storybook contract test**

Extract Storybook meta to an exported constant from `Button.stories.tsx` and assert:

```ts
expect(meta.argTypes?.emphasis?.options).toEqual(['primary', 'secondary', 'text']);
expect(meta.argTypes?.tone?.options).toEqual(['default', 'critical']);
expect(meta.argTypes?.iconPosition?.options).toEqual(['leading', 'trailing']);
expect(meta.argTypes).not.toHaveProperty('state');
expect(meta.argTypes).not.toHaveProperty('focusVisible');
expect(meta.argTypes).not.toHaveProperty('showIcon');
expect(meta.argTypes).not.toHaveProperty('size');
```

The test reads `dse.button` and compares Storybook enum options to the contract arrays rather than duplicating an unverified expectation.

- [ ] **Step 3: Confirm RED**

```bash
pnpm --filter @design-system-exercise/storybook test -- Button.stories.test.ts
```

If Storybook currently has no test script, add `vitest run` plus Vitest 5.0.1 to the Storybook dev dependencies in this task.

Expected: FAIL because Button stories do not exist.

- [ ] **Step 4: Add Button stories**

Navigation title:

```text
Components/Controls/Button
```

Stories:

```text
Playground
EmphasisMatrix
CriticalTone
Disabled
Loading
WithLeadingIcon
WithTrailingIcon
```

The matrix must show all legal `emphasis × tone` combinations; do not introduce unsupported variants.

Docs text must distinguish:

```text
Contract: legal public boundary — dse.button@1.0.0
Figma: visual/design representation — node 93:1230
React: runtime implementation
Knowledge guidance: when/why to choose Button
```

- [ ] **Step 5: Manually validate four inherited contexts**

Use the Storybook global controls and compare against Figma Button source:

```text
Light + English/LTR
Dark + English/LTR
Light + Arabic/RTL
Dark + Arabic/RTL
```

Check geometry, type, primary/secondary/text hierarchy, critical tone, disabled, loading width, focus-visible, and leading/trailing icon placement.

Record discrepancies in the progress tracker. Do not mark parity complete from a static test alone.

- [ ] **Step 6: Verify Task 5**

```bash
pnpm contracts:validate
pnpm --filter @design-system-exercise/storybook test
pnpm --filter @design-system-exercise/storybook typecheck
pnpm build-storybook
```

Expected: all automated commands pass and manual four-context comparison is recorded.

- [ ] **Step 7: Commit Task 5**

```bash
git add apps/storybook pnpm-lock.yaml
git commit -m "docs(storybook): document contracted Button"
```

Update tracker and obtain fresh review before Task 6.

---

## Task 6: Extend CI/package smoke tests and run the final contract milestone gate

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json` if root build ordering requires explicit React build
- Modify: `packages/react/package.json` if packed export metadata requires correction
- Modify: `docs/superpowers/plans/2026-09-16-button-react-progress.md`

**Interfaces:**
- Consumes validated contracts, tokens, React package, and Storybook.
- Produces permanent CI evidence that contract validation, runtime package, and clean consumer agree.

- [ ] **Step 1: Put contract validation before implementation gates**

CI order must include:

```text
pnpm install --frozen-lockfile
pnpm contracts:validate
pnpm tokens:validate
pnpm tokens:build
pnpm --filter @design-system-exercise/react build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Contract validation must fail the workflow before React packaging if the legal boundary is invalid.

- [ ] **Step 2: Extend packed consumer smoke test**

Pack both:

```bash
pnpm --dir packages/tokens pack --pack-destination "$PACK_DIR"
pnpm --dir packages/react pack --pack-destination "$PACK_DIR"
```

Assert React tarball contains at minimum:

```text
package/package.json
package/dist/index.js
package/dist/index.d.ts
package/dist/styles.css
package/dist/assets/loader-circle.svg
```

Assert it does not contain tests, source contract JSON, `packages/contracts`, or Storybook files.

Install both tarballs into a clean scratch npm project.

- [ ] **Step 3: SSR smoke-test public Button package**

Install React 19.3.0 and React DOM 19.3.0 in the scratch consumer, then:

```js
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@design-system-exercise/react';

const html = renderToStaticMarkup(
  React.createElement(Button, { emphasis: 'secondary', tone: 'critical' }, 'Remove'),
);

if (!html.includes('<button')) throw new Error('Button did not render native button');
if (!html.includes('data-emphasis="secondary"')) throw new Error('emphasis missing');
if (!html.includes('data-tone="critical"')) throw new Error('tone missing');
```

Resolve `@design-system-exercise/react/styles.css` and assert the file exists.

- [ ] **Step 4: Run the full local final gate**

```bash
pnpm install --frozen-lockfile
pnpm contracts:validate
pnpm tokens:validate
pnpm tokens:build
pnpm --filter @design-system-exercise/react build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Record exact test counts and exits in the progress tracker. Do not reuse earlier evidence.

- [ ] **Step 5: Run fresh final review**

Reviewer checklist:

```text
contract schema correctness
Button contract/Figma mapping
public vs Figma-only API boundary
no placeholder future contracts
React API parity with dse.button
no raw foundation colors/geometry outside public tokens
loading/disabled semantics
RTL logical layout
Storybook contract controls
package contents
CI order and clean-consumer proof
scope: Button only
```

Fix findings, rerun affected focused checks, rerun the complete final gate, and record correction commits.

- [ ] **Step 6: Verify GitHub Actions on exact final HEAD**

Push the implementation branch only when requested/authorized by the execution workflow. Wait for CI on the exact final commit and verify all jobs/checks passed. Do not merge.

- [ ] **Step 7: Complete the progress tracker**

Mark 6/6 only when the same final HEAD has:

```text
contracts:validate passing
contracts tests/typecheck passing
React focused tests/build/typecheck passing
full repo tests/typecheck passing
223-token validation/build still passing unless an explicitly reviewed token amendment occurred
Storybook production build passing
four-context manual Figma review recorded
packed tokens + React clean-consumer smoke passing
fresh final review with no unresolved findings
GitHub Actions passing
```

- [ ] **Step 8: Commit Task 6**

```bash
git add .github/workflows/ci.yml package.json packages/react/package.json docs/superpowers/plans/2026-09-16-button-react-progress.md
git commit -m "ci: verify contracted Button package"
```

## Final stop condition

Do not start Icon Button or any later component/pattern milestone automatically. Report the final Button contract + implementation evidence and wait for explicit authorization for the next contract-first plan.
