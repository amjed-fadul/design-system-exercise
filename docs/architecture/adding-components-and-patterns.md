# Adding components and patterns

React components belong in `packages/react` and should be introduced one at a time in approved milestones. Every component consumes `@design-system-exercise/tokens`; raw foundation values must not be copied into component code. Component-private styling decisions remain local by default rather than becoming global tokens.

Product patterns belong in `packages/patterns`. Patterns compose components from the React package instead of recreating lower-level primitives.

Every future component or pattern milestone must add Storybook coverage and focused tests alongside its implementation. The reserved packages contain no production implementation until those milestones are approved.
