# Design System Exercise — Repository Design

**Date:** 2026-09-16  
**Status:** Approved architecture; implementation not started  
**Target repository:** `design-system-exercise` (public)  
**Design source:** Figma file `Design System Exercise (Arabic/English, Light/Dark)`

## 1. Purpose

Create a public, npm-ready design-system repository that begins with the audited Figma foundations and can grow without restructuring when React components and product patterns are added later.

The first implementation milestone is foundations only: encode the current design tokens as code, generate consumable CSS and TypeScript outputs, document them in Storybook, and establish validation and CI. Components and patterns are explicit future package boundaries, not fake placeholder implementations.

## 2. Goals

1. Preserve the cleaned Figma token architecture in code.
2. Keep token source data framework-agnostic.
3. Support Light/Dark color modes and English/Arabic typography modes from the first release.
4. Produce CSS custom properties and typed TypeScript exports from one token source.
5. Install Storybook as the documentation and visual-validation surface.
6. Make the monorepo ready for future React components and patterns without moving existing files later.
7. Keep public foundation tokens separate from component-internal implementation tokens.
8. Add automated checks for schema validity, alias resolution, generated outputs, type safety, and Storybook builds.
9. Keep the repository suitable for future npm publishing, while deferring actual npm publication until package scope ownership is confirmed.

## 3. Non-goals for the first milestone

- No production React components yet.
- No product patterns yet.
- No Figma-to-code automatic sync pipeline yet.
- No npm publication yet.
- No visual redesign of the Figma foundations.
- No component-internal Figma variables exported as public design tokens.
- No attempt to encode Figma-only documentation helper variables as consumer-facing tokens.

## 4. Chosen architecture

Use a **pnpm workspace monorepo** with React + TypeScript as the future component runtime and DTCG-style JSON as the token source format.

