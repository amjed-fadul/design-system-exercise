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

## Local CSS

Local CSS is not automatically a failure.

It is valid only when the decision belongs to product/composition ownership and is authorized by approved composition guidance, supplied product/Figma evidence, or a Storybook evidence frame.

Storybook evidence-frame authority applies only to documentation/testing. It never grants the same raw value authority to product UI.

## Unknown decisions

If the available contracts, tokens, approved guidance, and product evidence do not authorize a decision, the AI must not infer the answer from a finished Storybook story or prototype.

Record the decision as unresolved. That unresolved decision becomes evidence for the AI-readiness failure-classification phase.

## Storybook

Storybook is the human-visible review layer for this policy.

The **AI Readiness → Authoring Rules** story must render the canonical JSON policy directly so reviewers can inspect the exact rules an agent receives. Future composition stories must follow the same principle: machine-readable guidance first, visible Storybook evidence second.

## Scope boundary

This Task 2 policy defines **authoring authority**. It does not yet define the Directory, List → Detail, or Create-flow composition rules. Those belong to Task 3 of the active AI Readiness Validation V1 plan.
