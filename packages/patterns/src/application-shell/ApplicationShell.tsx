import {
  cloneElement,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { SidebarProps } from '@design-system-exercise/react';
import { tokens } from '@design-system-exercise/tokens';

export type ApplicationShellViewportMode = 'auto' | 'expanded' | 'compact';
export type ApplicationShellResolvedMode = Exclude<ApplicationShellViewportMode, 'auto'>;

export interface ApplicationShellProps {
  sidebar: ReactElement<SidebarProps>;
  topNavbar: ReactNode;
  pageHeading?: ReactNode;
  children: ReactNode;
  viewportMode?: ApplicationShellViewportMode;
}

export const applicationShellDefaults = {
  viewportMode: 'auto',
} as const;

const expandedBreakpoint = tokens.layout.primitive.breakpoint['expanded-shell'];
const expandedMediaQuery =
  `(min-width: ${expandedBreakpoint.value}${expandedBreakpoint.unit})`;

function assertViewportMode(
  viewportMode: unknown,
): asserts viewportMode is ApplicationShellViewportMode {
  if (
    viewportMode !== 'auto' &&
    viewportMode !== 'expanded' &&
    viewportMode !== 'compact'
  ) {
    throw new Error(
      'ApplicationShell viewportMode must be "auto", "expanded", or "compact".',
    );
  }
}

function getExpandedViewportSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }
  return window.matchMedia(expandedMediaQuery).matches;
}

function subscribeToExpandedViewport(onStoreChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(expandedMediaQuery);
  const handleChange = () => onStoreChange();

  mediaQueryList.addEventListener('change', handleChange);
  return () => mediaQueryList.removeEventListener('change', handleChange);
}

function useAutoExpandedViewport() {
  return useSyncExternalStore(
    subscribeToExpandedViewport,
    getExpandedViewportSnapshot,
    () => true,
  );
}

export function ApplicationShell({
  sidebar,
  topNavbar,
  pageHeading,
  children,
  viewportMode = applicationShellDefaults.viewportMode,
}: ApplicationShellProps) {
  assertViewportMode(viewportMode);

  const autoExpanded = useAutoExpandedViewport();
  const resolvedMode: ApplicationShellResolvedMode =
    viewportMode === 'auto'
      ? autoExpanded
        ? 'expanded'
        : 'compact'
      : viewportMode;

  const sidebarWithResolvedMode = cloneElement(sidebar, {
    mode: resolvedMode,
  });

  const showPageHeading =
    pageHeading !== undefined && pageHeading !== null && pageHeading !== false;

  return (
    <div
      className="dse-application-shell"
      data-viewport-mode={viewportMode}
      data-mode={resolvedMode}
      data-layout={resolvedMode === 'expanded' ? 'wide' : 'narrow'}
    >
      <div className="dse-application-shell__top-navbar">{topNavbar}</div>

      <div className="dse-application-shell__workspace">
        <div className="dse-application-shell__sidebar">
          {sidebarWithResolvedMode}
        </div>

        <main className="dse-application-shell__main">
          {showPageHeading ? (
            <div className="dse-application-shell__page-heading">
              {pageHeading}
            </div>
          ) : null}

          <div className="dse-application-shell__content">{children}</div>
        </main>
      </div>
    </div>
  );
}
