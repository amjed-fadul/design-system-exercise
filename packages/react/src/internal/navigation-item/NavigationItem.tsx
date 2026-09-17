import type { ReactNode } from 'react';

export type NavigationItemMode = 'expanded' | 'compact';

export interface NavigationItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  mode: NavigationItemMode;
  current: boolean;
}

export function NavigationItem({
  label,
  href,
  icon,
  mode,
  current,
}: NavigationItemProps) {
  return (
    <a
      className="dse-navigation-item"
      href={href}
      aria-current={current ? 'page' : undefined}
      data-mode={mode}
      data-current={current ? 'true' : 'false'}
    >
      <span className="dse-navigation-item__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="dse-navigation-item__label">{label}</span>
    </a>
  );
}
