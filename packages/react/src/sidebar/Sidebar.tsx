import type { ReactNode } from 'react';

import {
  NavigationItem,
  type NavigationItemMode,
} from '../internal/navigation-item/NavigationItem.js';

export type SidebarMode = NavigationItemMode;

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
}

export interface SidebarProps {
  mode?: SidebarMode;
  label?: string;
  items: readonly SidebarItem[];
  currentId: string;
  footer?: ReactNode;
}

export const sidebarDefaults = {
  mode: 'expanded',
  label: 'WORKSPACE',
} as const;

function assertNonEmptyString(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Sidebar requires a non-empty ${name}.`);
  }
}

function assertMode(mode: unknown): asserts mode is SidebarMode {
  if (mode !== 'expanded' && mode !== 'compact') {
    throw new Error('Sidebar mode must be "expanded" or "compact".');
  }
}

function assertItems(items: unknown): asserts items is readonly SidebarItem[] {
  if (!Array.isArray(items) || items.length < 1 || items.length > 8) {
    throw new Error('Sidebar requires between 1 and 8 destination items.');
  }

  const ids = new Set<string>();
  for (const item of items) {
    if (!item || typeof item !== 'object') {
      throw new Error('Sidebar destination items must be objects.');
    }

    const candidate = item as Partial<SidebarItem>;
    assertNonEmptyString(candidate.id, 'item id');
    assertNonEmptyString(candidate.label, 'item label');
    assertNonEmptyString(candidate.href, 'item href');

    if (candidate.icon === null || candidate.icon === undefined || candidate.icon === false) {
      throw new Error('Sidebar destination items require an icon.');
    }

    if (ids.has(candidate.id)) {
      throw new Error('Sidebar destination item ids must be unique.');
    }
    ids.add(candidate.id);
  }
}

function assertCurrentId(items: readonly SidebarItem[], currentId: unknown): asserts currentId is string {
  assertNonEmptyString(currentId, 'currentId');
  const currentMatches = items.filter((item) => item.id === currentId);
  if (currentMatches.length !== 1) {
    throw new Error('Sidebar currentId must match exactly one destination item.');
  }
}

export function Sidebar({
  mode = sidebarDefaults.mode,
  label = sidebarDefaults.label,
  items,
  currentId,
  footer,
}: SidebarProps) {
  assertMode(mode);
  assertNonEmptyString(label, 'label');
  assertItems(items);
  assertCurrentId(items, currentId);

  const showFooter = mode === 'expanded' && footer !== null && footer !== undefined && footer !== false;

  return (
    <nav className="dse-sidebar" aria-label={label} data-mode={mode}>
      <div className="dse-sidebar__navigation-section">
        {mode === 'expanded' ? (
          <div className="dse-sidebar__group-label" aria-hidden="true">
            {label}
          </div>
        ) : null}

        <ul className="dse-sidebar__navigation-list">
          {items.map((item) => (
            <li className="dse-sidebar__navigation-list-item" key={item.id}>
              <NavigationItem
                label={item.label}
                href={item.href}
                icon={item.icon}
                mode={mode}
                current={item.id === currentId}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="dse-sidebar__flexible-space" aria-hidden="true" />

      {showFooter ? <div className="dse-sidebar__footer">{footer}</div> : null}
    </nav>
  );
}
