import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import {
  Sparkles,
  Compass,
  PlusCircle,
  CalendarCheck,
  LayoutDashboard,
  User,
  Briefcase,
  RotateCcw,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Inbox,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setRole,
    activeView,
    navigateTo,
    bookings,
    resetData,
    creators,
    activeCreatorId,
    setActiveCreatorId,
    clients,
    activeClientId,
    activeClient,
    setActiveClientId,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Active creator details
  const currentCreator = creators.find((c) => c.id === activeCreatorId) || creators[0];

  // Requests count for the active creator
  const pendingRequestsCount = bookings.filter(
    (b) =>
      b.status === 'Pending' &&
      (b.creatorId === activeCreatorId || b.creatorName === currentCreator?.name)
  ).length;

  // Active bookings for currently active Client
  const clientActiveBookingsCount = bookings.filter(
    (b) =>
      (b.clientId === activeClientId ||
        b.clientName.toLowerCase() === activeClient?.name.toLowerCase()) &&
      (b.status === 'Pending' || b.status === 'Accepted')
  ).length;

  const handleNavClick = (view: AppView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              id="nav-logo-button"
              onClick={() => handleNavClick(currentRole === 'creator' ? 'dashboard' : 'marketplace')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-98 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Skill<span className="text-indigo-600">Swap</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    currentRole === 'client'
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {currentRole === 'client' ? 'Client' : 'Creator Hub'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  {currentRole === 'client' ? 'Discover talent • Book gigs' : 'Manage gigs • Fulfill bookings'}
                </p>
              </div>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* NAVIGATION LINKS: STRICTLY SEPARATE CLIENT VS CREATOR */}
          {/* ========================================================================= */}

          {/* 1. CLIENT NAVIGATION */}
          {currentRole === 'client' && (
            <nav id="client-nav-links" className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                id="nav-link-marketplace"
                onClick={() => handleNavClick('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeView === 'marketplace'
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Marketplace</span>
              </button>

              <button
                id="nav-link-bookings"
                onClick={() => handleNavClick('bookings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer relative ${
                  activeView === 'bookings'
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-indigo-600" />
                <span>My Bookings</span>
                {clientActiveBookingsCount > 0 && (
                  <span className="ml-1 px-2 py-0.2 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                    {clientActiveBookingsCount}
                  </span>
                )}
              </button>
            </nav>
          )}

          {/* 2. CREATOR NAVIGATION */}
          {currentRole === 'creator' && (
            <nav id="creator-nav-links" className="hidden md:flex items-center gap-1 lg:gap-1.5">
              <button
                id="nav-creator-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Dashboard</span>
                {pendingRequestsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                id="nav-creator-gigs"
                onClick={() => handleNavClick('creator-gigs')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'creator-gigs'
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>My Gigs</span>
              </button>

              <button
                id="nav-creator-post"
                onClick={() => handleNavClick('post')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'post'
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Post a Gig</span>
              </button>

              <button
                id="nav-creator-profile"
                onClick={() => handleNavClick('creator-profile-edit')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'creator-profile-edit'
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>Creator Profile</span>
              </button>
            </nav>
          )}

          {/* Right Controls: Role Switch & Reset */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Client Identity Selector (when simulating Client View) */}
            {currentRole === 'client' && (
              <div
                id="client-profile-switcher-nav"
                className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-1.5 pl-2 pr-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Client:</span>
                </div>
                <select
                  id="select-active-client-nav"
                  value={activeClientId}
                  onChange={(e) => setActiveClientId(e.target.value)}
                  className="bg-white border-0 text-slate-800 font-bold text-xs py-1 px-2.5 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                  title="Switch active client profile"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || 'Client'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Creator Identity Selector (when simulating Creator View) */}
            {currentRole === 'creator' && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase pl-2">As:</span>
                <select
                  value={activeCreatorId}
                  onChange={(e) => setActiveCreatorId(e.target.value)}
                  className="bg-white border-0 text-slate-800 font-bold text-xs py-1 px-2 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  title="Choose which creator to act as"
                >
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.specialization})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Role Switcher Button */}
            {currentRole === 'client' ? (
              <button
                id="btn-switch-to-creator-view"
                type="button"
                onClick={() => setRole('creator')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
              >
                <Briefcase className="w-3.5 h-3.5 text-indigo-200" />
                <span>Switch to Creator View</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                id="btn-switch-to-client-view"
                type="button"
                onClick={() => setRole('client')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                <Compass className="w-3.5 h-3.5 text-slate-300" />
                <span>Switch to Client View</span>
              </button>
            )}

            {/* Quick Reset Demo Data */}
            <button
              id="btn-reset-demo"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset all demo data (seed gigs, creators, reviews)"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2">
          {/* Mobile Role Switcher */}
          <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl">
            <span className="text-xs font-bold text-slate-700">Role Mode:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setRole('client');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  currentRole === 'client'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Client
              </button>
              <button
                onClick={() => {
                  setRole('creator');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  currentRole === 'creator'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Creator
              </button>
            </div>
          </div>

          {/* Mobile Client Selector */}
          {currentRole === 'client' && (
            <div className="p-2 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Active Client Profile:</span>
              <select
                id="select-active-client-mobile"
                value={activeClientId}
                onChange={(e) => setActiveClientId(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 font-bold text-xs py-1.5 px-2 rounded-lg"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company || 'Client'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mobile Creator Selector */}
          {currentRole === 'creator' && (
            <div className="p-2 bg-indigo-50 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block">Active Creator:</span>
              <select
                value={activeCreatorId}
                onChange={(e) => setActiveCreatorId(e.target.value)}
                className="w-full bg-white border border-indigo-200 text-slate-800 font-bold text-xs py-1.5 px-2 rounded-lg"
              >
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.specialization})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Client Links */}
          {currentRole === 'client' && (
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleNavClick('marketplace')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeView === 'marketplace'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-5 h-5 text-indigo-600" />
                <span>Marketplace</span>
              </button>
              <button
                onClick={() => handleNavClick('bookings')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeView === 'bookings'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-5 h-5 text-indigo-600" />
                  <span>My Bookings</span>
                </div>
                {clientActiveBookingsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                    {clientActiveBookingsCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Creator Links */}
          {currentRole === 'creator' && (
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                  <span>Dashboard & Requests</span>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                    {pendingRequestsCount} new
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('creator-gigs')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeView === 'creator-gigs'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>My Gigs</span>
              </button>

              <button
                onClick={() => handleNavClick('post')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeView === 'post'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Post a Gig</span>
              </button>

              <button
                onClick={() => handleNavClick('creator-profile-edit')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeView === 'creator-profile-edit'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-5 h-5 text-indigo-600" />
                <span>Creator Profile & Portfolio</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Evaluator Tools:</span>
            <button
              onClick={() => {
                resetData();
                setMobileMenuOpen(false);
              }}
              className="text-indigo-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          id="reset-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl animate-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will restore all seed creators, gigs, completed bookings, and authentic reviews to their initial hackathon state.
            </p>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-reset"
                type="button"
                onClick={() => {
                  resetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
