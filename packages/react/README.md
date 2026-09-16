# @design-system-exercise/react

Public React components for Design System Exercise.

The package consumes `@design-system-exercise/tokens` at runtime and is governed by validated contracts from the private workspace package `@design-system-exercise/contracts`. Contracts are build/test governance input only; they are not a production dependency of this package.

The first governed component is Button (`dse.button@1.0.0`). Public component APIs intentionally translate Figma representation into runtime semantics instead of copying every Figma control into React props.
