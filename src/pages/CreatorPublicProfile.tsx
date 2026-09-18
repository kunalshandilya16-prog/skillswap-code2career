import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatCurrency, formatRelativeTime } from '../utils/formatting';
import { StarRating } from '../components/common/StarRating';
import { ReviewsList } from '../components/common/ReviewsList';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Briefcase,
  Award,
  ThumbsUp,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';

export const CreatorPublicProfile: React.FC = () => {
  const {
    selectedCreatorId,
    creators,
    gigs,
    reviews,
    navigateTo,
    getCreatorStats,
    getGigStatus,
    currentRole,
    activeCreatorId,
  } = useApp();

  // Find targeted creator or default to first creator
  const creator =
    creators.find((c) => c.id === selectedCreatorId) || creators[0];

  if (!creator) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-900">Creator Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested creator profile could not be loaded.
        </p>
        <button
          onClick={() => navigateTo('marketplace')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const creatorStats = getCreatorStats(creator.id);
  const creatorReviews = reviews.filter((r) => r.creatorId === creator.id);
  const creatorGigs = gigs.filter(
    (g) => g.creatorId === creator.id || g.creatorName === creator.name
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="btn-profile-back-marketplace"
          onClick={() => navigateTo('marketplace')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <span className="text-xs text-slate-400">
          Public Creator Profile • Verified Talent
        </span>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover gradient */}
        <div className="h-36 sm:h-44 bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 relative">
          <div className="absolute inset-0 bg-radial from-indigo-500/10 to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2 pt-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1
                    id="creator-profile-name"
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
                  >
                    {creator.name}
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                      {creator.specialization}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Creator
                    </span>
                  </div>
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-600 max-w-2xl">
                  {creator.headline}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <StarRating rating={creatorStats.averageRating} size="sm" showCount={false} />
                  <span className="text-sm font-extrabold text-slate-900">
                    {creatorStats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    ({creatorStats.reviewCount} client reviews)
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {creatorStats.positivePercentage}% positive
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{creator.email}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Member since {formatDate(creator.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Bio & Track Record Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="lg:col-span-2 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                About the Creator
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {creator.bio}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Services Listed</span>
                <span className="text-lg font-black text-slate-900">{creatorStats.totalGigsPosted}</span>
                <span className="text-[11px] text-slate-500 block">Active marketplace gigs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed Work</span>
                <span className="text-lg font-black text-emerald-700">{creatorStats.totalGigsCompleted}</span>
                <span className="text-[11px] text-slate-500 block">Fulfilled orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Featured Portfolio & Samples</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {creator.portfolio?.length || 0} showcase projects
          </span>
        </div>

        {creator.portfolio && creator.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creator.portfolio.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {item.category && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-indigo-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400">
                  Added {formatRelativeTime(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
            No portfolio projects added yet.
          </div>
        )}
      </div>

      {/* Services Offered By This Creator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Services Offered by {creator.name}</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {creatorGigs.length} {creatorGigs.length === 1 ? 'service available' : 'services available'}
          </span>
        </div>

        {creatorGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {creatorGigs.map((gig) => {
              const bookingStatus = getGigStatus(gig.id);
              const isPending = bookingStatus.state === 'pending';
              const isAccepted = bookingStatus.state === 'accepted';

              return (
                <div
                  key={gig.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase">
                        {gig.category}
                      </span>
                      {gig.isWithdrawn || bookingStatus.state === 'withdrawn' ? (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-rose-600" />
                          Withdrawn
                        </span>
                      ) : isAccepted ? (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" />
                          Currently booked
                        </span>
                      ) : isPending ? (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                          {bookingStatus.pendingCount} {bookingStatus.pendingCount === 1 ? 'request' : 'requests'} pending
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Available
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {gig.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {gig.description}
                    </p>
                    <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-indigo-600">{bookingStatus.totalApplied} applied</span>
                      <span>•</span>
                      <span>{bookingStatus.pendingCount} pending review</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Rate</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(gig.rate)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('gig-details', gig.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        currentRole === 'creator' && activeCreatorId === gig.creatorId
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <span>
                        {currentRole === 'creator' && activeCreatorId === gig.creatorId
                          ? 'View Your Gig'
                          : 'View Service & Book'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            This creator does not have active gig listings right now.
          </div>
        )}
      </div>

      {/* Ratings & Reviews Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <ReviewsList
          reviews={creatorReviews}
          stats={creatorStats}
          title={`Verified Client Reviews (${creatorStats.reviewCount})`}
        />
      </div>
    </div>
  );
};
