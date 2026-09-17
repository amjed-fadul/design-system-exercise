# Component Contracts Visibility Amendment

**Date:** 2026-09-17  
**Status:** Implemented and verified during C04 Text Field  
**Extends:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md`

This amendment supersedes the original spec wherever it described internal contract visibility as a future extension.

## Implemented visibility model

Every component contract now requires:

```json
"visibility": "public" | "internal"
```

Rules:

- public contract IDs use `dse.<name>` and must not begin `dse._`;
- internal contract IDs use `dse._<name>`;
- internal contracts cannot declare a public `sources.implementationPackage`;
- pattern `componentDependencies` resolve against public component contracts only;
- contract existence never implies a React package export;
- public/internal package exposure is verified independently from schema validity.

The original schema field name `publicApi` is retained for backward compatibility. For `visibility="public"`, it defines the consumer-facing API. For `visibility="internal"`, it defines the governed helper input surface available only to design-system implementation code; it does **not** create a public package API.

Likewise, a representation with `kind="public"` means the representation maps to that contract's explicitly governed API surface. Contract `visibility` determines whether that surface is consumer-public or implementation-internal.

## First internal governed helper

`dse._input-control@1.0.0` is the first validated internal component contract.

- Figma source: `111:22`
- visibility: `internal`
- implementation package export: none
- governed internal axis: `size=compact|default`
- Figma visual `state` remains derived from the descendant native input
- no `InputControl` symbol is exported from `@design-system-exercise/react`

The public parent `dse.text-field@1.0.0` references `dse._input-control` through composition metadata while keeping the helper unavailable to consumers.

## Evidence

- Visibility-schema RED: GitHub Actions run 102 on `a496b8718b29b2406fb4f455a2463e2e35226121`.
- Visibility-schema GREEN: GitHub Actions run 110 on `497116b7c96c7d126fd29bc9a69fded1c69d1dde`.
- Installed-package C04 verification checks both the positive public `TextField` export and the negative `InputControl` export boundary.

Future internal helpers reuse this model unless a later architecture change is explicitly versioned and reviewed.
