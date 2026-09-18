import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatting';
import { BookingModal } from '../components/bookings/BookingModal';
import { StarRating } from '../components/common/StarRating';
import { ReviewsList } from '../components/common/ReviewsList';
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  Sparkles,
  AlertCircle,
  Share2,
  ThumbsUp,
  Briefcase,
  ExternalLink,
  Award,
  Users,
  Ban,
  ArrowRight,
} from 'lucide-react';

export const GigDetails: React.FC = () => {
  const {
    gigs,
    selectedGigId,
    navigateTo,
    getGigStatus,
    getCreatorForGig,
    getCreatorStats,
    reviews,
    addToast,
    currentRole,
    activeCreatorId,
    withdrawGig,
  } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmWithdrawOpen, setConfirmWithdrawOpen] = useState(false);

  const gig = gigs.find((g) => g.id === selectedGigId);

  if (!gig) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Gig Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          The requested service could not be found or has been removed from the directory.
        </p>
        <button
          onClick={() => navigateTo('marketplace')}
          className="mt-6 px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>
      </div>
    );
  }

  const bookingStatus = getGigStatus(gig.id);
  const isPending = bookingStatus.state === 'pending';
  const isAccepted = bookingStatus.state === 'accepted';
  const isAvailable = bookingStatus.isAvailable;

  const creator = getCreatorForGig(gig);
  const creatorStats = getCreatorStats(creator.id);
  const creatorReviews = reviews.filter((r) => r.creatorId === creator.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Direct link to this gig copied to clipboard.',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation & Actions Top Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-marketplace"
          onClick={() => navigateTo('marketplace')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          title="Share this gig"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-indigo-50/40">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100/70 px-3 py-1 rounded-md border border-indigo-200">
              {gig.category}
            </span>

            {/* Decision Point 2 Availability Indicator */}
            {gig.isWithdrawn || bookingStatus.state === 'withdrawn' ? (
              <span
                id="gig-detail-status-withdrawn"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                Service Withdrawn
              </span>
            ) : isAccepted ? (
              <span
                id="gig-detail-status-accepted"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Currently booked
              </span>
            ) : isPending ? (
              <span
                id="gig-detail-status-pending"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200"
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Open for Requests ({bookingStatus.pendingCount} pending)
              </span>
            ) : (
              <span
                id="gig-detail-status-available"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Available to book
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {gig.title}
          </h1>

          {/* Detailed Creator Information Row */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {/* Creator Identity */}
            <div className="flex items-center gap-2.5">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-10 h-10 rounded-full object-cover border border-indigo-200 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Creator</span>
                <button
                  type="button"
                  onClick={() => navigateTo('creator-profile', creator.id)}
                  className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  {creator.name}
                </button>
              </div>
            </div>

            {/* Star Rating & Review Count */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating & Feedback</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StarRating rating={creatorStats.averageRating} size="xs" showCount={false} />
                <span className="font-bold text-slate-800">{creatorStats.averageRating.toFixed(1)}</span>
                <span className="text-slate-400">({creatorStats.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Total Gigs Posted */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Services Offered</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-slate-900">{creatorStats.totalGigsPosted} gigs posted</span>
              </div>
            </div>

            {/* Total Gigs Completed */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Track Record</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-slate-900">{creatorStats.totalGigsCompleted} completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body: About & Concurrency Notice */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Service Description & Scope
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              {gig.description}
            </div>
          </div>

          {/* Decision Point 2 Concurrency Protection Card */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-indigo-900">
                Decision Point 2 (Concurrency Protection):
              </span>
              <p className="text-slate-600 leading-relaxed">
                SkillSwap enforces that only one active booking request can exist per gig at a time.
                Once a client submits a booking request, this gig enters "Booking in progress" status,
                preventing duplicate bookings until the creator accepts or declines.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOOKING AREA: TWO-COLUMN DESKTOP LAYOUT (Booking Form Left + Creator Side Panel Right) */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-200">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Reserve & Book Service
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review rate details, inspect creator qualifications, and submit your request.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT COLUMN: Booking Action Card (7 cols on desktop) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs space-y-5">
              <div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Fixed Service Rate
                    </span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {formatCurrency(gig.rate)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Direct payment between client and creator
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    {gig.category}
                  </span>
                </div>

                <div className="pt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct messaging and brief requirements included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Eligible to leave a verified rating and review upon completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full project transparency and timeline tracking in My Bookings</span>
                  </div>
                </div>

                {/* Applied Requests Insight Banner (Requirement 2) */}
                <div
                  id="gig-applied-requests-insight"
                  className="mt-4 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {bookingStatus.totalApplied} {bookingStatus.totalApplied === 1 ? 'Request' : 'Requests'} Applied
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {bookingStatus.pendingCount} currently pending creator review
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shadow-2xs">
                    {gig.isWithdrawn
                      ? 'Withdrawn'
                      : isAccepted
                      ? 'Service Booked'
                      : 'Multiple Applicants Allowed'}
                  </span>
                </div>
              </div>

              {/* Action Button state machine */}
              <div className="pt-3 border-t border-slate-100">
                {/* 1. CREATOR VIEWING OWN GIG: Withdraw Gig Action (Requirement 4) */}
                {currentRole === 'creator' && activeCreatorId === gig.creatorId ? (
                  gig.isWithdrawn ? (
                    <div id="gig-withdrawn-creator-notice" className="space-y-2.5">
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-rose-900">
                          <Ban className="w-4 h-4 text-rose-600" />
                          <span>This Gig Has Been Withdrawn</span>
                        </div>
                        <p className="text-[11px] text-rose-800 leading-relaxed">
                          You withdrew this gig from the marketplace. Any pending requests were rejected with "service not available".
                        </p>
                      </div>
                      <button
                        id="btn-creator-manage-other-gigs"
                        type="button"
                        onClick={() => navigateTo('creator-gigs')}
                        className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Manage My Other Gigs</span>
                      </button>
                    </div>
                  ) : (
                    <div id="creator-withdraw-action-container" className="space-y-2.5">
                      <button
                        id="btn-withdraw-gig"
                        type="button"
                        onClick={() => setConfirmWithdrawOpen(true)}
                        className="w-full py-3.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-99"
                      >
                        <Ban className="w-4 h-4" />
                        <span>Withdraw Gig</span>
                      </button>
                      <p id="msg-withdraw-hint" className="text-[11px] text-slate-500 text-center leading-tight">
                        Withdrawing this listing will remove it from marketplace bookings and reject any pending client requests with <strong className="text-slate-700 font-semibold">"service not available"</strong>.
                      </p>
                    </div>
                  )
                ) : gig.isWithdrawn || bookingStatus.state === 'withdrawn' ? (
                  /* 2. WITHDRAWN GIG VIEWED BY CLIENTS (Requirement 4) */
                  <div id="gig-withdrawn-client-container" className="space-y-3">
                    <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-900">
                        <Ban className="w-4 h-4 text-rose-600" />
                        <span>Service Not Available</span>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        The creator has withdrawn this gig from the marketplace.
                      </p>
                    </div>

                    <button
                      id="btn-explore-similar-gigs-withdrawn"
                      type="button"
                      onClick={() => navigateTo('marketplace', undefined, gig.category)}
                      className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Explore More Similar Gigs</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : isAccepted ? (
                  /* 3. ACCEPTED / BOOKED GIG */
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>Currently Booked & Unavailable</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        The creator has accepted a booking for this service. Check back later or explore alternative creators.
                      </p>
                    </div>

                    <button
                      id="btn-explore-similar-gigs-accepted"
                      type="button"
                      onClick={() => navigateTo('marketplace', undefined, gig.category)}
                      className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explore Similar Gigs in {gig.category}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* 4. AVAILABLE TO BOOK (Requirement 3: Multiple clients can request) */
                  <div className="space-y-2.5">
                    <button
                      id="btn-book-this-gig"
                      type="button"
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-99"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>
                        {bookingStatus.pendingCount > 0
                          ? `Request to Book (${bookingStatus.pendingCount} already pending)`
                          : 'Book This Gig'}
                      </span>
                    </button>
                    {bookingStatus.pendingCount > 0 && (
                      <p className="text-[11px] text-indigo-800 text-center bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                        💡 Multiple clients can request this gig. {creator.name} will accept the best fit; other requests will receive "Unfortunately, not available".
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Creator Profile Side Panel (5 cols on desktop) */}
            <div
              id="creator-profile-side-panel"
              className="lg:col-span-5 bg-white rounded-2xl border border-indigo-100 p-6 flex flex-col justify-between shadow-2xs space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      {creator.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mt-1 inline-block">
                      {creator.specialization}
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 italic">
                  "{creator.bio}"
                </p>

                {/* Creator stats pill summary */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={creatorStats.averageRating} size="xs" showCount={false} />
                      <span className="font-extrabold text-slate-900">{creatorStats.averageRating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Satisfaction</span>
                    <span className="font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {creatorStats.positivePercentage}% positive
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Gigs Posted</span>
                    <span className="font-bold text-slate-800">{creatorStats.totalGigsPosted} listed</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
                    <span className="font-bold text-slate-800">{creatorStats.totalGigsCompleted} fulfilled</span>
                  </div>
                </div>
              </div>

              {/* View Creator Profile Action */}
              <div className="pt-2">
                <button
                  id="btn-view-creator-profile"
                  type="button"
                  onClick={() => navigateTo('creator-profile', creator.id)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-300" />
                  <span>View Creator Profile & Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RATINGS & REVIEWS SECTION */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <ReviewsList
          reviews={creatorReviews}
          stats={creatorStats}
          title={`Ratings & Reviews for ${creator.name}`}
        />
      </div>

      {/* Booking Form Dialog */}
      <BookingModal
        gig={gig}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Withdraw Gig Confirmation Dialog (Requirement 4) */}
      {confirmWithdrawOpen && (
        <div
          id="withdraw-gig-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div
            id="withdraw-gig-modal-content"
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Ban className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Withdraw this gig?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to withdraw <strong className="text-slate-900">"{gig.title}"</strong> from the marketplace?
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1.5">
              <p className="font-bold text-rose-900">Automatic withdrawal actions:</p>
              <ul className="list-disc list-inside text-[11px] text-rose-800 space-y-1">
                <li>The gig is immediately marked as withdrawn and removed from available listings.</li>
                <li>
                  All <strong>{bookingStatus.pendingCount} pending requests</strong> will be automatically rejected with the reason <strong className="text-rose-950">"service not available"</strong>.
                </li>
                <li>Affected clients will see an option to explore similar gigs.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-cancel-withdraw"
                type="button"
                onClick={() => setConfirmWithdrawOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-withdraw-action"
                type="button"
                onClick={() => {
                  withdrawGig(gig.id);
                  setConfirmWithdrawOpen(false);
                }}
                className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                <span>Yes, Withdraw Gig</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
