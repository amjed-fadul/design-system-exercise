# Component Contracts Architecture

**Date:** 2026-09-17  
**Status:** Approved design; implementation not started  
**Repository:** `amjed-fadul/design-system-exercise`  
**First governed implementation:** Button

## 1. Purpose

Add a machine-readable contract layer between design-system intent and runtime implementation so humans and agents can answer, deterministically, what a component or pattern is allowed to expose, compose, and guarantee.

The contract layer is not a replacement for Figma, React, Storybook, or the AI knowledge pack. It gives each surface a precise role:

- **Figma source** records factual design properties, variants, anatomy, and visual evidence.
- **Contract** defines the legal system boundary: public API, supported values, composition rules, semantics, states, events, invariants, and explicit prohibitions.
- **Implementation** realizes that contract in React or pattern code.
- **Knowledge pack** explains intent: when, why, and how an agent should choose and configure the supported system.
- **Validation** proves that contracts are well formed and that implementation stays within them.

## 2. Research basis

This architecture is informed by Equinor's public `component-contracts` proof of concept: one JSON contract per component, deterministic emitters, generated design documentation, and parity checks between emitted surfaces. The Equinor repository explicitly keeps the agent out of the build path: an agent may author a source contract, but deterministic tooling performs generation and verification.

Reference:

- https://equinor.github.io/component-contracts/
- https://github.com/equinor/component-contracts
- `packages/eds-contracts/contracts/button.contract.json` in the Equinor repository

Useful ideas adopted from that work:

- one stable contract identity per governed unit;
- JSON Schema validation;
- explicit props, anatomy, variants/states, token channels, and semantics;
- deterministic validation rather than free-form AI interpretation;
- parity as an evidence problem, not a documentation claim.

Ideas deliberately deferred in this repository:

- contracts generating the whole React implementation;
- contracts generating the Figma library;
- a CLI or agent query service generated from contracts;
- a full cross-surface parity renderer.

Those are possible later milestones. The first goal is a governed boundary that the existing React/Figma architecture can consume without restructuring the project.

## 3. Package boundary

Add a private workspace package:

```text
packages/contracts/
├── package.json
├── schema/
│   ├── component-contract.schema.json
│   └── pattern-contract.schema.json
├── components/
│   └── button.contract.json
├── patterns/
├── src/
│   ├── load.ts
│   ├── validate.ts
│   └── types.ts
└── tests/
    ├── schema.test.ts
    ├── button.contract.test.ts
    └── references.test.ts
```

Package name: `@design-system-exercise/contracts`.

It stays `private: true` for the first contract milestone. It is governance/build input, not a public npm promise yet.

Do not add empty contract stubs for future components or patterns. Each future implementation milestone starts by authoring and validating that unit's real contract.

## 4. Authority model

Use four distinct authority classes.

### 4.1 Contract authority

A validated contract answers **what is legally supported**.

Examples:

- allowed prop names and values;
- whether a value is public API, a Figma-only representation control, or derived browser/runtime state;
- required native semantics;
- valid slots and child cardinality;
- declared events;
- explicit unsupported properties or states;
- pattern state/invariants and required component dependencies.

Unknown contract fields, unknown enum values, invalid child types, and unresolved contract references fail validation.

### 4.2 Implementation authority

Runtime code answers **what actually runs**. It must conform to the contract. A passing contract does not prove the implementation is correct; runtime tests are separate evidence.

### 4.3 Knowledge authority

The AI knowledge pack answers **when and why to use a supported capability**. It may reject a contract-valid composition as semantically inappropriate for a given task, but it may never extend the contract.

### 4.4 External references

External design systems, WCAG/APG material, and research sources inform principles. They never add an API to this design system.

## 5. Fail-closed rule for agents

If a requested property, state, slot child, event, or pattern transition is absent from the validated contract, agents must not invent it.

Required response behavior:

1. reject the unsupported configuration;
2. name the violated contract and field when possible;
3. show the supported alternative if one exists;
4. surface an open requirement if the system genuinely needs a new capability.

Example:

```text
Rejected: Button tone="danger" and size="large".
Contract dse.button permits tone="default" | "critical" and has no public size prop.
Use tone="critical" for destructive/high-risk actions; request a contract change if a size axis is required.
```

