# Component Contracts Architecture

**Date:** 2026-09-17  
**Status:** Approved design; implementation not started  
**Repository:** `amjed-fadul/design-system-exercise`  
**First governed implementation:** Button

## 1. Purpose

Add a machine-readable contract layer between design-system intent and runtime implementation so humans and agents can answer, deterministically, what a component or pattern is allowed to expose, compose, and guarantee.

The contract layer is not a replacement for Figma, React, Storybook, or the AI knowledge pack. Each surface has a distinct role:

- **Figma source** records factual design representation: properties, variants, anatomy, slots, and visual evidence.
- **Contract** defines the legal system boundary: public API, supported values, composition rules, semantics, states, events, invariants, and explicit prohibitions.
- **Implementation** realizes that contract in runtime code.
- **Knowledge pack** explains intent: when, why, and how an agent should choose and configure supported capability.
- **Validation** proves that contracts are well formed and that implementation stays within them.

## 2. Research basis

This architecture is informed by Equinor's public `component-contracts` proof of concept: one JSON contract per component, deterministic emitters, generated design documentation, and parity checks between emitted surfaces. The Equinor repository explicitly keeps the agent out of the build path: an agent may author source material, but deterministic tooling performs generation and verification.

References:

- https://equinor.github.io/component-contracts/
- https://github.com/equinor/component-contracts
- `packages/eds-contracts/contracts/button.contract.json` in the Equinor repository

Ideas adopted:

- one stable contract identity per governed unit;
- JSON Schema validation;
- explicit props, anatomy, variants/states, token channels, and semantics;
- deterministic validation rather than free-form AI interpretation;
- parity as an evidence problem, not a documentation claim.

Ideas deliberately deferred:

- contracts generating the entire React implementation;
- contracts generating the Figma library;
- a CLI or agent query service generated from contracts;
- a generic cross-surface parity renderer.

The first goal is a governed boundary that fits the existing React/Figma architecture without restructuring the project.

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

It stays `private: true` for the first milestone. It is governance/build input, not a public npm promise.

Do not add empty contract stubs for future components or patterns. Each future implementation milestone starts by authoring and validating that unit's real contract.

## 4. Five authority classes

### 4.1 Validated contract authority

A validated contract answers **what public capability is legally supported**.

Examples:

- allowed prop names and values;
- public vs native vs derived vs Figma-only representation;
- required native semantics;
- valid slots and child cardinality;
- declared component events;
- explicit unsupported properties or states;
- pattern state/invariants and required component dependencies.

Unknown governed fields, unknown enum values, invalid child types, and unresolved contract references fail validation.

### 4.2 Runtime implementation authority

Runtime code answers **what actually runs**. It must conform to the validated contract. A passing contract does not prove implementation correctness; runtime tests are separate evidence.

### 4.3 Live Figma authority

Figma answers **what the design representation actually contains**: component properties, variant axes, slots, anatomy, visual states, and prototypes.

A Figma control does not automatically become public runtime API. `focusVisible`, representation `state`, and `showIcon` are concrete examples where design representation and public React API intentionally differ.

### 4.4 Authored knowledge authority

The AI knowledge pack answers **when and why to use supported capability**. It may reject a contract-valid composition as semantically inappropriate for a given task, but it may never extend the contract.

### 4.5 External reference authority

External design systems, WCAG/APG material, and research sources inform specific principles. They never add an API to this design system.

### Conflict rule

If these authorities disagree, surface the conflict. Do not silently extend the contract from Figma, silently weaken runtime requirements from prose, or import capability from an external reference.

## 5. Fail-closed rule for agents

If a requested property, state, slot child, event, or pattern transition is absent from a validated contract, agents must not invent it.

Required response behavior:

1. reject the unsupported configuration;
2. name the violated contract and field when possible;
3. show the supported alternative if one exists;
4. surface an open requirement if the system genuinely needs a new capability.

Example after Button is validated:

```text
Rejected: Button tone="danger" and size="large".
Contract dse.button@1.0.0 permits tone="default" | "critical" and has no public size prop.
Use tone="critical" for destructive/high-risk actions; request a contract change if a size axis is required.
```

Before a validated contract exists, report `contract_validation=unavailable`. Planned IDs/versions may be named only when clearly labeled **planned/unvalidated**; they must never be presented as validated authority.

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

For the planned Button contract:

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
- native/runtime binding where relevant.

### 6.3 `representations`

Maps design/runtime representations to the legal public model.

For Button:

- Figma `state=hover|pressed` -> derived browser/CSS pseudo-state;
- Figma `focusVisible` -> derived `:focus-visible` state;
- Figma `showIcon` -> derived from presence of public icon content;
- Figma `state=disabled` -> native `disabled` state;
- Figma `state=loading` -> public `loading` prop.

This prevents accidental Figma-to-React API cloning.

### 6.4 `anatomy`

Defines named parts and structural relationships, not screenshot coordinates. Parts can identify optional/required content and token channels.

### 6.5 `tokenDependencies`

Lists public token paths the implementation may consume. Component-private styling decisions remain local and must not be promoted to global tokens merely to satisfy the contract.

### 6.6 `states`

Separates:

- **derived interaction states:** hover, pressed/active, focus-visible;
- **public semantic states:** loading when intentionally exposed by the API;
- **native states:** disabled when native semantics exist.

### 6.7 `semantics`

Defines required native element/role, accessible-name expectations, keyboard behavior, ARIA requirements, and focus behavior belonging to the component boundary.

A contract requirement is not proof that accessibility behavior passed runtime testing.

### 6.8 `composition`

Defines legal children/slots, cardinality, optionality, and whether a child is internal or public.

