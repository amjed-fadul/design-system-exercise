import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, children, ...anchorProps },
  ref,
) {
  const classes = className ? `dse-link ${className}` : 'dse-link';

  return (
    <a {...anchorProps} ref={ref} className={classes}>
      {children}
    </a>
  );
});
