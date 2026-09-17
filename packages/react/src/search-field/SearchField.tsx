import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
  type ForwardedRef,
  type InputHTMLAttributes,
} from 'react';
import { IconButton } from '../icon-button/IconButton.js';
import { InputControl } from '../internal/input-control/InputControl.js';

export interface SearchFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'children' | 'content' | 'type' | 'aria-invalid'
  > {
  'aria-label': string;
  clearButtonLabel: string;
  onClear?: () => void;
}

const searchIconUrl = new URL('../assets/search.svg', import.meta.url).href;
const clearIconUrl = new URL('../assets/x.svg', import.meta.url).href;

const searchIconStyle = {
  '--dse-search-field-search-image': `url("${searchIconUrl}")`,
} as CSSProperties;

const clearIconStyle = {
  '--dse-search-field-clear-image': `url("${clearIconUrl}")`,
} as CSSProperties;

function queryString(value: InputHTMLAttributes<HTMLInputElement>['value']): string;
function queryString(value: InputHTMLAttributes<HTMLInputElement>['defaultValue']): string;
function queryString(value: unknown): string {
  return value == null ? '' : String(value);
}

function assignForwardedRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  if (ref) ref.current = value;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  props,
  forwardedRef,
) {
  const {
    clearButtonLabel,
    onClear,
    value,
    defaultValue,
    disabled,
    className,
    onChange,
    type: _ignoredType,
    'aria-invalid': _ignoredAriaInvalid,
    ...inputProps
  } = props as SearchFieldProps & {
    type?: InputHTMLAttributes<HTMLInputElement>['type'];
    'aria-invalid'?: InputHTMLAttributes<HTMLInputElement>['aria-invalid'];
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledQuery, setUncontrolledQuery] = useState(() => queryString(defaultValue));
  const controlled = value !== undefined;
  const currentQuery = controlled ? queryString(value) : uncontrolledQuery;
  const hasQuery = currentQuery.length > 0;
  const inputClassName = className
    ? `dse-search-field__input ${className}`
    : 'dse-search-field__input';

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!controlled) setUncontrolledQuery(event.currentTarget.value);
    onChange?.(event);
  };

  const handleClear = () => {
    if (disabled) return;

    if (!controlled) {
      if (inputRef.current) inputRef.current.value = '';
      setUncontrolledQuery('');
    }

    inputRef.current?.focus();
    onClear?.();
  };

  return (
    <div className="dse-search-field">
      <InputControl size="compact">
        <span
          className="dse-search-field__search-icon"
          aria-hidden="true"
          style={searchIconStyle}
        />
        <input
          {...inputProps}
          ref={setInputRef}
          type="search"
          className={inputClassName}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={handleChange}
        />
        {hasQuery ? (
          <span className="dse-search-field__clear-action">
            <IconButton
              icon={
                <span className="dse-search-field__clear-icon" style={clearIconStyle} />
              }
              aria-label={clearButtonLabel}
              disabled={disabled}
              onClick={handleClear}
            />
          </span>
        ) : null}
      </InputControl>
    </div>
  );
});
