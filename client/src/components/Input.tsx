import clsx from 'clsx';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { IconButton } from './IconButton';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  onClear?: () => void;
}

export const Input = forwardRef(function Input(
  props: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    className,
    label,
    error,
    placeholder = 'Input',
    disabled,
    type, // Get the type of the input
    onClear,
    ...otherProps
  } = props;

  return (
    <label className={clsx('flex flex-col gap-2 text-black', className)}>
      <span
        className={clsx(
          'leading-none transition-colors text-black',
          disabled ? 'text-disabled' : 'text-accent',
        )}
      >
        {label}
      </span>
      <span className="relative">
        <input
          type={type} // Set the type for the input
          className={clsx(
            'peer w-full rounded-md border bg-transparent px-3 py-4 outline-none transition-colors placeholder:text-current disabled:placeholder:text-disabled text-black',
            error ? 'border-error' : 'border-divider focus:border-accent ',
          )}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          {...otherProps}
        />
        {/* Only show the clear button if the type is not 'date' */}
        {type !== 'date' && type !== 'time' && (
          <IconButton
            className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2 text-black',
              error ? 'text-error' : 'text-accent',
            )}
            icon="cross"
            disabled={disabled}
            onClick={onClear}
          />
        )}
        {error && (
          <span className="absolute -bottom-1 right-0 translate-y-full text-xs text-error">
            {error}
          </span>
        )}
      </span>
    </label>
  );
});
