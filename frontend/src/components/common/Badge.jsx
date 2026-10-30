import React from 'react';

const STAGE_VARIANTS = {
  APPLIED:
    'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  SCREENING:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  INTERVIEW_SCHEDULED:
    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
  INTERVIEW_COMPLETED:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  OFFERED:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  ACCEPTED:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  ONBOARDING:
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
  HIRED:
    'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700',
  REJECTED:
    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  WITHDRAWN:
    'bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
};

const GENERIC_VARIANTS = {
  neutral:
    'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  primary:
    'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-800',
  success:
    'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/50 dark:text-success-300 dark:border-success-800',
  warning:
    'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/50 dark:text-warning-300 dark:border-warning-800',
  danger:
    'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-950/50 dark:text-danger-300 dark:border-danger-800',
  info:
    'bg-info-50 text-info-700 border-info-200 dark:bg-info-950/50 dark:text-info-300 dark:border-info-800',
};

export const Badge = ({
  children,
  variant,
  stage,
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  let styleClass = GENERIC_VARIANTS.neutral;

  if (stage && STAGE_VARIANTS[stage]) {
    styleClass = STAGE_VARIANTS[stage];
  } else if (variant && GENERIC_VARIANTS[variant]) {
    styleClass = GENERIC_VARIANTS[variant];
  }

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 rounded-sm gap-1',
    md: 'text-xs px-2.5 py-0.5 rounded-sm gap-1.5',
    lg: 'text-sm px-3 py-1 rounded-md gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border leading-none tracking-tight select-none ${styleClass} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-75"
          aria-hidden="true"
        />
      )}
      <span>{children || stage}</span>
    </span>
  );
};

export default Badge;
