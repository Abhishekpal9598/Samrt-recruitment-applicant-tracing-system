import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PageContainer = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
  maxWidth = 'max-w-7xl',
  className = '',
}) => {
  return (
    <div className={`mx-auto w-full ${maxWidth} px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
      {/* Breadcrumb Trail */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />}
                {isLast || !crumb.href ? (
                  <span className={isLast ? 'font-medium text-neutral-900 dark:text-neutral-200' : ''}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Page Header */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
        </div>
      )}

      {/* Page Main Content */}
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
