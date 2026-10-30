import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-subtle focus:ring-primary-500 dark:focus:ring-offset-neutral-950',
      secondary:
        'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 shadow-subtle focus:ring-primary-500 dark:focus:ring-offset-neutral-950',
      destructive:
        'bg-danger-600 hover:bg-danger-700 active:bg-danger-800 text-white shadow-subtle focus:ring-danger-500 dark:focus:ring-offset-neutral-950',
      outline:
        'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-200 focus:ring-primary-500 dark:focus:ring-offset-neutral-950',
      ghost:
        'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-primary-500 dark:focus:ring-offset-neutral-950',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-3.5 py-2 rounded-md gap-2',
      lg: 'text-base px-5 py-2.5 rounded-md gap-2.5',
    };

    const renderIcon = (iconItem) => {
      if (!iconItem) return null;
      if (React.isValidElement(iconItem)) return iconItem;
      const IconComponent = iconItem;
      return <IconComponent className="w-4 h-4 shrink-0" aria-hidden="true" />;
    };

    const resolvedLeftIcon = leftIcon || (iconPosition === 'left' ? icon : null);
    const resolvedRightIcon = rightIcon || (iconPosition === 'right' ? icon : null);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          renderIcon(resolvedLeftIcon)
        )}
        {children && <span>{children}</span>}
        {!isLoading && renderIcon(resolvedRightIcon)}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'destructive', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  leftIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  rightIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
