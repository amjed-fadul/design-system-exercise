# Token architecture

Token source files use DTCG-style leaves with `$type`, `$value`, and optional `$description`. Static sources contain normal nested token groups. Mode-aware sources declare `$extensions.design-system-exercise.modeAxis` and a complete `modes` array at the root, then provide one group per mode.

Aliases use `{dot.separated.logical.path}`. Source semantics keep these aliases instead of copying resolved values. Validation fails on malformed values, duplicate logical paths, incomplete modes, missing references, or circular references.

The three axes are independent: `theme` (`light`, `dark`), `language` (`english`, `arabic`), and `layout` (`wide`, `narrow`). Generated CSS maps them to `[data-theme]`, `[data-language]`, and `[data-layout]` selectors. English maps to `data-language="en"`; Arabic maps to `data-language="ar"`.

CSS custom properties use the `--dse-` prefix and preserve aliases with `var()`. Generated TypeScript exposes the same hierarchy with concrete resolved values and explicit mode groups.

Only public foundation and semantic tokens are exported. `Button / Internal`, `Component / Icon Render`, `Component / Layout`, `_preferences/*`, and `_layout/*` remain outside this package. Component-private styling should stay in the component layer unless it becomes a proven cross-system semantic decision.
