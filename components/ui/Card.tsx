import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  className = '',
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={`bg-[#FFFFFF] border border-[#F7F4FA] rounded-2xl shadow-sm transition-all duration-200 ${
        padded ? 'p-6 sm:p-7' : ''
      } ${
        hoverable
          ? 'hover:border-[#7B2CBF]/20 hover:shadow-md'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}> = ({ title, subtitle, action, className = '', icon }) => {
  return (
    <div className={`flex items-center justify-between pb-5 border-b border-[#F7F4FA] mb-6 ${className}`}>
      <div className="flex items-center gap-3.5">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#F7F4FA] border border-[#F7F4FA] flex items-center justify-center text-[#7B2CBF]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1E1035] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#1E1035]/60 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