Internal helpers such as `_Input Control`, `_Radio Option`, `_Navigation Item`, `_Breadcrumb Link Item`, `_Table Header`, and `_Table Row` may receive internal contracts when needed by a parent implementation, but they are not exported publicly merely because a contract exists.

### 6.9 `events`

Declares component-owned interaction events only. Product operations and backend outcomes do not become component events merely because a component starts them.

### 6.10 `forbidden`

Records common unsupported inventions when they are likely agent failure modes. This is an explanatory guardrail in addition to strict schema/API validation.

## 7. Planned Button contract v1

Planned ID/version: `dse.button@1.0.0`.  
Current validation status: **unavailable** until Task 1 creates the JSON source and `pnpm contracts:validate` passes.

Planned public API:

```text
children         visible content/label
emphasis         primary | secondary | text      default primary
tone             default | critical              default default
loading          boolean                         default false
loadingLabel     content                         default "Loading…"
icon             optional content
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

Planned runtime semantics:

- native `<button>`;
- default `type="button"` when consumer omits type;
- keyboard activation remains native;
- native `disabled` is actual disabled state;
- `loading` remains focusable, sets `aria-busy="true"` and `aria-disabled="true"`, and suppresses duplicate activation;
- visible focus uses `:focus-visible`;
- decorative icon does not replace the accessible name;
- loading preserves the greater intrinsic width of normal/loading labels;
- loader motion is not part of v1.

Representation mapping:

- `tone="critical"` is the destructive/high-risk semantic axis; there is no separate Critical Button component;
- hover, pressed, and focus are runtime/CSS states despite existing as Figma representation states;
- no public size axis exists.

## 8. Pattern contract model

Patterns need a separate schema because a pattern coordinates state across multiple components instead of behaving like a giant component.

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

References component contract IDs and optionally minimum compatible versions. A pattern must not use undeclared component capability.

### 8.2 `stateModel`

Declares pattern-owned state such as query, selection, saved value, draft value, request outcome, and intended exit.

### 8.3 `transitions`

Captures only meaningful workflow transitions needed to validate the pattern; it is not a model of every browser event.

### 8.4 `invariants`

Examples from Edit/save/recover:

- choosing a new role updates draft only;
- known save failure keeps saved value and draft separate;
- success commits the draft before returning;
- dirty exit invokes the unsaved-change guard.

### 8.5 Ownership boundary

Patterns may coordinate request state, recovery, selection, navigation, and draft retention. Product/business code still owns real records, permissions, backend operations, policy decisions, and authoritative outcomes.

## 9. Validation model

Add `pnpm contracts:validate` at repository root.

Validation layers:

1. JSON Schema validation for component and pattern documents.
2. Unique IDs and valid semantic versions.
3. Cross-reference validation for component dependencies.
4. Public/internal visibility validation.
5. Contract-specific invariant checks that JSON Schema alone cannot express.
6. Button implementation parity tests during the Button milestone.

Validation is deterministic and offline. No LLM or network call is part of the contract validation/build path.

## 10. Contract-to-implementation parity for Button

The first milestone does not build a generic reflection engine. It adds focused tests proving public Button implementation agrees with the validated Button contract on:

- public enum values and defaults;
- exclusion of Figma-only/unsupported public props;
- native element semantics;
- loading and disabled behavior;
- declared token dependencies;
- Storybook controls using the same legal enum values rather than inventing variants.

Future milestones may generalize these checks after multiple components demonstrate a stable repeated shape.

## 11. AI knowledge pack changes

The Figma AI knowledge pack must use the word **contract** precisely rather than for API snapshots or prose pattern guidance.

Reading order:

1. `intent-map.md` — choose by intent.
2. `contracts.md` — legal machine boundary, status, and fail-closed behavior.
3. `foundations.md` — design/token facts and contexts.
4. relevant `components-*.md` — authored intent plus live Figma API snapshots.
5. `patterns-and-product.md` — workflow guidance/state ownership.
6. `agent-instructions.md` — assembly/reporting procedure.
7. `checks-and-limitations.md` — evidence and unverified requirements.
8. `references.md` — external principles and provenance.

Terminology:

- "exact source contract" -> "exact source API snapshot";
- "pattern contract" -> "pattern guidance" unless referring to a validated JSON pattern contract;
- planned contract IDs/versions may appear when explicitly labeled planned/unvalidated;
- only successful repository validation permits a contract to be cited as validated authority.

Inventory distinction:

- current Figma file: `tYCXBBYoQ92AUKVbND5WkG`;
- 247 local Figma variables across 15 collections at the 2026-09-17 audit;
- 223 public code tokens in the foundations repository milestone;
- the counts are intentionally not assumed to be 1:1 because Figma contains internal/helper variables excluded from public code API.

## 12. Migration order

1. Add schemas, deterministic validator, and real Button contract.
2. Make React Button implementation/tests verify the Button contract.
3. Show contract facts in Storybook documentation.
4. Add `contracts:validate` to CI.
5. For every later public component, author its contract before implementation completion.
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
- No claim that Figma documentation or contract validation proves runtime accessibility.

## 14. Acceptance criteria

The first contract milestone is complete only when:

- both JSON Schemas exist and reject malformed contracts;
- `dse.button@1.0.0` exists and validates;
- contract references are deterministic and offline;
- Button React API is demonstrably within the contract;
- Storybook presents contract-backed legal controls without inventing variants;
- CI runs contract validation before React package verification;
- the AI knowledge pack distinguishes contract, implementation, Figma API snapshot, guidance, and external reference;
- no validated-contract claim is made for future components/patterns without real validated JSON sources.
