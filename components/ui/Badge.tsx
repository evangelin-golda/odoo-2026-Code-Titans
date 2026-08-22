import React from 'react';

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveType = 'paid' | 'sick' | 'unpaid' | 'casual';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'present'
    | 'absent'
    | 'half-day'
    | 'leave'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'paid'
    | 'sick'
    | 'unpaid'
    | 'active'
    | 'inactive';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    default: 'bg-[#F7F4FA] text-[#1E1035] border border-[#F7F4FA]',
    primary: 'bg-purple-50 text-[#7B2CBF] border border-purple-100',
    present: 'bg-green-50 text-green-700 border border-green-100',
    absent: 'bg-rose-50 text-rose-700 border border-rose-100',
    'half-day': 'bg-amber-50 text-amber-700 border border-amber-100',
    leave: 'bg-purple-50 text-purple-700 border border-purple-100',
    pending: 'bg-amber-50 text-amber-700 border border-amber-100',
    approved: 'bg-green-50 text-green-700 border border-green-100',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-100',
    paid: 'bg-blue-50 text-blue-700 border border-blue-100',
    sick: 'bg-purple-50 text-purple-700 border border-purple-100',
    unpaid: 'bg-gray-50 text-gray-700 border border-gray-100',
    active: 'bg-green-50 text-green-700 border border-green-100',
    inactive: 'bg-gray-50 text-gray-600 border border-gray-100',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md whitespace-nowrap select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === 'present' || variant === 'approved' || variant === 'active'
            ? 'bg-green-500'
            : variant === 'absent' || variant === 'rejected'
            ? 'bg-rose-500'
            : variant === 'half-day' || variant === 'pending'
            ? 'bg-amber-500'
            : variant === 'leave' || variant === 'primary' || variant === 'sick'
            ? 'bg-[#7B2CBF]'
            : variant === 'paid'
            ? 'bg-blue-500'
            : 'bg-gray-400'
        }`}
      />
      {children}
    </span>
  );
};

export const AttendanceBadge: React.FC<{ status: AttendanceStatus | string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    present: { label: 'Present', variant: 'present' },
    absent: { label: 'Absent', variant: 'absent' },
    'half-day': { label: 'Half-Day', variant: 'half-day' },
    'half_day': { label: 'Half-Day', variant: 'half-day' },
    leave: { label: 'On Leave', variant: 'leave' },
    holiday: { label: 'Holiday', variant: 'default' },
  };

  const item = map[status.toLowerCase()] || { label: status, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const LeaveStatusBadge: React.FC<{ status: LeaveStatus | string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Pending Approval', variant: 'pending' },
    approved: { label: 'Approved', variant: 'approved' },
    rejected: { label: 'Rejected', variant: 'rejected' },
    cancelled: { label: 'Cancelled', variant: 'default' },
  };

  const item = map[status.toLowerCase()] || { label: status, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const LeaveTypeBadge: React.FC<{ type: LeaveType | string }> = ({ type }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    paid: { label: 'Paid Vacation', variant: 'paid' },
    sick: { label: 'Sick Leave', variant: 'sick' },
    unpaid: { label: 'Unpaid Leave', variant: 'unpaid' },
    casual: { label: 'Casual Leave', variant: 'primary' },
  };

  const item = map[type.toLowerCase()] || { label: type, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};
