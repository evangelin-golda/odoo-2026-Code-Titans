import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number; disabled?: boolean }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-[#1E1035] tracking-wide flex items-center justify-between"
        >
          <span>{label}</span>
          {props.required && <span className="text-rose-500 font-normal">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          className={`w-full text-sm text-[#1E1035] bg-[#FFFFFF] border rounded-lg py-2.5 px-3.5 pr-9 appearance-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#7B2CBF]/20 focus:border-[#7B2CBF] disabled:bg-[#F7F4FA] disabled:cursor-not-allowed ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-[#E8E2F0]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1E1035]/50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[#1E1035]/60">{helperText}</p>
      )}
    </div>
  );
};
