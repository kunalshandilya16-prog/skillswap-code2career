import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatRelativeTime } from '../utils/formatting';
import {
  Briefcase,
  PlusCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Ban,
  Users,
} from 'lucide-react';

export const CreatorGigs: React.FC = () => {
  const {
    gigs,
    activeCreatorId,
    creators,
    bookings,
    getGigStatus,
    navigateTo,
    withdrawGig,
  } = useApp();

  const currentCreator = creators.find((c) => c.id === activeCreatorId) || creators[0];

  const myGigs = gigs.filter(
    (g) => g.creatorId === currentCreator.id || g.creatorName === currentCreator.name
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Creator Services
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              Creator: <strong className="text-slate-800">{currentCreator.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Gigs & Listings ({myGigs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your service catalog, monitor availability states, and add new offerings to the marketplace.
          </p>
        </div>

        <button
          onClick={() => navigateTo('post')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Gig</span>
        </button>
      </div>

      {/* Grid of Creator Gigs */}
      {myGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGigs.map((gig) => {
            const status = getGigStatus(gig.id);
            const isPending = status.state === 'pending';
            const isAccepted = status.state === 'accepted';
            const gigBookings = bookings.filter((b) => b.gigId === gig.id);

            return (
              <div
                key={gig.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100 uppercase">
                      {gig.category}
                    </span>

                    {/* Status Badge */}
                    {gig.isWithdrawn || status.state === 'withdrawn' ? (
                      <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                        <Ban className="w-3 h-3 text-rose-600" />
                        Withdrawn
                      </span>
                    ) : isPending ? (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {status.pendingCount} Pending Review
                      </span>
                    ) : isAccepted ? (
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Currently Booked
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

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {gig.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      <strong className="text-indigo-600 font-bold">{status.totalApplied} applied</strong> ({status.pendingCount} pending review)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatCurrency(gig.rate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!gig.isWithdrawn && status.state !== 'withdrawn' && (
                      <button
                        type="button"
                        onClick={() => withdrawGig(gig.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-rose-200"
                        title="Withdraw this gig from marketplace"
                      >
                        <Ban className="w-3 h-3" />
                        <span>Withdraw</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => navigateTo('gig-details', gig.id)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
                    >
                      <span>Manage</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 max-w-md mx-auto">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No gigs posted yet</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            You haven't published any service listings under this creator account yet.
          </p>
          <button
            onClick={() => navigateTo('post')}
            className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post your first gig</span>
          </button>
        </div>
      )}
    </div>
  );
};
