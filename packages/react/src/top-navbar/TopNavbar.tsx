import { Children, type ReactNode } from 'react';

export interface TopNavbarProps {
  brand?: ReactNode;
  contextLabel?: string;
  showContext?: boolean;
  account?: ReactNode;
}

export const topNavbarDefaults = {
  contextLabel: 'Workspace administration',
  showContext: true,
} as const;

function assertVisibleContextLabel(showContext: boolean, contextLabel: string) {
  if (showContext && (typeof contextLabel !== 'string' || contextLabel.trim().length === 0)) {
    throw new Error('TopNavbar requires a non-empty contextLabel when showContext is true.');
  }
}

function assertSingleSlotChild(name: 'brand' | 'account', content: ReactNode) {
  if (Children.count(content) > 1) {
    throw new Error(`TopNavbar ${name} accepts at most one direct child.`);
  }
}

export function TopNavbar({
  brand,
  contextLabel = topNavbarDefaults.contextLabel,
  showContext = topNavbarDefaults.showContext,
  account,
}: TopNavbarProps) {
  assertVisibleContextLabel(showContext, contextLabel);
  assertSingleSlotChild('brand', brand);
  assertSingleSlotChild('account', account);

  return (
    <header className="dse-top-navbar" data-order="forward">
      <div className="dse-top-navbar__content">
        <div className="dse-top-navbar__brand" dir="auto">
          {brand}
        </div>
        {showContext ? (
          <span className="dse-top-navbar__context" dir="auto">
            {contextLabel}
          </span>
        ) : null}
        <div className="dse-top-navbar__flexible-space" aria-hidden="true" />
        <div className="dse-top-navbar__account" dir="auto">
          {account}
        </div>
      </div>
    </header>
  );
}
