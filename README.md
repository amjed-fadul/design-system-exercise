# Design System Exercise

## What this demonstrates
A code-backed, bilingual design-system foundation with traceable Figma tokens, deterministic generated outputs, Storybook documentation, and automated verification.

## Current milestone
Foundations are implemented: color, spacing, typography, border, radius, layout, icons, and elevation. React components and product patterns are intentionally future work.

## Repository structure
- `packages/tokens` — public foundation token package
- `packages/react` — reserved for a later component milestone
- `packages/patterns` — reserved for a later pattern milestone
- `apps/storybook` — foundation documentation and visual validation
- `docs/architecture` — architecture and extension rules

## Getting started
```bash
nvm use
pnpm install
pnpm tokens:validate
pnpm tokens:build
pnpm storybook
```

## Commands
- `pnpm tokens:validate` validates token schema, modes, and references.
- `pnpm tokens:build` generates CSS and TypeScript package outputs.
- `pnpm test` runs workspace tests.
- `pnpm typecheck` typechecks workspaces.
- `pnpm build-storybook` builds the static documentation site.

## Figma-to-code token model
The source token model mirrors the audited public Figma foundations. Semantic values remain aliases in JSON; generated CSS preserves aliases with `var()`, while generated TypeScript exposes resolved immutable values. Internal component collections and Figma-only helper variables are excluded.

## Storybook
Storybook documents eight foundation sections and includes independent Light/Dark and English/Arabic global controls. Arabic switches the document to RTL and uses IBM Plex Sans Arabic.

## Future components and patterns
React components will be added one at a time under `packages/react` and must consume public tokens. Product patterns will live in `packages/patterns` and compose the React package. Neither package contains fake implementation in this milestone.

## Status
Milestone 1: foundations + generated token package + Storybook + CI. npm publication is intentionally deferred.