## 6. Component contract model

Every public component eventually gets one contract in `packages/contracts/components/`.

Required top-level fields:

```text
$schema
id
kind = "component"
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

### 6.1 `sources`

Records traceability without making every source equivalent authority.

For Button:

```json
{
  "figma": {
    "fileKey": "tYCXBBYoQ92AUKVbND5WkG",
    "nodeId": "93:1230"
  },
  "implementationPackage": "@design-system-exercise/react"
}
```

### 6.2 `publicApi`

Defines consumer-facing properties only. A Figma variant does not automatically become a React prop.

Each prop declares:

- name;
- type or enum;
- default where appropriate;
- semantic description;
- runtime/native binding where relevant.

### 6.3 `representations`

Maps non-public representation controls to the public/runtime model.

For Button:

- Figma `state=hover|pressed` -> derived browser/CSS pseudo-state;
- Figma `focusVisible` -> derived `:focus-visible` state;
- Figma `showIcon` -> derived from presence of the public `icon` value;
- Figma `state=disabled` -> native `disabled` prop/state;
- Figma `state=loading` -> public `loading` prop.

This prevents accidental Figma-to-React API cloning.

### 6.4 `anatomy`

Defines named parts and their structural relationship, not absolute screenshots. Parts can identify optional/required content and token channels.

### 6.5 `tokenDependencies`

Lists public token paths the implementation may consume. Component-private CSS decisions remain local and must not be promoted to global tokens merely to satisfy the contract.

### 6.6 `states`

Separates:

- **derived interaction states:** hover, pressed/active, focus-visible;
- **public semantic states:** loading when intentionally exposed by the component API;
- **native state:** disabled when native semantics exist.

### 6.7 `semantics`

Defines required element/role, accessible-name expectations, keyboard behavior, ARIA requirements, and focus behavior that belong to the component boundary.

A contract requirement is not proof that accessibility behavior passed runtime testing.

### 6.8 `composition`

Defines legal children/slots, cardinality, optionality, and whether a child is internal or public.

Internal helpers such as `_Input Control`, `_Radio Option`, `_Navigation Item`, `_Breadcrumb Link Item`, `_Table Header`, and `_Table Row` may have internal contracts when needed by their parent implementation, but they are not exported as public components solely because they have contracts.

### 6.9 `events`

Declares component-owned interaction events only. Product operations and backend outcomes do not become component events merely because a component starts them.

### 6.10 `forbidden`

Explicitly records common unsupported inventions when they are likely agent failure modes. It is a guardrail, not a substitute for schema validation.

## 7. Button contract v1

The first contract ID is `dse.button`, version `1.0.0`.

Public API:

```text
children         ReactNode / visible label
emphasis         primary | secondary | text      default primary
tone             default | critical              default default
loading          boolean                         default false
loadingLabel     ReactNode                        default "Loading…"
icon             optional ReactNode
iconPosition     leading | trailing               default leading
disabled         native button attribute
native button attributes are forwarded unless they conflict with governed behavior
```

Explicitly not public API:

```text
state
focusVisible
showIcon
size
danger
success
```

Runtime semantics:

- native `<button>`;
- default `type="button"` when consumer omits type;
- keyboard activation remains native;
- native `disabled` is actual disabled state;
- `loading` remains focusable, sets `aria-busy="true"` and `aria-disabled="true"`, and suppresses duplicate activation;
- visible focus uses `:focus-visible`;
- optional decorative icon does not replace the accessible name;
- loading preserves the greater intrinsic width of normal/loading labels;
- loader motion is not part of v1.

Visual/representation mapping:

- `tone="critical"` is the destructive/high-risk semantic axis; there is no separate Critical Button component;
- `hover`, `pressed`, and focus are runtime/CSS states, despite existing as Figma representation states;
- no public size axis exists.

## 8. Pattern contract model

Patterns need a separate schema because a pattern coordinates state and multiple components rather than behaving like one giant component.

Required top-level fields:

```text
$schema
id
kind = "pattern"
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

### 8.1 `componentDependencies`

References component contract IDs and optionally minimum compatible versions. A pattern must not use an undeclared component capability.

