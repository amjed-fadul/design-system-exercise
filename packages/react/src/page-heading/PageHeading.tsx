import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export interface PageHeadingProps {
  title: string;
  description?: string;
  showDescription?: boolean;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
}

export const pageHeadingDefaults = {
  showDescription: true,
} as const;

function assertTitle(title: string) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('PageHeading requires a non-empty title.');
  }
}

function countRenderedSlotChildren(content: ReactNode): number {
  let count = 0;

  Children.forEach(content, (child) => {
    if (child === null || child === undefined || typeof child === 'boolean') return;

    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      count += countRenderedSlotChildren(child.props.children);
      return;
    }

    count += 1;
  });

  return count;
}

function assertSlotLimit(name: 'breadcrumbs' | 'actions', content: ReactNode, maximum: number) {
  if (countRenderedSlotChildren(content) > maximum) {
    throw new Error(`PageHeading ${name} accepts at most ${maximum} rendered direct ${maximum === 1 ? 'child' : 'children'}.`);
  }
}

export function PageHeading({
  title,
  description,
  showDescription = pageHeadingDefaults.showDescription,
  breadcrumbs,
  actions,
}: PageHeadingProps) {
  assertTitle(title);
  assertSlotLimit('breadcrumbs', breadcrumbs, 1);
  assertSlotLimit('actions', actions, 2);

  const hasBreadcrumbs = countRenderedSlotChildren(breadcrumbs) > 0;
  const hasActions = countRenderedSlotChildren(actions) > 0;
  const hasDescription =
    showDescription && typeof description === 'string' && description.trim().length > 0;

  return (
    <div className="dse-page-heading">
      {hasBreadcrumbs ? (
        <div className="dse-page-heading__breadcrumbs">{breadcrumbs}</div>
      ) : null}

      <div className="dse-page-heading__row">
        <div className="dse-page-heading__text">
          <h1 className="dse-page-heading__title">{title}</h1>
          {hasDescription ? (
            <p className="dse-page-heading__description">{description}</p>
          ) : null}
        </div>

        {hasActions ? <div className="dse-page-heading__actions">{actions}</div> : null}
      </div>
    </div>
  );
}
