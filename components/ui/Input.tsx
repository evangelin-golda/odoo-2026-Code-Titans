import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  isPassword = false,
  className = '',
  id,
  type = 'text',
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;

  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#1E1035] tracking-wide flex items-center justify-between"
        >
          <span>{label}</span>
          {props.required && <span className="text-rose-500 font-normal">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#1E1035]/40 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          className={`w-full text-sm text-[#1E1035] placeholder:text-[#1E1035]/35 bg-[#FFFFFF] border rounded-lg py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#7B2CBF]/20 focus:border-[#7B2CBF] disabled:bg-[#F7F4FA] disabled:text-[#1E1035]/50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-[#E8E2F0]'
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#1E1035]/40 hover:text-[#7B2CBF] focus:outline-none cursor-pointer p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[#1E1035]/60">{helperText}</p>
      )}
    </div>
  );
};
