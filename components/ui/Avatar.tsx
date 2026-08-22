import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  statusIndicator?: 'online' | 'offline' | 'busy' | 'none';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  statusIndicator = 'none',
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  return (
    <div className="relative inline-block select-none shrink-0">
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center bg-[#F7F4FA] border border-[#E8E2F0] text-[#7B2CBF] font-medium transition-all ${sizeClasses[size]} ${className}`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {statusIndicator !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white ${statusSizeClasses[size]} ${
            statusIndicator === 'online'
              ? 'bg-emerald-500'
              : statusIndicator === 'busy'
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
