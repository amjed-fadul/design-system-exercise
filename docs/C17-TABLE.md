# C17 — Table completion record

## Scope

C17 completes the Structure component wave with a scoped semantic four-column Table.

Figma authorities:

- Table — `152:3730`
- `_Table Header` — internal — `152:3685`
- `_Table Row` — internal — `152:3729`

Implementation branch: `feat/table`  
Implementation HEAD: `f281bf095e8f250c5260248a332dc5a062ef6253`

## Fresh Figma audit

A fresh read-only Figma audit was completed before any code changed.

The audit established:

- fixed semantic order: Primary / Secondary / Status / Action;
- public Table with one private header source and 1–100 private row sources;
- optional supplied footer copy;
- selected row as contextual detail association, not bulk selection;
- native table/header/cell relationships required;
- no sorting, pagination, bulk selection, search, editable cells, row expansion, or data-grid semantics;
- reviewed table widths of 736px minimum and 1168px wide;
- shared content widths of 100 / 160 / 128px for Secondary / Status / Action;
- shared gaps of 24 / 24 / 8px;
- 20px inline table inset;
- 44px header, 60px minimum content-growing rows with 6px block inset, and 48px footer.

The live `_Table Row` set contains exactly three variants:

- `state=default`
- `state=hover`
- `state=selected`

Its source description still contained stale wording claiming six variants and two rendering orders. The live structure did not contain an order variant or property, so C17 deliberately does not expose an `order` API.

## Contracts

Public contract:

- `dse.table@1.0.0`

Internal contracts:

- `dse._table-header@1.0.0`
- `dse._table-row@1.0.0`

Public Table API:

- `rows` — required readonly structured collection, 1–100 rows;
- `primaryLabel?` — default `Person`;
- `secondaryLabel?` — default `Role`;
- `statusLabel?` — default `Status`;
- `actionLabel?` — default `Details`;
- `footerText?` — optional product-supplied copy.

Each row is structurally:

```ts
{
  id: string;
  primary: ReactNode;
  secondary: ReactNode;
  status: ReactNode;
  action?: ReactNode;
  selected?: boolean;
}
```

Runtime validation rejects:

- zero rows or more than 100 rows;
- empty or duplicate row IDs;
- missing required Primary / Secondary / Status regions;
- non-boolean `selected` values;
- empty header labels.

No public children/Header slot, state/order prop, sort API, pagination API, selected-row collection, search/query API, theme prop, or generic styling API was introduced.

## Semantic and interaction boundary

The runtime is a real native `<table>` with:

- `<thead>`
- `<tbody>`
- four `<th scope="col">` headers
- exactly four `<td>` cells per row
- optional `<tfoot>`

Selected rows use presentation-only `data-selected="true"`. They do not add:

- `aria-selected`;
- checkbox/radio selection;
- select-all behavior;
- row-level activation;
- hidden focus targets;
- a selection callback;
- grid/listbox semantics.

Pointer hover is CSS-derived. Focus remains on genuine descendant controls such as the Action button.

## Geometry and token mapping

The implementation preserves the Figma column equation rather than treating the component as a generic grid:

- Primary absorbs remaining inline width;
- Secondary content: 100px;
- Status content: 160px;
- Action content: 128px;
- gaps: 24 / 24 / 8px;
- inline insets: 20px;
- minimum table inline width: 736px;
- reviewed wide width: 1168px.

The shell uses an inset subtle stroke so the Figma inside-border appearance does not steal width from the fixed column geometry.

Semantic token usage:

- header: surface/section + fg/secondary + Label/default;
- body: surface/default + border/subtle + hover/selected state tokens;
- footer: Caption/default;
- theme and writing direction are inherited;
- CSS uses logical properties for RTL.

Figma names the footer style “Caption/small”, but the actual governed variable path is `caption/default/*`; C17 uses the existing `--dse-typography-semantic-caption-default-*` tokens rather than inventing a nonexistent token family.

## Storybook evidence

Storybook covers:

- Default
- SelectedRow
- WithoutFooter
- Narrow736
- LongIdentity
- Dark
- Arabic
- DarkArabic

The stories compose existing governed Avatar, Status Badge, and Button components. Repeated row actions have person-specific accessible names.

## TDD and CI sequence

C17 was developed as isolated RED → GREEN gates.

- Run 386 — intentional contract RED: contract tests landed before contract files.
- Run 387 — contract GREEN.
- Run 388 — PASS after correcting footer typography dependencies to the existing Caption/default token path.
- Run 389 — intentional runtime RED: runtime/CSS/package tests landed before implementation.
- Run 390 — failed before tests because the generated React `package.json` had trailing literal `\\n` characters; manifest serialization was repaired.
- Run 391 — runtime/package tests passed; two CSS assertions failed because the test harness had lost regex escape characters.
- Run 392 — runtime GREEN after replacing fragile regex assertions with scoped CSS-rule checks.
- Run 393 — intentional Storybook RED: Storybook tests landed before `Table.stories.tsx`.
- Run 394 — all tests passed; strict Storybook typecheck caught an indexed fixture under `noUncheckedIndexedAccess`.
- Run 395 — full implementation PASS on `f281bf095e8f250c5260248a332dc5a062ef6253`.

Run 395 verification:

- Contracts: 84/84
- Tokens: 17/17
- React: 210/210
- Storybook: 55/55
- Total automated tests: 366
- Typecheck: PASS
- Storybook production build: PASS
- Packed-package/prepack verification: PASS, including `verify-table-dist.mjs`
- Component contracts: 23
- Pattern contracts: 0
- Logical tokens: 223

## Fresh final review

A fresh final review compared the complete C16 → C17 diff against the live Figma authorities again after implementation.

Result:

- no unresolved Critical findings;
- no unresolved Important findings;
- native semantics, fixed geometry, selected/hover boundaries, public/private export boundary, RTL inheritance, Storybook evidence, and packed distribution all align with the reviewed scope.

The review also reconfirmed that the live `_Table Row` source has only three state variants. The stale “six variants / two rendering orders” wording was corrected in Figma without changing geometry, variants, slots, properties, or component structure.

Figma read-back after the documentation-only sync confirmed:

- Table remains 1168×152;
- header remains 1168×44;
- Table children remain Header 44 / Rows 60 / Footer 48;
- header property set remains unchanged;
- row set remains exactly `state=default`, `state=hover`, `state=selected`, each 1168×60;
- the C17 implementation record is present on the Table authority;
- the stale six-variant sentence is absent;
- no `order` property or variant was introduced.

## Next milestone

C17 is the final Structure component.

After this completion record passes CI on its exact HEAD, the next milestone is **P01 — Application Shell**. P01 is not started by this record.
