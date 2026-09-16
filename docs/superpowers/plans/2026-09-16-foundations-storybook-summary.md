# Foundations + Storybook plan summary

Goal: implement the first public foundations milestone for Design System Exercise as a pnpm workspace with an npm-ready tokens package, generated CSS and TypeScript outputs, Storybook documentation, and CI.

The milestone implements 223 public logical tokens across color, spacing, typography, border, radius, layout, icons, and elevation. Theme (`light`/`dark`), language (`english`/`arabic`), and layout (`wide`/`narrow`) remain independent mode axes. Figma-only helper variables and component-internal collections are excluded from the public token package.

`packages/tokens` is the only implemented publishable package in this milestone. `packages/react` and `packages/patterns` remain private reserved boundaries for later work. Storybook documents foundations only. Verification requires a frozen-lockfile install, token validation/build, tests, typecheck, Storybook production build, package tarball inspection, and a scratch-consumer import test. No npm publication, React component implementation, or merge is part of this milestone.

The full approved plan used for execution is retained in the conversation artifact; the repository architecture spec is the binding source of truth.