### 8.2 `stateModel`

Declares pattern-owned state such as query, selection, saved value, draft value, request outcome, and intended exit.

### 8.3 `transitions`

Captures only the meaningful workflow transitions needed to validate the pattern. It is not intended to model every browser event.

### 8.4 `invariants`

Examples from Edit/save/recover:

- choosing a new role updates draft only;
- known save failure keeps saved value and draft separate;
- success commits the draft before returning;
- dirty exit invokes the unsaved-change guard.

### 8.5 Ownership boundary

Patterns may coordinate request state, recovery, selection, navigation, and draft retention. Product/business code still owns real records, permissions, backend operations, policy decisions, and authoritative outcomes.

## 9. Validation model

Add `pnpm contracts:validate` at the repository root.

Validation layers:

1. JSON Schema validation for component and pattern documents.
2. Unique IDs and valid semantic versions.
3. Cross-reference validation for component dependencies.
4. Public/internal visibility validation.
5. Contract-specific invariant checks that JSON Schema alone cannot express.
6. Button implementation parity tests during the Button milestone.

The build is deterministic. No LLM or network call is part of contract validation.

## 10. Contract-to-implementation parity for Button

The first milestone does not build a generic reflection engine. It adds focused tests proving the public Button implementation agrees with `dse.button` on:

- public enum values and defaults;
- rejected Figma-only/unsupported props at the type/API boundary;
- native element semantics;
- loading and disabled behavior;
- declared token dependencies;
- Storybook controls being derived from the same legal enum values rather than inventing additional variants.

Future milestones may generalize these checks once at least two or three components prove the repeated shape.

## 11. AI knowledge pack changes

The Figma AI knowledge pack must stop using the word "contract" loosely for API snapshots and pattern guidance.

Add `contracts.md · governed machine boundary` and update the reading order:

1. `intent-map.md` — choose by intent.
2. `contracts.md` — legal machine boundary and fail-closed behavior.
3. `foundations.md` — design/token facts and contexts.
4. relevant `components-*.md` — authored intent plus Figma source API snapshots.
5. `patterns-and-product.md` — workflow guidance/state ownership.
6. `agent-instructions.md` — assembly/reporting procedure.
7. `checks-and-limitations.md` — evidence and unverified requirements.
8. `references.md` — external principles and provenance.

Terminology:

- "exact source contract" -> "exact source API snapshot";
- "pattern contract" -> "pattern guidance" unless referring to a validated JSON pattern contract;
- contract IDs/versions must be quoted only when the corresponding JSON contract has been validated.

The pack must also distinguish the current inventories:

- current Figma file: `tYCXBBYoQ92AUKVbND5WkG`;
- 247 local Figma variables across 15 collections at the time of this audit;
- 223 public code tokens in the foundations repository milestone;
- these counts are intentionally not assumed to be 1:1 because Figma contains internal/helper variables excluded from the public code API.

## 12. Migration order

1. Add schemas, validator, and the real Button contract.
2. Make React Button implementation/tests consume or verify the Button contract.
3. Show Button contract facts in Storybook documentation.
4. Add `contracts:validate` to CI.
5. For every later public component, author its contract before implementation.
6. For internal helpers, add contracts only when needed by a parent contract/implementation; never publish them by default.
7. When pattern implementation begins, author the relevant pattern contract before product-flow code.

Do not create placeholder contracts for all future units up front.

## 13. Non-goals for this milestone

- No full contract-driven code generation.
- No automatic Figma generation from JSON.
- No Code Connect rollout.
- No contract package publication to npm.
- No generic agent/CLI service.
- No implementation of components beyond Button.
- No implementation of product patterns yet.
- No claim that Figma documentation proves runtime accessibility.

## 14. Acceptance criteria

The architecture is established when:

- the two JSON Schemas exist and reject malformed contracts;
- `dse.button@1.0.0` validates;
- contract references are deterministic and offline;
- Button React API is demonstrably within the contract;
- Storybook presents contract-backed legal controls without inventing variants;
- CI runs contract validation before React package verification;
- the AI knowledge pack distinguishes contract, implementation, Figma API snapshot, guidance, and external reference;
- no contract claims are made for future components/patterns that do not yet have validated JSON files.
