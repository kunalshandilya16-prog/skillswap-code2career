import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // e.g. 4.8
  maxStars?: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  reviewCount,
  showCount = true,
  size = 'sm',
  interactive = false,
  onChange,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const effectiveRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = effectiveRating >= starValue;
          const isPartial = !isFilled && effectiveRating > index && effectiveRating < starValue;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${
                interactive ? 'cursor-pointer p-0.5 hover:scale-110 transition-transform' : 'cursor-default'
              } focus:outline-hidden`}
              aria-label={`${starValue} Stars`}
            >
              <div className="relative">
                {/* Background empty star */}
                <Star
                  className={`${starSizes[size]} ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : isPartial
                      ? 'text-amber-400'
                      : 'text-slate-300 fill-slate-100'
                  } transition-colors`}
                />

                {/* Partial fill overlay */}
                {isPartial && (
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${(effectiveRating - index) * 100}%` }}
                  >
                    <Star className={`${starSizes[size]} fill-amber-400 text-amber-400`} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Numerical score & review count */}
      {!interactive && (
        <span className={`font-bold text-slate-800 ${textSizes[size]}`}>
          {rating.toFixed(1)}
          {showCount && reviewCount !== undefined && (
            <span className="text-slate-400 font-normal ml-1">
              ({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
