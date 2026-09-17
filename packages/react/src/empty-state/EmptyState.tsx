import { useId, type CSSProperties, type ReactNode } from 'react';

export interface EmptyStateProps {
  title?: string;
  body?: string;
  showBody?: boolean;
  icon?: ReactNode;
  showIcon?: boolean;
  actions?: ReactNode;
}

export const emptyStateDefaults = {
  title: 'No people found',
  body: 'No names or email addresses match “zoe”.\nTry a different search or clear it to see everyone.',
  showBody: true,
  showIcon: true,
} as const;

const defaultIconUrl = new URL('../assets/search.svg', import.meta.url).href;
const defaultIconStyle = {
  '--dse-empty-state-icon-image': `url("${defaultIconUrl}")`,
} as CSSProperties;

function assertTitle(title: string) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('EmptyState requires a non-empty title.');
  }
}

function assertBody(showBody: boolean, body: string) {
  if (showBody && (typeof body !== 'string' || body.trim().length === 0)) {
    throw new Error('EmptyState requires a non-empty body when showBody is true.');
  }
}

export function EmptyState({
  title = emptyStateDefaults.title,
  body = emptyStateDefaults.body,
  showBody = emptyStateDefaults.showBody,
  icon,
  showIcon = emptyStateDefaults.showIcon,
  actions,
}: EmptyStateProps) {
  assertTitle(title);
  assertBody(showBody, body);

  const titleId = useId();
  const bodyId = useId();
  const hasActions = actions !== null && actions !== undefined && actions !== false;

  return (
    <section
      className="dse-empty-state"
      aria-labelledby={titleId}
      aria-describedby={showBody ? bodyId : undefined}
    >
      <div className="dse-empty-state__content">
        {showIcon ? (
          <div className="dse-empty-state__icon" aria-hidden="true">
            {icon ?? (
              <span className="dse-empty-state__default-icon" style={defaultIconStyle} />
            )}
          </div>
        ) : null}

        <div className="dse-empty-state__message" role="status" aria-atomic="true">
          <h2 id={titleId} className="dse-empty-state__title">
            {title}
          </h2>
          {showBody ? (
            <p id={bodyId} className="dse-empty-state__body">
              {body}
            </p>
          ) : null}
        </div>

        {hasActions ? <div className="dse-empty-state__actions">{actions}</div> : null}
      </div>
    </section>
  );
}
