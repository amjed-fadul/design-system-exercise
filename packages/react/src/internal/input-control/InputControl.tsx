import type { ReactNode } from 'react';

export type InputControlSize = 'compact' | 'default';

export interface InputControlProps {
  children: ReactNode;
  size?: InputControlSize;
}

export function InputControl({ children, size = 'compact' }: InputControlProps) {
  return (
    <div className="dse-input-control" data-size={size}>
      {children}
    </div>
  );
}
