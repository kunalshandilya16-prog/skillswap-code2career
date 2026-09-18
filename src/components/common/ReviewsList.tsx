import React, { useState } from 'react';
import { Review } from '../../types';
import { CreatorStats } from '../../utils/ratingStats';
import { StarRating } from './StarRating';
import { formatRelativeTime } from '../../utils/formatting';
import { Star, ThumbsUp, MessageSquare, ChevronDown } from 'lucide-react';

interface ReviewsListProps {
  reviews: Review[];
  stats: CreatorStats;
  title?: string;
  className?: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  stats,
  title = 'Ratings & Reviews',
  className = '',
}) => {
  const [displayCount, setDisplayCount] = useState<number>(4);

  const visibleReviews = reviews.slice(0, displayCount);
  const hasMore = reviews.length > displayCount;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {stats.reviewCount} {stats.reviewCount === 1 ? 'verified review' : 'verified reviews'}
        </span>
      </div>

      {/* Summary Card with Rating & Distribution */}
      <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Average & Stars */}
        <div className="md:col-span-4 text-center md:text-left md:border-r md:border-slate-200 md:pr-6 space-y-2">
          <div className="text-5xl font-black text-slate-900 tracking-tight">
            {stats.averageRating.toFixed(1)}
          </div>

          <div className="flex justify-center md:justify-start">
            <StarRating rating={stats.averageRating} size="md" showCount={false} />
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Based on {stats.reviewCount} client experiences
          </p>

          {/* Positive Review Highlight */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              <ThumbsUp className="w-3 h-3 text-emerald-600" />
              <span>{stats.positivePercentage}% Positive</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.positiveCount} of {stats.reviewCount} clients rated 4★ or 5★
            </p>
          </div>
        </div>

        {/* Right Column: Rating Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {stats.distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2.5 text-xs text-slate-600">
              <span className="w-6 font-bold text-right flex items-center justify-end gap-1">
                {item.stars}
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>

              {/* Bar track */}
              <div className="flex-1 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="w-9 text-right font-medium text-slate-500 text-[11px]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Positive Review Callout Banner */}
      <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-3 text-xs text-indigo-900">
        <ThumbsUp className="w-4 h-4 text-indigo-600 shrink-0" />
        <span className="font-medium">
          <strong>{stats.positivePercentage}% of reviewers</strong> rated this creator 4 stars or higher.
          Clients consistently highlight fast communication, clean deliverables, and proactive revisions.
        </span>
      </div>

      {/* Individual Review Comments */}
      {visibleReviews.length > 0 ? (
        <div className="space-y-3.5">
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {rev.clientName ? rev.clientName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.clientName}</h4>
                    <span className="text-[11px] text-slate-400 block">
                      {formatRelativeTime(rev.createdAt)}
                    </span>
                  </div>
                </div>

                <StarRating rating={rev.rating} size="xs" showCount={false} />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}

          {/* Load More Reviews Button */}
          {hasMore && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 4)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-1.5"
              >
                <span>Load More Reviews ({reviews.length - displayCount} remaining)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
          No reviews have been submitted for this creator yet. Completed bookings can be reviewed by clients.
        </div>
      )}
    </div>
  );
};
