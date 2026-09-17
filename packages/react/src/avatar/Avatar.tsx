import type { HTMLAttributes } from 'react';

export const avatarSizes = ['sm', 'lg'] as const;
export type AvatarSize = (typeof avatarSizes)[number];

export const avatarDefaults = {
  size: 'sm',
  fallback: '@',
} as const satisfies {
  size: AvatarSize;
  fallback: string;
};

type GovernedAvatarAttributes = 'children' | 'dangerouslySetInnerHTML' | 'role' | 'onClick' | 'aria-hidden';

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, GovernedAvatarAttributes | 'aria-label'> {
  initials?: string;
  size?: AvatarSize;
  'aria-label'?: string;
}

type RuntimeForbiddenAvatarProps = {
  children?: unknown;
  dangerouslySetInnerHTML?: unknown;
  role?: unknown;
  onClick?: unknown;
  src?: unknown;
  alt?: unknown;
  photo?: unknown;
  online?: unknown;
  presence?: unknown;
  status?: unknown;
  verified?: unknown;
  selected?: unknown;
  name?: unknown;
  href?: unknown;
  'aria-hidden'?: unknown;
};

export function Avatar(props: AvatarProps) {
  const {
    initials,
    size = avatarDefaults.size,
    className,
    'aria-label': ariaLabel,
    children: _ignoredChildren,
    dangerouslySetInnerHTML: _ignoredDangerouslySetInnerHTML,
    role: _ignoredRole,
    onClick: _ignoredOnClick,
    src: _ignoredSrc,
    alt: _ignoredAlt,
    photo: _ignoredPhoto,
    online: _ignoredOnline,
    presence: _ignoredPresence,
    status: _ignoredStatus,
    verified: _ignoredVerified,
    selected: _ignoredSelected,
    name: _ignoredName,
    href: _ignoredHref,
    'aria-hidden': _ignoredAriaHidden,
    ...spanProps
  } = props as AvatarProps & RuntimeForbiddenAvatarProps;

  const normalizedInitials = initials?.trim() ?? '';
  const normalizedLabel = ariaLabel?.trim() ?? '';
  const hasInitials = normalizedInitials.length > 0;
  const hasAccessibleLabel = normalizedLabel.length > 0;
  const content = hasInitials ? normalizedInitials : avatarDefaults.fallback;
  const rootClassName = className ? `dse-avatar ${className}` : 'dse-avatar';

  return (
    <span
      {...spanProps}
      className={rootClassName}
      data-size={size}
      data-content={hasInitials ? 'initials' : 'fallback'}
      role={hasAccessibleLabel ? 'img' : undefined}
      aria-label={hasAccessibleLabel ? normalizedLabel : undefined}
      aria-hidden={hasAccessibleLabel ? undefined : true}
    >
      {content}
    </span>
  );
}
