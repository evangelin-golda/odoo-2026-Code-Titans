import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 text-center flex flex-col items-center justify-center rounded-2xl bg-[#F7F4FA]/50 border border-dashed border-[#E8E2F0] ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] mb-4 shadow-xs">
          {icon}
        </div>
      )}
      <h4 className="text-base font-bold text-[#1E1035]">{title}</h4>
      <p className="text-xs text-[#1E1035]/60 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
