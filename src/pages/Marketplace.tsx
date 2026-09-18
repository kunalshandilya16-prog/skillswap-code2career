import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, Category } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/formatting';
import { StarRating } from '../components/common/StarRating';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
  ThumbsUp,
  Users,
  Ban,
} from 'lucide-react';

export const Marketplace: React.FC = () => {
  const {
    gigs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    reviews,
    bookings,
    currentRole,
    activeCreatorId,
    navigateTo,
    getGigStatus,
    getCreatorForGig,
    getCreatorStats,
  } = useApp();

  // Sorting & Filtering implementation
  const filteredGigs = useMemo(() => {
    // 1. Filter first by category and search
    const filtered = gigs.filter((gig) => {
      const matchesCategory =
        selectedCategory === 'All' || gig.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gig.title.toLowerCase().includes(q) ||
        gig.description.toLowerCase().includes(q) ||
        gig.creatorName.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    // Helper to calculate sorting metrics per gig
    const getGigSortingMetrics = (gig: (typeof gigs)[0]) => {
      const gigReviews = reviews.filter((r) => r.gigId === gig.id);
      const creatorReviews = reviews.filter((r) => r.creatorId === gig.creatorId);
      const relevantReviews = gigReviews.length > 0 ? gigReviews : creatorReviews;
      const reviewCount = relevantReviews.length;
      const avgRating =
        reviewCount > 0
          ? relevantReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      const bookingCount = bookings.filter((b) => b.gigId === gig.id).length;
      // Formula for popularity: bookings weighted 3x + reviews weighted 2x + avg rating
      const popularityScore = bookingCount * 3 + reviewCount * 2 + avgRating;

      return {
        reviewCount,
        avgRating,
        bookingCount,
        popularityScore,
        createdAtTime: new Date(gig.createdAt).getTime(),
      };
    };

    // 2. Sort filtered gigs according to selected sortBy option
    return [...filtered].sort((a, b) => {
      const metricsA = getGigSortingMetrics(a);
      const metricsB = getGigSortingMetrics(b);

      switch (sortBy) {
        case 'cheapest':
          if (a.rate !== b.rate) return a.rate - b.rate;
          return metricsB.createdAtTime - metricsA.createdAtTime;

        case 'expensive':
          if (a.rate !== b.rate) return b.rate - a.rate;
          return metricsB.createdAtTime - metricsA.createdAtTime;

        case 'highest-rated':
          // Highest rated: average rating descending, 0 reviews rank lowest
          if (metricsB.avgRating !== metricsA.avgRating) {
            return metricsB.avgRating - metricsA.avgRating;
          }
          if (metricsB.reviewCount !== metricsA.reviewCount) {
            return metricsB.reviewCount - metricsA.reviewCount;
          }
          return metricsB.createdAtTime - metricsA.createdAtTime;

        case 'most-reviewed':
          // Most reviewed: total review count descending
          if (metricsB.reviewCount !== metricsA.reviewCount) {
            return metricsB.reviewCount - metricsA.reviewCount;
          }
          if (metricsB.avgRating !== metricsA.avgRating) {
            return metricsB.avgRating - metricsA.avgRating;
          }
          return metricsB.createdAtTime - metricsA.createdAtTime;

        case 'most-popular':
          // Most popular: formula based on bookings + reviews + rating
          if (metricsB.popularityScore !== metricsA.popularityScore) {
            return metricsB.popularityScore - metricsA.popularityScore;
          }
          return metricsB.createdAtTime - metricsA.createdAtTime;

        case 'newest':
        default:
          // Decision Point 3 default: Always newest first (descending timestamp)
          return metricsB.createdAtTime - metricsA.createdAtTime;
      }
    });
  }, [gigs, searchQuery, selectedCategory, sortBy, reviews, bookings]);

  return (
    <div className="space-y-10 pb-16">
      {/* Client View Hero Section */}
      <section
        id="marketplace-hero"
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-14 border border-slate-800 shadow-xl"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Client Discovery Hub • Verified Creator Reviews
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Discover top creators & book exceptional talent.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            Browse creative offerings in design, video editing, development, tutoring, and music.
            Inspect verified client ratings, explore portfolios, and secure bookings directly.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              id="hero-cta-explore"
              onClick={() => {
                const el = document.getElementById('marketplace-search-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              Explore Gigs
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-cta-my-bookings"
              onClick={() => navigateTo('bookings')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/15 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              My Bookings
            </button>
          </div>
        </div>
      </section>

      {/* Search, Filter & Discovery Bar */}
      <section id="marketplace-search-section" className="space-y-4 pt-2">
        {/* Search input and category row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="marketplace-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gigs by service title, creator name, or keywords..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Client-Controlled Sorting Control */}
          <div
            id="marketplace-sort-container"
            className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <label htmlFor="marketplace-sort-select" className="text-slate-500 font-medium whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="marketplace-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs py-1.5 px-3 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
            >
              <option value="newest">Newest First (Default)</option>
              <option value="cheapest">Price: Low to High (Cheapest)</option>
              <option value="expensive">Price: High to Low (Most Expensive)</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="most-reviewed">Most Reviewed</option>
              <option value="most-popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            id="category-filter-all"
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Services
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => setSelectedCategory(cat as Category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="text-sm font-semibold text-slate-800">
          Showing <span className="text-indigo-600 font-bold">{filteredGigs.length}</span>{' '}
          {filteredGigs.length === 1 ? 'service listing' : 'service listings'}
          {selectedCategory !== 'All' && (
            <span className="text-slate-500 font-normal"> in {selectedCategory}</span>
          )}
          {searchQuery && (
            <span className="text-slate-500 font-normal"> matching "{searchQuery}"</span>
          )}
          <span className="text-slate-400 font-normal text-xs ml-2 hidden md:inline">
            • Sorted by <strong className="text-slate-700 font-semibold">{
              sortBy === 'newest' ? 'Newest First' :
              sortBy === 'cheapest' ? 'Price: Low to High' :
              sortBy === 'expensive' ? 'Price: High to Low' :
              sortBy === 'highest-rated' ? 'Highest Rated' :
              sortBy === 'most-reviewed' ? 'Most Reviewed' :
              'Most Popular'
            }</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium mr-1">Quick:</span>
          {(['newest', 'cheapest', 'highest-rated', 'most-popular'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSortBy(s)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                sortBy === s
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {s === 'newest' ? 'Newest' : s === 'cheapest' ? 'Cheapest' : s === 'highest-rated' ? 'Top Rated' : 'Popular'}
            </button>
          ))}
        </div>
      </div>

      {/* Gigs Grid with Star Ratings & Creator Profile links */}
      {filteredGigs.length > 0 ? (
        <div id="gigs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => {
            const bookingStatus = getGigStatus(gig.id);
            const isPending = bookingStatus.state === 'pending';
            const isAccepted = bookingStatus.state === 'accepted';
            const creator = getCreatorForGig(gig);
            const creatorStats = getCreatorStats(creator.id);

            return (
              <div
                key={gig.id}
                id={`gig-card-${gig.id}`}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Category & Status Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {gig.category}
                      </span>
                      {currentRole === 'creator' && activeCreatorId === gig.creatorId && (
                        <span
                          id={`own-gig-badge-${gig.id}`}
                          className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
                          title="This gig belongs to your active creator profile"
                        >
                          Your Gig
                        </span>
                      )}
                    </div>

                    {/* Decision Point 2 Availability Badges */}
                    {gig.isWithdrawn || bookingStatus.state === 'withdrawn' ? (
                      <span
                        id={`status-badge-${gig.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200"
                        title="This gig has been withdrawn by the creator"
                      >
                        <Ban className="w-3 h-3 text-rose-600" />
                        Withdrawn
                      </span>
                    ) : isAccepted ? (
                      <span
                        id={`status-badge-${gig.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200"
                        title="Booked and accepted by creator"
                      >
                        <Lock className="w-3 h-3 text-slate-500" />
                        Currently booked
                      </span>
                    ) : isPending ? (
                      <span
                        id={`status-badge-${gig.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"
                        title="Multiple clients can apply. Creator will review applications."
                      >
                        <Users className="w-3 h-3 text-indigo-600" />
                        {bookingStatus.pendingCount} pending
                      </span>
                    ) : (
                      <span
                        id={`status-badge-${gig.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Available to book
                      </span>
                    )}
                  </div>

                  {/* Title (clickable to gig details) */}
                  <h3
                    onClick={() => navigateTo('gig-details', gig.id)}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
                  >
                    {gig.title}
                  </h3>

                  {/* Requests Applied counter badge */}
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-indigo-600">
                      {bookingStatus.totalApplied} {bookingStatus.totalApplied === 1 ? 'request' : 'requests'} applied
                    </span>
                    {bookingStatus.pendingCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-700 font-medium">
                          {bookingStatus.pendingCount} pending review
                        </span>
                      </>
                    )}
                  </div>

                  {/* Creator Info & Star Rating Row */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    {/* Creator Identity with clickable Profile link */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => navigateTo('creator-profile', creator.id)}
                        className="flex items-center gap-2 group/creator text-left cursor-pointer"
                        title={`View ${creator.name}'s full profile & portfolio`}
                      >
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 group-hover/creator:ring-2 group-hover/creator:ring-indigo-400 transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-bold text-slate-800 group-hover/creator:text-indigo-600 transition-colors">
                          {creator.name}
                        </span>
                      </button>

                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(gig.createdAt)}
                      </span>
                    </div>

                    {/* Prominent Star Rating Display */}
                    <div
                      id={`gig-rating-${gig.id}`}
                      className="flex items-center justify-between gap-2 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100"
                    >
                      {creatorStats.reviewCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <StarRating
                            rating={creatorStats.averageRating}
                            reviewCount={creatorStats.reviewCount}
                            size="xs"
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          ★ New Creator
                        </span>
                      )}

                      {creatorStats.reviewCount > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                          <ThumbsUp className="w-2.5 h-2.5" />
                          {creatorStats.positivePercentage}% positive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {gig.description}
                  </p>
                </div>

                {/* Footer with Rate & Action */}
                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Starting Rate
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatCurrency(gig.rate)}
                    </span>
                  </div>

                  <button
                    id={`btn-view-gig-${gig.id}`}
                    type="button"
                    onClick={() => navigateTo('gig-details', gig.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer ${
                      currentRole === 'creator' && activeCreatorId === gig.creatorId
                        ? 'bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-300'
                        : 'bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600'
                    }`}
                  >
                    <span>
                      {currentRole === 'creator' && activeCreatorId === gig.creatorId
                        ? 'View Your Gig'
                        : 'View Gig'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          id="marketplace-empty-state"
          className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 max-w-md mx-auto"
        >
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No gigs found</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {searchQuery
              ? `No services match "${searchQuery}" in ${selectedCategory}. Try clearing search or selecting a different category.`
              : `No services currently available in ${selectedCategory}.`}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
