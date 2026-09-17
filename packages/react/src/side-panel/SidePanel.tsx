import { useId, type CSSProperties, type ReactNode } from 'react';
import { IconButton } from '../icon-button/IconButton.js';

export interface SidePanelProps {
  eyebrow?: string;
  header?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  showClose?: boolean;
  closeLabel?: string;
  onClose: () => void;
  className?: string;
  style?: CSSProperties;
}

export const sidePanelDefaults = {
  eyebrow: 'MEMBER DETAILS',
  showClose: true,
  closeLabel: 'Close panel',
} as const;

function assertNonEmptyEyebrow(eyebrow: string) {
  if (typeof eyebrow !== 'string' || eyebrow.trim().length === 0) {
    throw new Error('SidePanel requires a non-empty eyebrow for its accessible name.');
  }
}

function assertCloseLabel(showClose: boolean, closeLabel: string) {
  if (showClose && (typeof closeLabel !== 'string' || closeLabel.trim().length === 0)) {
    throw new Error('SidePanel requires a non-empty closeLabel when showClose is true.');
  }
}

export function SidePanel({
  eyebrow = sidePanelDefaults.eyebrow,
  header,
  children,
  actions,
  showClose = sidePanelDefaults.showClose,
  closeLabel = sidePanelDefaults.closeLabel,
  onClose,
  className,
  style,
}: SidePanelProps) {
  assertNonEmptyEyebrow(eyebrow);
  assertCloseLabel(showClose, closeLabel);

  const eyebrowId = useId();
  const classes = className ? `dse-side-panel ${className}` : 'dse-side-panel';

  return (
    <section className={classes} style={style} role="region" aria-labelledby={eyebrowId}>
      <div className="dse-side-panel__top-bar">
        <span id={eyebrowId} className="dse-side-panel__eyebrow">
          {eyebrow}
        </span>
        {showClose ? (
          <IconButton
            icon={<span className="dse-side-panel__close-icon" />}
            aria-label={closeLabel}
            onClick={onClose}
          />
        ) : null}
      </div>

      <div className="dse-side-panel__header">{header}</div>
      <div className="dse-side-panel__header-divider" aria-hidden="true" />

      <div className="dse-side-panel__body">{children}</div>

      <div className="dse-side-panel__footer-divider" aria-hidden="true" />
      <div className="dse-side-panel__actions">{actions}</div>
    </section>
  );
}
