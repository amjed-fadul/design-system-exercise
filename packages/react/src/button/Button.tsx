import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

export const buttonEmphases = ['primary', 'secondary', 'text'] as const;
export const buttonTones = ['default', 'critical'] as const;
export const buttonIconPositions = ['leading', 'trailing'] as const;

export type ButtonEmphasis = (typeof buttonEmphases)[number];
export type ButtonTone = (typeof buttonTones)[number];
export type ButtonIconPosition = (typeof buttonIconPositions)[number];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  emphasis?: ButtonEmphasis;
  tone?: ButtonTone;
  loading?: boolean;
  loadingLabel?: ReactNode;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    emphasis = 'primary',
    tone = 'default',
    loading = false,
    loadingLabel = 'Loading…',
    icon,
    iconPosition = 'leading',
    type = 'button',
    children,
    ...buttonProps
  },
  ref,
) {
  // Loading and icon composition are governed public inputs but their visual/
  // behavioral implementation lands in Task 4. Destructure them now so they
  // never leak as unknown DOM attributes while the semantic API is established.
  void loading;
  void loadingLabel;
  void icon;

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      data-emphasis={emphasis}
      data-tone={tone}
      data-icon-position={iconPosition}
    >
      {children}
    </button>
  );
});
