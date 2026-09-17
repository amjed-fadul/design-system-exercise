import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '../icon-button/IconButton.js';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  showClose?: boolean;
  closeLabel?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export const dialogDefaults = {
  showClose: true,
  closeLabel: 'Close dialog',
} as const;

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusableElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) =>
      !element.hidden &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.tabIndex >= 0,
  );
}

function assertAccessibleTitle(title: ReactNode) {
  if (title === null || title === undefined || title === false) {
    throw new Error('Dialog requires a visible title for its accessible name.');
  }
  if (typeof title === 'string' && title.trim().length === 0) {
    throw new Error('Dialog requires a non-empty title.');
  }
}

function assertCloseLabel(showClose: boolean, closeLabel: string) {
  if (showClose && closeLabel.trim().length === 0) {
    throw new Error('Dialog requires a non-empty closeLabel when showClose is true.');
  }
}

type BackgroundState = {
  element: HTMLElement;
  inert: boolean;
  hadInertAttribute: boolean;
  ariaHidden: string | null;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  showClose = dialogDefaults.showClose,
  closeLabel = dialogDefaults.closeLabel,
  initialFocusRef,
}: DialogProps) {
  assertAccessibleTitle(title);
  assertCloseLabel(showClose, closeLabel);

  const titleId = useId();
  const descriptionId = useId();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [portalHost] = useState<HTMLElement | null>(() => {
    if (typeof document === 'undefined') return null;
    const host = document.createElement('div');
    host.className = 'dse-dialog-portal';
    return host;
  });

  useLayoutEffect(() => {
    if (!open || !portalHost || typeof document === 'undefined') return;

    document.body.appendChild(portalHost);
    return () => {
      portalHost.remove();
    };
  }, [open, portalHost]);

  useLayoutEffect(() => {
    if (!open || !portalHost || typeof document === 'undefined') return;

    const surface = surfaceRef.current;
    if (!surface) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const backgroundStates: BackgroundState[] = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element !== portalHost,
      )
      .map((element) => ({
        element,
        inert: element.inert,
        hadInertAttribute: element.hasAttribute('inert'),
        ariaHidden: element.getAttribute('aria-hidden'),
      }));

    for (const state of backgroundStates) {
      state.element.inert = true;
      state.element.setAttribute('aria-hidden', 'true');
    }

    const requestedFocus = initialFocusRef?.current;
    const firstFocusable = focusableElements(surface)[0];
    const focusTarget =
      requestedFocus && surface.contains(requestedFocus)
        ? requestedFocus
        : (firstFocusable ?? surface);
    focusTarget.focus();

    return () => {
      for (const state of backgroundStates) {
        state.element.inert = state.inert;
        if (state.hadInertAttribute && !state.element.hasAttribute('inert')) {
          state.element.setAttribute('inert', '');
        }
        if (!state.hadInertAttribute) {
          state.element.removeAttribute('inert');
        }

        if (state.ariaHidden === null) {
          state.element.removeAttribute('aria-hidden');
        } else {
          state.element.setAttribute('aria-hidden', state.ariaHidden);
        }
      }

      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [initialFocusRef, open, portalHost]);

  if (!open || !portalHost) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const surface = surfaceRef.current;
    if (!surface) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = focusableElements(surface);
    if (focusables.length === 0) {
      event.preventDefault();
      surface.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const focusIsInside = active instanceof Node && surface.contains(active);

    if (event.shiftKey && (!focusIsInside || active === first)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && (!focusIsInside || active === last)) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="dse-dialog__backdrop">
      <div
        ref={surfaceRef}
        className="dse-dialog__surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description !== undefined ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className="dse-dialog__header">
          <div className="dse-dialog__header-text">
            <h2 id={titleId} className="dse-dialog__title">
              {title}
            </h2>
            {description !== undefined ? (
              <p id={descriptionId} className="dse-dialog__description">
                {description}
              </p>
            ) : null}
          </div>
          {showClose ? (
            <IconButton
              icon={<span className="dse-dialog__close-icon" />}
              aria-label={closeLabel}
              onClick={() => onOpenChange(false)}
            />
          ) : null}
        </header>

        <div className="dse-dialog__body">{children}</div>

        {actions !== undefined ? (
          <>
            <div className="dse-dialog__divider" aria-hidden="true" />
            <div className="dse-dialog__actions">{actions}</div>
          </>
        ) : null}
      </div>
    </div>,
    portalHost,
  );
}
