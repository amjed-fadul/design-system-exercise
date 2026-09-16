import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

export const buttonEmphases = ['primary', 'secondary', 'text'] as const;
export const buttonTones = ['default', 'critical'] as const;
export const buttonIconPositions = ['leading', 'trailing'] as const;

export type ButtonEmphasis = (typeof buttonEmphases)[number];
export type ButtonTone = (typeof buttonTones)[number];
export type ButtonIconPosition = (typeof buttonIconPositions)[number];

export const buttonDefaults = {
  emphasis: 'primary',
  tone: 'default',
  loading: false,
  loadingLabel: 'Loading…',
  iconPosition: 'leading',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  emphasis?: ButtonEmphasis;
  tone?: ButtonTone;
  loading?: boolean;
  loadingLabel?: ReactNode;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
}

const loaderUrl = new URL('../assets/loader-circle.svg', import.meta.url).href;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    emphasis = buttonDefaults.emphasis,
    tone = buttonDefaults.tone,
    loading = buttonDefaults.loading,
    loadingLabel = buttonDefaults.loadingLabel,
    icon,
    iconPosition = buttonDefaults.iconPosition,
    type = 'button',
    className,
    children,
    onClick,
    'aria-busy': ariaBusy,
    'aria-disabled': ariaDisabled,
    ...buttonProps
  },
  ref,
) {
  const classes = className ? `dse-button ${className}` : 'dse-button';

  const iconNode = icon ? (
    <span className="dse-button__icon" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  const normalContent =
    iconPosition === 'leading' ? (
      <>
        {iconNode}
        <span className="dse-button__label">{children}</span>
      </>
    ) : (
      <>
        <span className="dse-button__label">{children}</span>
        {iconNode}
      </>
    );

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const busyStyle = {
    '--dse-button-loader-image': `url("${loaderUrl}")`,
  } as CSSProperties;

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={classes}
      data-emphasis={emphasis}
      data-tone={tone}
      data-icon-position={iconPosition}
      aria-busy={loading ? true : ariaBusy}
      aria-disabled={loading ? true : ariaDisabled}
      onClick={handleClick}
    >
      <span className="dse-button__content">
        <span
          className="dse-button__layer dse-button__layer--normal"
          data-layer="normal"
          aria-hidden={loading ? true : undefined}
        >
          {normalContent}
        </span>
        <span
          className="dse-button__layer dse-button__layer--loading"
          data-layer="loading"
          aria-hidden={loading ? undefined : true}
        >
          <span className="dse-button__busy" aria-hidden="true" style={busyStyle} />
          <span className="dse-button__label">{loadingLabel}</span>
        </span>
      </span>
    </button>
  );
});
