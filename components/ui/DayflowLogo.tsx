import React from 'react';

interface DayflowLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showSubtitle?: boolean;
  textColor?: string;
  variant?: 'default' | 'white' | 'monochrome';
}

export const DayflowLogo: React.FC<DayflowLogoProps> = ({
  size = 36,
  className = '',
  showText = false,
  showSubtitle = false,
  textColor,
  variant = 'default',
}) => {
  const isWhite = variant === 'white';
  const primaryDark = isWhite ? '#FFFFFF' : '#26114A';
  const accentViolet = isWhite ? '#D8B4FE' : '#7B2CBF';
  const titleColor = textColor || (isWhite ? 'text-white' : 'text-[#1E1035]');
  const subColor = isWhite ? 'text-purple-200/70' : 'text-[#1E1035]/50';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Vector Emblem matching the Sun & Flow Brand Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="Dayflow Brand Logo"
      >
        {/* Deep Indigo / Dark Violet Sun & Central River Path */}
        <g stroke={primaryDark} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Sun Rays radiating outwards */}
          <line x1="53" y1="21" x2="53" y2="10" />
          <line x1="68" y1="26" x2="76" y2="16" />
          <line x1="38" y1="25" x2="28" y2="16" />
          <line x1="25" y1="36" x2="13" y2="30" />
          <line x1="20" y1="52" x2="8" y2="52" />
          <line x1="24" y1="67" x2="13" y2="74" />

          {/* Sun Body Arc */}
          <path d="M 23 54 A 29 29 0 0 1 73 34" />

          {/* Central S-Curve Flowing Stream */}
          <path d="M 77 19 C 85 30 73 42 61 46 C 47 51 39 59 40 70 C 40 79 28 82 20 74" />
        </g>

        {/* Right Outer Circular Arc (Upper Dark Section) */}
        <path
          d="M 77 19 A 44 44 0 0 1 93 46"
          stroke={primaryDark}
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Vibrant Violet Flow Wave Ribbon (Right & Lower Section) */}
        <g stroke={accentViolet} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 93 46 C 96 66 84 83 67 92 C 55 98 48 95 48 95" />
          <path d="M 68 53 C 60 61 60 70 63 77 C 65 83 60 88 50 94" />
          <path d="M 67 92 C 60 92 56 86 63 77" strokeWidth="4.5" />
        </g>
      </svg>

      {/* Brand Text Presentation */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black tracking-tight text-xl leading-none ${titleColor}`}>
            DAYFLOW
          </span>
          {showSubtitle && (
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${subColor}`}>
              Every workday, perfectly aligned.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
