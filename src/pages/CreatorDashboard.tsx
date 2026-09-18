import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus } from '../types';
import { formatDate, formatCurrency } from '../utils/formatting';
import { DeclineModal } from '../components/bookings/DeclineModal';
import { StarRating } from '../components/common/StarRating';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Inbox,
  Check,
  X,
  Mail,
  User,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  PlusCircle,
  Award,
  ThumbsUp,
  ExternalLink,
  ChevronRight,
  PartyPopper,
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const {
    bookings,
    acceptBooking,
    declineBooking,
    completeBooking,
    currentRole,
    setRole,
    navigateTo,
    activeCreatorId,
    creators,
    getCreatorStats,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [selectedDeclineBooking, setSelectedDeclineBooking] = useState<Booking | null>(null);

  // Active creator details & statistics
  const currentCreator = creators.find((c) => c.id === activeCreatorId) || creators[0];
  const creatorStats = getCreatorStats(currentCreator.id);

  // Filter requests specifically for this creator (or fallback if matched by name)
  const creatorBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.creatorId === currentCreator.id ||
        b.creatorName.toLowerCase().trim() === currentCreator.name.toLowerCase().trim()
    );
  }, [bookings, currentCreator]);

  // Statistics
  const pendingCount = creatorBookings.filter((b) => b.status === 'Pending').length;
  const acceptedCount = creatorBookings.filter((b) => b.status === 'Accepted').length;
  const completedCount = creatorBookings.filter((b) => b.status === 'Completed').length;
  const declinedCount = creatorBookings.filter((b) => b.status === 'Declined').length;

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'All') return creatorBookings;
    return creatorBookings.filter((b) => b.status === statusFilter);
  }, [creatorBookings, statusFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Creator Hub
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              Managing as: <strong className="text-slate-800">{currentCreator.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Creator Dashboard & Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review client project proposals, accept commitments, mark fulfilled orders as completed, and track ratings.
          </p>
        </div>

        {/* Quick Creator Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigateTo('post')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Gig</span>
          </button>

          <button
            onClick={() => navigateTo('creator-profile', currentCreator.id)}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Public Profile</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Card */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires your review</p>
        </button>

        {/* Accepted Card */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Accepted' ? 'All' : 'Accepted')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Accepted'
              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accepted
            </span>
            <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {acceptedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">In-progress orders</p>
        </button>

        {/* Completed Card */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Completed' ? 'All' : 'Completed')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Completed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {completedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Fulfilled deliverables</p>
        </button>

        {/* Ratings Card */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Rating
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-1.5">
            <span>{creatorStats.averageRating.toFixed(1)}</span>
            <span className="text-xs font-semibold text-slate-400">★</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {creatorStats.positivePercentage}% positive ({creatorStats.reviewCount} reviews)
          </p>
        </div>
      </div>

      {/* Bookings Section Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Booking Requests ({filteredBookings.length})
          </h2>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['All', 'Pending', 'Accepted', 'Completed', 'Declined'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isPending = b.status === 'Pending';
            const isAccepted = b.status === 'Accepted';
            const isCompleted = b.status === 'Completed';
            const isDeclined = b.status === 'Declined';

            return (
              <div
                key={b.id}
                id={`creator-booking-${b.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header row: Gig title, Category, Rate & Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {b.gigCategory || 'Service'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Received {formatDate(b.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {b.gigTitle}
                    </h3>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                      <span>Client: <strong className="text-slate-800">{b.clientName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {b.clientEmail}
                      </span>
                      {b.gigRate && (
                        <>
                          <span>•</span>
                          <span>Total: <strong className="text-slate-900 font-bold">{formatCurrency(b.gigRate)}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        Pending Review
                      </span>
                    )}
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        Accepted (In Progress)
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completed & Delivered
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Client Message */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    Client Project Brief
                  </div>
                  <p className="italic">"{b.message}"</p>
                </div>

                {/* Declined Reason Display if declined */}
                {isDeclined && b.declineReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                    <strong>Decline Reason Provided:</strong> "{b.declineReason}"
                  </div>
                )}

                {/* Creator Actions Area */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {isPending && 'Please review the client brief and respond.'}
                    {isAccepted && 'Gig deliverables are active. Mark as Completed when finished.'}
                    {isCompleted && (b.reviewed ? 'Client has submitted a review.' : 'Awaiting client review.')}
                    {isDeclined && 'This request was declined. The gig is open for new bookings.'}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Pending Actions */}
                    {isPending && (
                      <>
                        <button
                          id={`btn-decline-booking-${b.id}`}
                          type="button"
                          onClick={() => setSelectedDeclineBooking(b)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline Request
                        </button>

                        <button
                          id={`btn-accept-booking-${b.id}`}
                          type="button"
                          onClick={() => acceptBooking(b.id)}
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept Booking
                        </button>
                      </>
                    )}

                    {/* Accepted Actions: MARK AS COMPLETED */}
                    {isAccepted && (
                      <button
                        id={`btn-complete-booking-${b.id}`}
                        type="button"
                        onClick={() => completeBooking(b.id)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark as Completed</span>
                      </button>
                    )}

                    {/* Completed indicator */}
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Fulfilled</span>
                        {b.reviewed && (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                            Reviewed ★
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 max-w-md mx-auto">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No booking requests found</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {statusFilter !== 'All'
              ? `No requests with status "${statusFilter}". Try choosing "All".`
              : 'You have no incoming bookings right now. New client bookings will appear here.'}
          </p>
        </div>
      )}

      {/* Decline Reason Modal (Decision Point 1) */}
      <DeclineModal
        booking={selectedDeclineBooking}
        isOpen={Boolean(selectedDeclineBooking)}
        onClose={() => setSelectedDeclineBooking(null)}
        onConfirm={(reason) => {
          if (selectedDeclineBooking) {
            declineBooking(selectedDeclineBooking.id, reason);
            setSelectedDeclineBooking(null);
          }
        }}
      />
    </div>
  );
};