```text
design-system-exercise/
├── apps/
│   └── storybook/
├── packages/
│   ├── tokens/
│   ├── react/
│   └── patterns/
├── docs/
│   ├── architecture/
│   └── superpowers/specs/
├── .github/workflows/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

`packages/tokens` is implemented in milestone 1. `packages/react` and `packages/patterns` are reserved package boundaries for later milestones. They should contain only package metadata or explanatory README files until real implementations are approved; do not add dummy components or patterns.

## 5. Package boundaries

### `packages/tokens`

The source of truth for code-side design tokens. It contains DTCG-style JSON source files, validation/build tooling, tests, and generated artifacts.

Planned public package name: `@design-system-exercise/tokens`.

This scope is a repository architecture decision, not a claim that the npm scope is currently owned. Before first public npm release, confirm ownership; if unavailable, change the scope before publishing.

### `packages/react`

Future React + TypeScript components. Components must consume `@design-system-exercise/tokens`; they must not copy raw token values into component code.

Planned public package name: `@design-system-exercise/react`.

### `packages/patterns`

Future composed product patterns. Patterns depend on the React component package rather than recreating lower-level UI primitives.

Planned public package name: `@design-system-exercise/patterns`.

### `apps/storybook`

Storybook is a workspace application, not a publishable package. It consumes the packages through their public workspace interfaces, so documentation reflects the same APIs future product applications use.

## 6. Token source model

Token source files use DTCG-style objects with `$value`, `$type`, and optional `$description`. References use aliases rather than duplicating semantic values.

Example:

```json
{
  "color": {
    "primitive": {
      "brand": {
        "600": {
          "$type": "color",
          "$value": "#005DCC"
        }
      }
    },
    "semantic": {
      "action": {
        "primary": {
          "bg": {
            "$type": "color",
            "$value": "{color.primitive.brand.600}"
          }
        }
      }
    }
  }
}
```

The build pipeline resolves references only when producing output artifacts. Source semantic tokens remain aliases so provenance is preserved.

## 7. Foundation domains in milestone 1

The initial code token package mirrors the cleaned Figma foundations:

- Color / Primitive
- Color / Semantic
- Spacing / Primitive
- Spacing / Semantic
- Typography / Primitive
- Typography / Semantic
- Border
- Radius
- Layout / Primitive
- Layout / Semantic
- Icons
- Elevation

The code representation may use domain directories rather than Figma collection names, but token names and semantic intent must remain traceable to Figma.

### Cleaned semantic additions that must be included

- `action/critical/bg`
- `action/critical/on-bg`
- `action/critical/fg`
- `action/critical/hover`
- `action/critical/pressed`
- `action/critical/border`
- `gap/lg`
- `container/lg`
- `section/xl`

### Typography requirements

- Latin family: `Geist`
- Arabic family: `IBM Plex Sans Arabic`
- Typography semantic modes: `English`, `Arabic`
- Arabic mode must preserve the audited Arabic-specific line heights rather than changing only font family.

### Color requirements

- Color semantic modes: `Light`, `Dark`
- Semantic values alias color primitives.
- Critical action semantics alias the existing red/neutral system rather than introducing raw component colors.

### Layout requirements

- Layout semantic modes: `Wide`, `Narrow`
- Layout semantic values alias layout primitives.

## 8. Public versus internal token policy

The code token package exports foundation and semantic tokens intended for consumers.

The following Figma implementation collections are **not** public foundation-token inputs:

- `Button / Internal`
- `Component / Icon Render`
- `Component / Layout`

These are component implementation details. When the React Button and other components are implemented later, component-local styling decisions should live in the component layer and consume public foundation/semantic tokens.

Figma helper variables such as `_preferences/*` and `_layout/show-*` are not consumer-facing package tokens unless a future runtime requirement explicitly justifies them.

## 9. Source directory design

```text
packages/tokens/
├── src/
│   ├── color/
│   │   ├── primitive.tokens.json
│   │   └── semantic.tokens.json
│   ├── spacing/
│   │   ├── primitive.tokens.json
│   │   └── semantic.tokens.json
│   ├── typography/
│   │   ├── primitive.tokens.json
│   │   └── semantic.tokens.json
│   ├── border/
│   │   └── border.tokens.json
│   ├── radius/
│   │   └── radius.tokens.json
│   ├── layout/
│   │   ├── primitive.tokens.json
│   │   └── semantic.tokens.json
│   ├── icons/
│   │   └── icons.tokens.json
│   └── elevation/
│       └── elevation.tokens.json
├── scripts/
├── tests/
├── dist/
└── package.json
```

Generated `dist` content is deterministic and rebuilt from `src`; generated files are not hand-edited.

## 10. Generated outputs

Milestone 1 generates two public formats.

### CSS

Generate CSS custom properties for use by web applications and Storybook.

Theme-sensitive values use explicit selectors/attributes. The exact selectors will be stable and documented, for example:

```css
:root,
[data-theme="light"] { ... }

[data-theme="dark"] { ... }

[data-language="en"] { ... }

[data-language="ar"] { ... }
```

Color theme and typography language are independent dimensions; selecting Arabic must not implicitly select Dark or vice versa.

### TypeScript

Generate immutable typed exports suitable for React and other TypeScript consumers. Generated output must preserve a predictable token hierarchy and expose mode-aware semantic values without requiring consumers to parse JSON.

## 11. Storybook

Install Storybook in `apps/storybook` using React + TypeScript.

Milestone 1 navigation:

```text
Foundations
├── Colors
├── Typography
├── Spacing
├── Borders
├── Radius
├── Layout
├── Icons
└── Elevation
```

Storybook requirements:

- Light/Dark toolbar or equivalent global control.
- English/Arabic typography control independent from theme.
- RTL demonstration for Arabic typography specimens.
- Primitive and semantic color specimens.
- Semantic token names visible alongside rendered values.
- Spacing, border, radius, icon-size/stroke, layout, and elevation specimens.
- No component stories until components actually exist.

When future components are added, Storybook navigation expands to `Components` and then `Patterns` without replacing the foundations area.

## 12. Future React component architecture

Components will be added one at a time under `packages/react`.

Rules:

1. Components consume public tokens rather than raw design values.
2. Public component props model independent behavioral/visual dimensions separately.
3. Component-internal implementation tokens do not become global public tokens merely because a component needs them.
4. Storybook stories cover supported variants, states, themes, English/Arabic behavior where relevant, and accessibility.
5. The audited Button contract is the intended model: independent emphasis, tone, state, icon position, content properties, and focus visibility.

## 13. Future pattern architecture

Patterns are composed flows or larger reusable interaction structures. They live in `packages/patterns` and may depend on `packages/react` and `packages/tokens`.

Patterns must not reimplement component primitives. Their value is coordination, state, recovery, composition, and usage intent.

## 14. Build and tooling

Root tooling uses pnpm workspaces and TypeScript project configuration shared through `tsconfig.base.json`.

Milestone 1 root commands should provide a stable interface such as:

- `pnpm build`
- `pnpm test`
- `pnpm typecheck`
- `pnpm storybook`
- `pnpm build-storybook`
- `pnpm tokens:build`
- `pnpm tokens:validate`

Implementation may use a small custom TypeScript build script or a standards-compatible token transformer. Prefer the smallest dependency surface that can reliably support DTCG aliases and multi-dimensional outputs; do not adopt a large token platform unless its capabilities are actually needed.

## 15. Validation and tests

Milestone 1 quality gates:

1. **Schema validation** — every source token has a valid type/value shape.
2. **Reference validation** — all aliases resolve; cycles and missing references fail the build.
3. **Mode completeness** — Light/Dark, English/Arabic, and Wide/Narrow semantic tokens contain the modes expected by their domain.
4. **Snapshot validation** — generated CSS and TypeScript outputs are deterministic.
5. **Typecheck** — all TypeScript tooling and Storybook code passes `tsc`.
6. **Storybook build** — static Storybook build completes successfully.
7. **No-public-internals check** — component-internal Figma token groups are not exported by the foundation package.

## 16. CI

Add GitHub Actions for pull requests and pushes to `main`.

CI runs from a clean install and executes:

1. pnpm install with lockfile enforcement
2. token validation
3. token build
4. tests
5. typecheck
6. Storybook static build

The initial CI should favor reliability and understandable failures over a complicated release pipeline.

## 17. npm-readiness and releases

The repository is structurally npm-ready from day one, but milestone 1 does not publish packages.

Before first publication:

- confirm the chosen npm scope is owned and usable;
- define package versions and release notes;
- add a release/versioning tool only when there is an actual release workflow to automate;
- confirm which packages are public.

Avoid adding Changesets or automated npm credentials in milestone 1 unless publication is explicitly requested.

## 18. Documentation

The repository README will explain:

- what the exercise demonstrates;
- how Figma maps to code;
- how to install and run the workspace;
- how to start Storybook;
- package boundaries;
- current status (foundations implemented; components/patterns upcoming).

Architecture documentation will explain token naming, modes, aliases, public/internal boundaries, and contribution rules for adding future token domains, components, and patterns.

## 19. Error handling and failure policy

Build scripts fail loudly on malformed tokens, unresolved aliases, circular references, invalid modes, or duplicate generated variable names. They must not silently substitute fallback values.

Generated outputs are treated as derived artifacts: source JSON is fixed when outputs fail rather than patching generated files manually.

## 20. Success criteria for milestone 1

Milestone 1 is complete when:

- the public GitHub repository exists;
- pnpm workspace installs cleanly;
- the audited Figma foundation tokens are represented in DTCG-style source files;
- CSS and TypeScript token builds succeed;
- Light/Dark, English/Arabic, and Wide/Narrow dimensions are represented correctly;
- Storybook documents all foundation domains and builds statically;
- CI passes from a clean checkout;
- `packages/react` and `packages/patterns` have stable future boundaries without fake implementations;
- no public token export exposes Figma component-internal collections.

## 21. Implementation order

The implementation plan should proceed in this order:

1. Repository/workspace scaffold.
2. Token schema and validation foundation.
3. Token source migration from the audited Figma model.
4. CSS + TypeScript generation.
5. Token tests and snapshots.
6. Storybook installation and foundation stories.
7. Root scripts and developer documentation.
8. GitHub Actions CI.
9. Final clean-checkout verification.

No React component or pattern implementation belongs in this milestone.
