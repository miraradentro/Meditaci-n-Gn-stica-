import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EFE6] via-[#EBE5D8] to-[#D6CEBE] p-6 text-center text-[#78350F] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-8 h-8 mb-2 opacity-75" />
        {fallbackTitle && (
          <span className="font-serif text-lg font-semibold text-[#1C1917]">
            {fallbackTitle}
          </span>
        )}
        {fallbackSubtitle && (
          <span className="text-xs text-[#57534E] mt-1">{fallbackSubtitle}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
