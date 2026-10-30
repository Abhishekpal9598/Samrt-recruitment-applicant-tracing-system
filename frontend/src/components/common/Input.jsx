import React from 'react';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      id,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-md shadow-subtle">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <LeftIcon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`block w-full text-sm rounded-md transition-colors duration-150 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 border ${
              error
                ? 'border-danger-500 focus:border-danger-500 focus:ring-1 focus:ring-danger-500'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
            } ${LeftIcon ? 'pl-9' : 'pl-3.5'} ${RightIcon ? 'pr-9' : 'pr-3.5'} py-2 disabled:bg-neutral-100 dark:disabled:bg-neutral-850 disabled:text-neutral-400 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <RightIcon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="mt-1.5 text-xs text-danger-600 dark:text-danger-400" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
