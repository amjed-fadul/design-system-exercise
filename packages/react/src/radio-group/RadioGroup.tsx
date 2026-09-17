import { useState, type ReactNode } from 'react';
import { RadioOption } from '../internal/radio-option/RadioOption.js';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: ReactNode;
  name: string;
  options: readonly [RadioGroupOption, RadioGroupOption, ...RadioGroupOption[]];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}

function assertValidOptions(options: readonly RadioGroupOption[]) {
  if (options.length < 2) {
    throw new Error('RadioGroup requires at least two options.');
  }

  const values = new Set<string>();
  for (const option of options) {
    if (typeof option.value !== 'string' || option.value.length === 0) {
      throw new Error('RadioGroup options require a non-empty string value.');
    }
    if (values.has(option.value)) {
      throw new Error(`RadioGroup option values must be unique; duplicate value: ${option.value}`);
    }
    values.add(option.value);
  }
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  required = true,
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);

  assertValidOptions(options);
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error('RadioGroup cannot receive both value and defaultValue; choose controlled or uncontrolled selection.');
  }

  const controlled = value !== undefined;
  const selectedValue = controlled ? value : uncontrolledValue;

  const handleValueChange = (nextValue: string) => {
    if (!controlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <fieldset className="dse-radio-group">
      <legend className="dse-radio-group__legend">
        <span>{label}</span>
        {required ? (
          <span className="dse-radio-group__required-indicator" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>

      <div className="dse-radio-group__options">
        {options.map((option) => (
          <RadioOption
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            checked={selectedValue === option.value}
            disabled={option.disabled}
            required={required}
            onChange={handleValueChange}
          />
        ))}
      </div>
    </fieldset>
  );
}
