# Internal Contract Visibility Extension Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Execute this bounded schema extension immediately before C04 Text Field, when the first governed internal helper is introduced.

**Goal:** Extend the component-contract schema so internal helper contracts can be validated deterministically without becoming public component contracts or package exports.

**Architecture:** C01 Button intentionally establishes the smallest public-component schema. C04 is the first milestone that needs an internal helper contract (`_Input Control`). At that point the schema gains an explicit `visibility` field and validator rules that distinguish public vs internal component contracts. Existing `dse.button` is migrated explicitly to `visibility="public"` in the same change.

**Tech Stack:** JSON Schema, Ajv 8, TypeScript 7, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-09-17-component-contracts-design.md` plus the full-system roadmap.

## Files

- Modify `packages/contracts/schema/component-contract.schema.json`
- Modify `packages/contracts/src/types.ts`
- Modify `packages/contracts/src/validate.ts`
- Modify `packages/contracts/components/button.contract.json`
- Modify `packages/contracts/tests/schema.test.ts`
- Modify `packages/contracts/tests/button.contract.test.ts`
- Create `packages/contracts/tests/internal-visibility.test.ts`

## Contract rule

Every component contract gains:

```json
"visibility": "public"
```

Legal values:

```text
public
internal
```

Rules:

- public contract IDs must match `^dse\.(?!_)[a-z0-9.-]+$`;
- internal contract IDs must match `^dse\._[a-z0-9.-]+$`;
- internal contracts must not declare a public implementation package export;
- internal contracts may be referenced by a public parent contract's composition/internal-parts metadata;
- pattern `componentDependencies` may reference public component contracts only unless a future architecture change explicitly permits internal references;
- the React public barrel/package exports must never be inferred from contract existence.

## TDD steps

- [ ] Add failing schema tests:

```ts
it('rejects dse._ ids when visibility is public', () => {
  const c = validComponentFixture({ id: 'dse._input-control', visibility: 'public' });
  expect(validateComponent(c).valid).toBe(false);
});

it('accepts dse._ ids when visibility is internal', () => {
  const c = validComponentFixture({ id: 'dse._input-control', visibility: 'internal' });
  expect(validateComponent(c).valid).toBe(true);
});

it('rejects a public id marked internal', () => {
  const c = validComponentFixture({ id: 'dse.button', visibility: 'internal' });
  expect(validateComponent(c).valid).toBe(false);
});
```

- [ ] Run `pnpm --filter @design-system-exercise/contracts test -- internal-visibility.test.ts` and confirm RED.
- [ ] Add required `visibility` to component schema and TypeScript type.
- [ ] Add validator cross-check for ID prefix vs visibility.
- [ ] Add `"visibility": "public"` to `dse.button@1.0.0` and update its test.
- [ ] Run `pnpm contracts:validate`, contracts tests, and contracts typecheck; expect PASS.
- [ ] Run full repo tests/typecheck to prove the schema migration does not break C01-C03.
- [ ] Fresh review.
- [ ] Commit `feat(contracts): distinguish internal component contracts`.
- [ ] Record the extension SHA in the master progress tracker under C04 before creating `dse._input-control`.

This extension is deliberately deferred until C04 so C01 remains the smallest contract infrastructure needed for Button and no fake internal contract exists before a real parent requires it.