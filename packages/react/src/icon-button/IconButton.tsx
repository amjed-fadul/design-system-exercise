import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, type = 'button', className, ...buttonProps },
  ref,
) {
  const classes = className ? `dse-icon-button ${className}` : 'dse-icon-button';

  return (
    <button {...buttonProps} ref={ref} type={type} className={classes}>
      <span className="dse-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
});
