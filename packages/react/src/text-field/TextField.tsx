import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { InputControl } from '../internal/input-control/InputControl.js';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'children'> {
  label: ReactNode;
  supportingText?: ReactNode;
  invalid?: boolean;
  errorMessage?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    supportingText,
    invalid = false,
    errorMessage,
    id,
    required,
    disabled,
    className,
    'aria-describedby': consumerDescribedBy,
    'aria-invalid': consumerAriaInvalid,
    ...inputProps
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `dse-text-field-${generatedId}`;
  const messageContent = invalid && errorMessage != null ? errorMessage : supportingText;
  const hasMessage = messageContent != null && messageContent !== false;
  const messageId = hasMessage ? `${inputId}-message` : undefined;
  const describedBy = [consumerDescribedBy, messageId].filter(Boolean).join(' ') || undefined;
  const inputClassName = className
    ? `dse-text-field__input ${className}`
    : 'dse-text-field__input';
  const ariaInvalid = invalid ? true : consumerAriaInvalid;

  return (
    <div className="dse-text-field">
      <label className="dse-text-field__label" htmlFor={inputId}>
        {label}
        {required ? (
          <span className="dse-text-field__required-indicator" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <InputControl size="default">
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          className={inputClassName}
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid}
        />
      </InputControl>

      {hasMessage ? (
        <div
          id={messageId}
          className={
            invalid
              ? 'dse-text-field__message dse-text-field__message--invalid'
              : 'dse-text-field__message'
          }
        >
          {messageContent}
        </div>
      ) : null}
    </div>
  );
});
