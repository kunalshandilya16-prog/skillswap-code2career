import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { Marketplace } from './pages/Marketplace';
import { GigDetails } from './pages/GigDetails';
import { PostGig } from './pages/PostGig';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { CreatorGigs } from './pages/CreatorGigs';
import { CreatorProfileEdit } from './pages/CreatorProfileEdit';
import { CreatorPublicProfile } from './pages/CreatorPublicProfile';
import { MyBookings } from './pages/MyBookings';
import {
  Award,
  Sparkles,
  Users,
  Compass,
  Briefcase,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, navigateTo, currentRole, setRole, activeCreatorId } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar with Role Switcher */}
      <Navbar />

      {/* Main View Area */}
      <main
        id="app-main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8"
      >
        {activeView === 'marketplace' && <Marketplace />}
        {activeView === 'gig-details' && <GigDetails />}
        {activeView === 'bookings' && <MyBookings />}
        {activeView === 'post' && <PostGig />}
        {(activeView === 'dashboard' || activeView === 'creator-dashboard') && (
          <CreatorDashboard />
        )}
        {activeView === 'creator-gigs' && <CreatorGigs />}
        {activeView === 'creator-profile-edit' && <CreatorProfileEdit />}
        {activeView === 'creator-profile' && <CreatorPublicProfile />}
      </main>

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* SkillSwap Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                S
              </div>
              <span className="font-bold text-slate-800">SkillSwap</span>
              <span>— Creator Marketplace with Star Ratings & Verified Reviews</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => {
                  setRole('client');
                  navigateTo('marketplace');
                }}
                className="hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Client Marketplace
              </button>
              <button
                onClick={() => {
                  setRole('client');
                  navigateTo('bookings');
                }}
                className="hover:text-indigo-600 transition-colors cursor-pointer"
              >
                My Bookings & Reviews
              </button>
              <button
                onClick={() => {
                  setRole('creator');
                  navigateTo('creator-dashboard');
                }}
                className="hover:text-indigo-600 transition-colors cursor-pointer font-semibold text-indigo-700"
              >
                Creator Hub
              </button>
              <button
                onClick={() => {
                  setRole('creator');
                  navigateTo('post');
                }}
                className="hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Post a Gig
              </button>
            </div>
          </div>

                  </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
