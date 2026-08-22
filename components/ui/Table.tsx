import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-[#F7F4FA] bg-[#FFFFFF] shadow-xs ${wrapperClassName}`}>
      <table className={`w-full text-left text-sm text-[#1E1035] ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <thead className={`bg-[#F7F4FA]/50 border-b border-[#F7F4FA] text-[11px] font-bold uppercase tracking-wider text-[#1E1035]/50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return <tbody className={`divide-y divide-[#F7F4FA] ${className}`} {...props}>{children}</tbody>;
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement> & { hoverable?: boolean }> = ({
  children,
  className = '',
  hoverable = true,
  ...props
}) => {
  return (
    <tr
      className={`transition-colors duration-150 ${
        hoverable ? 'hover:bg-[#F7F4FA]/50' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <th className={`py-4 px-6 font-bold text-[#1E1035]/60 text-xs whitespace-nowrap ${className}`} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <td className={`py-4 px-6 align-middle text-sm text-[#1E1035] ${className}`} {...props}>
      {children}
    </td>
  );
};
