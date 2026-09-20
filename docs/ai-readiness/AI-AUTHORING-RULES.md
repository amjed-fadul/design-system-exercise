# AI Authoring Rules

This document explains how to use the canonical AI authoring policy in this repository.

## Canonical source

The machine-readable source of truth is:

`packages/contracts/ai/authoring-policy.json`

It is validated by the contracts package. Storybook renders that policy for human review; Storybook does not own or override it.

## Authority order

When authoring product UI, resolve decisions in this order:

1. Approved component contracts.
2. Approved pattern contracts.
3. Governed tokens.
4. Approved composition guidance.
5. Supplied product/Figma evidence.

A later source may fill a decision that earlier sources intentionally leave to the consumer, but it must not contradict an earlier contract.

## How to use the policy

Each rule has:

- a stable rule ID;
- a category;
- a requirement level;
- a canonical statement;
- a rationale.

Requirement levels mean:

- **must** — required for a valid AI-authored result;
- **must-not** — prohibited;
- **may** — permitted only under the stated authority;
- **escalate** — record the unresolved decision or candidate DS gap instead of guessing.

## Token mode activation

Mode-token sources expose their generated CSS activation contract directly in `$extensions.design-system-exercise`.

Current governed mappings:

- theme: `data-theme` with `light → light` and `dark → dark`;
- language: `data-language` with `english → en` and `arabic → ar`;
- layout: `data-layout` with `wide → wide` and `narrow → narrow`.

Consumers may use these selectors because they are canonical token metadata. Do not infer selector conventions from generated CSS implementation source.

## Local CSS

Local CSS is not automatically a failure.

For product UI, it is valid only when the decision belongs to product/composition ownership and is authorized by approved composition guidance or supplied product/Figma evidence.

Storybook may use clearly labeled evidence-frame dimensions for deterministic documentation/testing, but those values never grant authority to product UI.

## Unknown decisions

If the available contracts, tokens, approved guidance, and product evidence do not authorize a production decision, the AI must not infer the answer from a finished Storybook story or prototype.

During an isolated evaluation or demo only, a deterministic placeholder may be used when an inspectable value is necessary and the production generation/allocation rule is unresolved. The placeholder must be explicitly identified as non-production evidence and must not imply a production format, allocation rule, or reusable product behavior.

The underlying production decision must still be recorded as unresolved. That unresolved decision remains evidence for the AI-readiness failure-classification phase.

## Storybook

Storybook is the human-visible review layer for this policy.

The **AI Readiness → Authoring Rules** story must render the canonical JSON policy directly so reviewers can inspect the exact rules an agent receives. Future composition stories must follow the same principle: machine-readable guidance first, visible Storybook evidence second.

## Scope boundary

This Task 2 policy defines **authoring authority**. It does not yet define the Directory, List → Detail, or Create-flow composition rules. Those belong to Task 3 of the active AI Readiness Validation V1 plan.
