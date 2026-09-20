# AI Composition Guidance

Task 3 converts the composition gaps found in the CSS audit into machine-readable guidance before creating any new runtime pattern.

## Canonical sources

The canonical records live in:

- `packages/contracts/ai/compositions/directory-page.guidance.json`
- `packages/contracts/ai/compositions/modal-list-detail.guidance.json`
- `packages/contracts/ai/compositions/create-flow.guidance.json`

All three records are **approved**. Every structural region also records explicit ownership as `design-system`, `composition`, `product`, or `workflow`.

Storybook renders these records for human review under **AI Readiness → Composition Guidance**. Storybook is not the source of truth.

## Directory Page

Defines the ordering and ownership of:

1. Page Heading.
2. Search + product-owned result summary.
3. Table for non-empty results or Empty State for zero results.

It also captures:

- governed region spacing;
- logical search/summary placement;
- product-evidenced Search Field width authority;
- horizontal overflow ownership when Table cannot compress further;
- compact stacking below the governed Application Shell breakpoint;
- intrinsic-LTR product data inside RTL UI;
- record-specific Table action names.

## Modal List → Detail

Defines the composition that the Side Panel contract deliberately leaves to its host:

1. Table action opens detail.
2. composition-owned modal host overlays the directory;
3. governed Side Panel provides detail regions;
4. an optional governed Dialog may temporarily own nested modal interaction.

The host owns:

- modal dialog semantics;
- background inertness;
- focus entry/containment/restoration;
- Escape behavior;
- placement below Application Shell Top Navbar;
- logical inline-end attachment;
- selected-row association;
- modal-host stacking through the governed `--dse-elevation-plane-overlay` z-index authority rather than an invented raw stacking value.

### Explicit unresolved behavior

**Narrow-screen List → Detail behavior remains unresolved.**

The current evidence does not authorize an AI to invent a drawer, full-page detail route, bottom sheet, or other narrow presentation. A blind authoring task must escalate this gap unless product evidence or future approved guidance supplies the answer.

## Create Flow

Defines:

1. governed Button trigger;
2. governed Dialog;
3. governed form controls selected by the product data model;
4. optional Inline Feedback for recoverable failure;
5. governed Buttons in Dialog actions.

The product/workflow owns field state, validation, request phase, retry behavior and outcomes.

The deterministic fail-then-retry behavior used in prototypes is explicitly marked as demo behavior, not design-system guidance.

### Scope boundary

Create Flow applies when the primary outcome is creation of the first-class product entity or record represented by the flow.

Invite/invitation, add-member, and access-grant workflows remain product-owned Dialog workflows unless separate approved guidance explicitly brings them into Create Flow scope. They may use the same governed components, but similarity of component composition alone does not make Create Flow their authority.

## Boundary

These records are **guidance-only**. They do not create public React APIs and they do not add runtime patterns to `@design-system-exercise/patterns`.

A future runtime pattern requires evidence from blind AI evaluation or another product requirement proving guidance alone is insufficient.
