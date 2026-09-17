import { useId, type ReactNode } from 'react';

interface RadioOptionProps {
  label: ReactNode;
  description?: ReactNode;
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  required: boolean;
  onChange: (value: string) => void;
}

export function RadioOption({
  label,
  description,
  name,
  value,
  checked,
  disabled = false,
  required,
  onChange,
}: RadioOptionProps) {
  const generatedId = useId();
  const inputId = `dse-radio-option-${generatedId}`;
  const labelId = `${inputId}-label`;
  const hasDescription = description != null && description !== false;
  const descriptionId = hasDescription ? `${inputId}-description` : undefined;

  return (
    <label className="dse-radio-option" htmlFor={inputId}>
      <input
        id={inputId}
        className="dse-radio-option__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        required={required}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        onChange={(event) => {
          if (event.currentTarget.checked) onChange(value);
        }}
      />

      <span className="dse-radio-option__control" aria-hidden="true">
        <span className="dse-radio-option__indicator" />
      </span>

      <span className="dse-radio-option__text">
        <span id={labelId} className="dse-radio-option__label">
          {label}
        </span>
        {hasDescription ? (
          <span id={descriptionId} className="dse-radio-option__description">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
