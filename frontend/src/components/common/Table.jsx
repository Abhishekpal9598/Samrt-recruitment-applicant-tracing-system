import React from 'react';

export const Table = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-subtle">
    <table className={`w-full text-left text-sm border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead
    className={`bg-neutral-50 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </thead>
);

export const TableHead = ({ children, className = '', ...props }) => (
  <th scope="col" className={`py-3 px-4 text-xs font-semibold select-none ${className}`} {...props}>
    {children}
  </th>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-neutral-100 dark:divide-neutral-800/60 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, isSelected = false, className = '', ...props }) => (
  <tr
    className={`transition-colors duration-100 h-12 ${
      isSelected
        ? 'bg-primary-50/70 dark:bg-primary-950/30'
        : 'hover:bg-neutral-50/80 dark:hover:bg-neutral-850/50'
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', ...props }) => (
  <td className={`py-3 px-4 text-neutral-800 dark:text-neutral-200 align-middle ${className}`} {...props}>
    {children}
  </td>
);

export const TableEmptyState = ({
  title = 'No records found',
  description = 'There are no items to display in this table.',
  colSpan = 5,
  icon: Icon,
}) => (
  <tr>
    <td colSpan={colSpan} className="py-12 px-4 text-center">
      <div className="max-w-xs mx-auto flex flex-col items-center">
        {Icon && <Icon className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mb-2" />}
        <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{title}</h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
      </div>
    </td>
  </tr>
);

export default Table;
