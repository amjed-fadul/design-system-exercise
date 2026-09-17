import { BreadcrumbLinkItem } from '../internal/breadcrumb-link-item/BreadcrumbLinkItem.js';

export interface BreadcrumbAncestor {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  ancestors: readonly BreadcrumbAncestor[];
  currentLabel: string;
  ariaLabel?: string;
}

export const breadcrumbsDefaults = {
  ariaLabel: 'Breadcrumbs',
} as const;

function assertNonEmptyString(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Breadcrumbs requires a non-empty ${name}.`);
  }
}

function assertAncestors(value: unknown): asserts value is readonly BreadcrumbAncestor[] {
  if (!Array.isArray(value) || value.length < 1) {
    throw new Error('Breadcrumbs requires at least one ancestor.');
  }

  for (const ancestor of value) {
    if (!ancestor || typeof ancestor !== 'object') {
      throw new Error('Breadcrumbs ancestors must be objects.');
    }

    const candidate = ancestor as Partial<BreadcrumbAncestor>;
    assertNonEmptyString(candidate.label, 'ancestor label');
    assertNonEmptyString(candidate.href, 'ancestor href destination');
  }
}

export function Breadcrumbs({
  ancestors,
  currentLabel,
  ariaLabel = breadcrumbsDefaults.ariaLabel,
}: BreadcrumbsProps) {
  assertAncestors(ancestors);
  assertNonEmptyString(currentLabel, 'current label');
  assertNonEmptyString(ariaLabel, 'navigation aria label');

  return (
    <nav className="dse-breadcrumbs" aria-label={ariaLabel}>
      <ol className="dse-breadcrumbs__list">
        {ancestors.map((ancestor, index) => (
          <li
            className="dse-breadcrumbs__ancestor"
            key={`${ancestor.href}-${ancestor.label}-${index}`}
          >
            <BreadcrumbLinkItem label={ancestor.label} href={ancestor.href} />
          </li>
        ))}
        <li className="dse-breadcrumbs__current">
          <span aria-current="page">{currentLabel}</span>
        </li>
      </ol>
    </nav>
  );
}
