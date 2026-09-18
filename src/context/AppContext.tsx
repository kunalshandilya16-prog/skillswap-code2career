import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Gig,
  Booking,
  UserRole,
  AppView,
  Category,
  ToastMessage,
  Creator,
  Review,
  PortfolioItem,
  Client,
  SortOption,
} from '../types';
import { StorageService } from '../services/storage';
import { calculateCreatorStats, CreatorStats } from '../utils/ratingStats';
import { INITIAL_CLIENTS } from '../data/seedData';

interface AppContextType {
  gigs: Gig[];
  bookings: Booking[];
  creators: Creator[];
  reviews: Review[];
  clients: Client[];
  activeClientId: string;
  activeClient: Client;
  currentRole: UserRole;
  activeView: AppView;
  selectedGigId: string | null;
  selectedCreatorId: string | null;
  activeCreatorId: string;
  searchQuery: string;
  selectedCategory: Category | 'All';
  clientFilter: string;
  sortBy: SortOption;
  toasts: ToastMessage[];

  // Role & View Actions
  setRole: (role: UserRole) => void;
  setActiveCreatorId: (id: string) => void;
  setActiveClientId: (id: string) => void;
  updateClientProfile: (client: Client) => void;
  setSortBy: (sort: SortOption) => void;
  navigateTo: (
    view: AppView,
    targetId?: string,
    prefillCategory?: Category | 'All'
  ) => void;

  // Gig Actions
  createGig: (data: {
    title: string;
    category: Category;
    rate: number;
    description: string;
    creatorName: string;
    creatorId?: string;
  }) => Gig;
  withdrawGig: (gigId: string) => { success: boolean; error?: string };

  // Booking Actions
  bookGig: (
    gigId: string,
    clientData: { clientName: string; clientEmail: string; message: string }
  ) => { success: boolean; error?: string; booking?: Booking };
  acceptBooking: (bookingId: string) => { success: boolean; error?: string };
  declineBooking: (bookingId: string, reason?: string) => { success: boolean; error?: string };
  completeBooking: (bookingId: string) => { success: boolean; error?: string };

  // Review Actions
  submitReview: (data: {
    bookingId: string;
    gigId: string;
    creatorId: string;
    creatorName: string;
    clientName: string;
    rating: number;
    comment: string;
  }) => { success: boolean; error?: string; review?: Review };

  // Creator & Portfolio Management
  updateCreatorProfile: (creator: Creator) => void;
  addPortfolioItem: (
    creatorId: string,
    item: Omit<PortfolioItem, 'id' | 'createdAt'>
  ) => void;
  deletePortfolioItem: (creatorId: string, itemId: string) => void;

  // Query & Stats Helpers
  getCreatorById: (id: string) => Creator | undefined;
  getCreatorForGig: (gig: Gig) => Creator;
  getCreatorStats: (creatorId: string) => CreatorStats;
  getGigStatus: (gigId: string) => {
    isAvailable: boolean;
    state: 'available' | 'pending' | 'accepted' | 'withdrawn';
    activeBooking?: Booking;
    pendingCount: number;
    totalApplied: number;
  };

  // Filters & Utility
  resetData: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  setClientFilter: (filter: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creators, setCreators] = useState<Creator[]>(() => StorageService.getCreators());
  const [gigs, setGigs] = useState<Gig[]>(() => StorageService.getGigs());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());
  const [clients, setClients] = useState<Client[]>(() => StorageService.getClients());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => StorageService.getRole());
  const [activeCreatorId, setActiveCreatorIdState] = useState<string>(() =>
    StorageService.getActiveCreatorId()
  );
  const [activeClientId, setActiveClientIdState] = useState<string>(() =>
    StorageService.getActiveClientId()
  );
  const [clientFilter, setClientFilterState] = useState<string>(() =>
    StorageService.getSelectedClient()
  );

  const activeClient = useMemo(() => {
    return (
      clients.find((c) => c.id === activeClientId) ||
      clients[0] ||
      INITIAL_CLIENTS[0]
    );
  }, [clients, activeClientId]);

  const setActiveClientId = useCallback(
    (id: string) => {
      setActiveClientIdState(id);
      StorageService.saveActiveClientId(id);
      const targetClient = clients.find((c) => c.id === id);
      if (targetClient) {
        setClientFilterState(targetClient.name);
        StorageService.saveSelectedClient(targetClient.name);
      }
    },
    [clients]
  );

  const updateClientProfile = useCallback((updatedClient: Client) => {
    setClients((prev) => {
      const next = prev.map((c) => (c.id === updatedClient.id ? updatedClient : c));
      StorageService.saveClients(next);
      return next;
    });
  }, []);

  const [activeView, setActiveView] = useState<AppView>(() => {
    // If role is creator, default view should be creator dashboard
    const role = StorageService.getRole();
    return role === 'creator' ? 'dashboard' : 'marketplace';
  });
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast manager
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id, duration: toast.duration || 4000 };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update hash when view or IDs change
  const updateUrlHash = useCallback(
    (view: AppView, targetId?: string | null) => {
      let hash = `#${view}`;
      if (view === 'gig-details' && targetId) {
        hash = `#gig/${targetId}`;
      } else if (view === 'creator-profile' && targetId) {
        hash = `#creator/${targetId}`;
      }
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    },
    []
  );

  // Sync hash changes on popstate / manual hash change
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash || hash === 'marketplace') {
        setActiveView('marketplace');
        setSelectedGigId(null);
      } else if (hash.startsWith('gig/')) {
        const id = hash.replace('gig/', '');
        setActiveView('gig-details');
        setSelectedGigId(id);
      } else if (hash.startsWith('creator/')) {
        const id = hash.replace('creator/', '');
        setActiveView('creator-profile');
        setSelectedCreatorId(id);
      } else if (hash === 'post') {
        setActiveView('post');
      } else if (hash === 'dashboard') {
        setActiveView('dashboard');
      } else if (hash === 'bookings') {
        setActiveView('bookings');
      } else if (hash === 'creator-gigs') {
        setActiveView('creator-gigs');
      } else if (hash === 'creator-profile-edit') {
        setActiveView('creator-profile-edit');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigateTo = useCallback(
    (view: AppView, targetId?: string, prefillCategory?: Category | 'All') => {
      setActiveView(view);

      if (view === 'gig-details') {
        setSelectedGigId(targetId || null);
      } else if (view === 'creator-profile') {
        setSelectedCreatorId(targetId || null);
      }

      if (prefillCategory !== undefined) {
        setSelectedCategory(prefillCategory);
      }

      updateUrlHash(view, targetId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateUrlHash]
  );

  const setRole = useCallback(
    (role: UserRole) => {
      setCurrentRole(role);
      StorageService.saveRole(role);

      // Send the user directly into that role's interface
      if (role === 'creator') {
        navigateTo('dashboard');
      } else {
        navigateTo('marketplace');
      }

      addToast({
        type: 'info',
        title: 'Role View Switched',
        message: `Now experiencing SkillSwap as ${role === 'creator' ? 'Creator' : 'Client'}.`,
        duration: 2500,
      });
    },
    [addToast, navigateTo]
  );

  const setActiveCreatorId = useCallback((id: string) => {
    setActiveCreatorIdState(id);
    StorageService.saveActiveCreatorId(id);
  }, []);

  const setClientFilter = useCallback((client: string) => {
    setClientFilterState(client);
    StorageService.saveSelectedClient(client);
  }, []);

  // Helper: Find Creator
  const getCreatorById = useCallback(
    (id: string): Creator | undefined => {
      return creators.find((c) => c.id === id);
    },
    [creators]
  );

  const getCreatorForGig = useCallback(
    (gig: Gig): Creator => {
      const found = creators.find((c) => c.id === gig.creatorId || c.name === gig.creatorName);
      if (found) return found;

      // Safe fallback entity
      return {
        id: gig.creatorId || 'creator-unknown',
        name: gig.creatorName,
        email: `${gig.creatorName.toLowerCase().replace(/\s+/g, '')}@skillswap.dev`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        headline: `${gig.category} Specialist`,
        bio: gig.description,
        specialization: gig.category,
        portfolio: [],
        createdAt: gig.createdAt,
        totalGigsPosted: 1,
        totalGigsCompleted: 0,
      };
    },
    [creators]
  );

  // Dynamic Creator Stats
  const getCreatorStats = useCallback(
    (creatorId: string): CreatorStats => {
      const creator = creators.find((c) => c.id === creatorId);
      return calculateCreatorStats(creator, reviews, gigs, bookings);
    },
    [creators, reviews, gigs, bookings]
  );

  // Availability helper
  const getGigStatus = useCallback(
    (gigId: string) => {
      const targetGig = gigs.find((g) => g.id === gigId);
      return StorageService.getGigBookingStatus(gigId, bookings, targetGig);
    },
    [gigs, bookings]
  );

  // WITHDRAW A GIG (Replaces self-booking restriction with creator withdrawal action)
  const withdrawGig = useCallback(
    (gigId: string): { success: boolean; error?: string } => {
      const targetGig = gigs.find((g) => g.id === gigId);
      if (!targetGig) {
        return { success: false, error: 'Gig not found.' };
      }

      const now = new Date().toISOString();

      // 1. Mark gig as withdrawn in state and storage
      const updatedGigs = gigs.map((g) =>
        g.id === gigId ? { ...g, available: false, isWithdrawn: true, withdrawnAt: now } : g
      );
      setGigs(updatedGigs);
      StorageService.saveGigs(updatedGigs);

      // 2. Reject all pending requests with "service not available"
      let rejectedCount = 0;
      const updatedBookings = bookings.map((b) => {
        if (b.gigId === gigId && b.status === 'Pending') {
          rejectedCount++;
          return {
            ...b,
            status: 'Declined' as const,
            declineReason: 'service not available',
          };
        }
        return b;
      });
      setBookings(updatedBookings);
      StorageService.saveBookings(updatedBookings);

      addToast({
        type: 'info',
        title: 'Gig Withdrawn',
        message: `"${targetGig.title}" has been withdrawn.${
          rejectedCount > 0
            ? ` ${rejectedCount} pending request(s) rejected with "service not available".`
            : ''
        }`,
      });

      return { success: true };
    },
    [gigs, bookings, addToast]
  );

  // POST A GIG
  const createGig = useCallback(
    (data: {
      title: string;
      category: Category;
      rate: number;
      description: string;
      creatorName: string;
      creatorId?: string;
    }): Gig => {
      // Find or assign creator
      const targetCreatorId = data.creatorId || activeCreatorId;
      const creator = creators.find((c) => c.id === targetCreatorId);
      const creatorName = creator ? creator.name : data.creatorName.trim();

      const newGig: Gig = {
        id: `gig-${Date.now()}`,
        creatorId: targetCreatorId,
        title: data.title.trim(),
        category: data.category,
        rate: Number(data.rate),
        description: data.description.trim(),
        creatorName,
        createdAt: new Date().toISOString(),
        available: true,
      };

      const updatedGigs = [newGig, ...gigs];
      setGigs(updatedGigs);
      StorageService.saveGigs(updatedGigs);

      // Increment creator's totalGigsPosted if exists
      if (creator) {
        const updatedCreators = creators.map((c) =>
          c.id === creator.id ? { ...c, totalGigsPosted: (c.totalGigsPosted || 0) + 1 } : c
        );
        setCreators(updatedCreators);
        StorageService.saveCreators(updatedCreators);
      }

      addToast({
        type: 'success',
        title: 'Gig Published',
        message: 'Your gig is now live at the top of the marketplace discovery feed.',
      });

      return newGig;
    },
    [gigs, creators, activeCreatorId, addToast]
  );

  // BOOK A GIG (Updated Decision Point 2: Multiple clients can request the same gig)
  const bookGig = useCallback(
    (
      gigId: string,
      clientData: { clientName: string; clientEmail: string; message: string }
    ): { success: boolean; error?: string; booking?: Booking } => {
      const targetGig = gigs.find((g) => g.id === gigId);
      if (!targetGig) {
        return { success: false, error: 'Gig not found.' };
      }

      if (targetGig.isWithdrawn) {
        return {
          success: false,
          error: 'This gig has been withdrawn and is no longer accepting requests.',
        };
      }

      // BUSINESS RULE: A creator cannot book a gig that belongs to the same creator
      if (currentRole === 'creator' && activeCreatorId === targetGig.creatorId) {
        addToast({
          type: 'error',
          title: 'Booking Restricted',
          message: 'Creators cannot book their own gigs. Use the Withdraw button if you want to remove it.',
        });
        return {
          success: false,
          error: 'Creators are not permitted to book their own gigs.',
        };
      }

      const status = StorageService.getGigBookingStatus(gigId, bookings, targetGig);
      if (status.state === 'accepted') {
        return {
          success: false,
          error: 'This gig has already been booked and accepted by the creator.',
        };
      }

      const resolvedClientId = activeClient.id;
      const resolvedClientName = clientData.clientName.trim() || activeClient.name;
      const resolvedClientEmail = (clientData.clientEmail.trim() || activeClient.email).toLowerCase();

      // Check if this specific client already has a pending request for this gig
      const clientAlreadyPending = bookings.some(
        (b) => b.gigId === gigId && b.clientId === resolvedClientId && b.status === 'Pending'
      );
      if (clientAlreadyPending) {
        return {
          success: false,
          error: 'You already have a pending booking request for this gig. Please wait for the creator to review it.',
        };
      }

      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        gigId: targetGig.id,
        creatorId: targetGig.creatorId,
        clientId: resolvedClientId,
        gigTitle: targetGig.title,
        gigCategory: targetGig.category,
        gigRate: targetGig.rate,
        creatorName: targetGig.creatorName,
        clientName: resolvedClientName,
        clientEmail: resolvedClientEmail,
        message: clientData.message.trim(),
        createdAt: new Date().toISOString(),
        status: 'Pending',
      };

      const updatedBookings = [newBooking, ...bookings];
      setBookings(updatedBookings);
      StorageService.saveBookings(updatedBookings);

      // Increment client total bookings count
      setClients((prev) => {
        const next = prev.map((c) =>
          c.id === resolvedClientId
            ? { ...c, totalBookings: (c.totalBookings || 0) + 1 }
            : c
        );
        StorageService.saveClients(next);
        return next;
      });

      setClientFilter(resolvedClientName);

      addToast({
        type: 'success',
        title: 'Booking Request Sent',
        message: `Your request for "${targetGig.title}" has been sent to ${targetGig.creatorName}. Multiple requests may be reviewed by the creator.`,
      });

      return { success: true, booking: newBooking };
    },
    [gigs, bookings, currentRole, activeCreatorId, activeClient, addToast, setClientFilter]
  );

  // CREATOR ACCEPTS BOOKING (Updated Decision Point 2: Accept best fit, auto-reject other pending with "Unfortunately, not available")
  const acceptBooking = useCallback(
    (bookingId: string): { success: boolean; error?: string } => {
      const target = bookings.find((b) => b.id === bookingId);
      if (!target) {
        return { success: false, error: 'Booking not found.' };
      }
      if (target.status !== 'Pending') {
        return {
          success: false,
          error: `Cannot accept a booking that is already ${target.status}.`,
        };
      }

      let autoDeclinedCount = 0;
      const updated = bookings.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'Accepted' as const };
        }
        // If it's a competing pending booking for the same gig, auto-decline
        if (b.gigId === target.gigId && b.status === 'Pending') {
          autoDeclinedCount++;
          return {
            ...b,
            status: 'Declined' as const,
            declineReason: 'Unfortunately, not available',
          };
        }
        return b;
      });

      setBookings(updated);
      StorageService.saveBookings(updated);

      addToast({
        type: 'success',
        title: 'Booking Accepted',
        message:
          autoDeclinedCount > 0
            ? `Booking accepted. ${autoDeclinedCount} other pending request(s) automatically declined with reason "Unfortunately, not available".`
            : 'Booking accepted. You can mark it Completed when deliverables are finished.',
      });

      return { success: true };
    },
    [bookings, addToast]
  );

  // CREATOR DECLINES BOOKING (Decision Point 1 & 2)
  const declineBooking = useCallback(
    (bookingId: string, reason?: string): { success: boolean; error?: string } => {
      const target = bookings.find((b) => b.id === bookingId);
      if (!target) {
        return { success: false, error: 'Booking not found.' };
      }
      if (target.status !== 'Pending') {
        return {
          success: false,
          error: `Cannot decline a booking that is already ${target.status}.`,
        };
      }

      const updated = bookings.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Declined' as const,
            declineReason: reason?.trim() ? reason.trim() : undefined,
          };
        }
        return b;
      });

      setBookings(updated);
      StorageService.saveBookings(updated);

      addToast({
        type: 'info',
        title: 'Booking Declined',
        message: 'Booking declined. The gig is now available again for new requests.',
      });

      return { success: true };
    },
    [bookings, addToast]
  );

  // CREATOR COMPLETES BOOKING (Unlocks Review Creation for Client)
  const completeBooking = useCallback(
    (bookingId: string): { success: boolean; error?: string } => {
      const target = bookings.find((b) => b.id === bookingId);
      if (!target) {
        return { success: false, error: 'Booking not found.' };
      }
      if (target.status !== 'Accepted') {
        return {
          success: false,
          error: `Only accepted bookings can be marked as completed. Current status: ${target.status}.`,
        };
      }

      const now = new Date().toISOString();
      const updatedBookings = bookings.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Completed' as const,
            completedAt: now,
          };
        }
        return b;
      });

      setBookings(updatedBookings);
      StorageService.saveBookings(updatedBookings);

      // Increment completed count for the creator
      const targetCreator = creators.find(
        (c) => c.id === target.creatorId || c.name === target.creatorName
      );
      if (targetCreator) {
        const updatedCreators = creators.map((c) =>
          c.id === targetCreator.id
            ? { ...c, totalGigsCompleted: (c.totalGigsCompleted || 0) + 1 }
            : c
        );
        setCreators(updatedCreators);
        StorageService.saveCreators(updatedCreators);
      }

      // Increment completed count for the client
      if (target.clientId) {
        setClients((prev) => {
          const next = prev.map((c) =>
            c.id === target.clientId
              ? { ...c, completedBookings: (c.completedBookings || 0) + 1 }
              : c
          );
          StorageService.saveClients(next);
          return next;
        });
      }

      addToast({
        type: 'success',
        title: 'Gig Marked as Completed',
        message: 'Great job! The client can now submit a verified review and rating.',
      });

      return { success: true };
    },
    [bookings, creators, addToast]
  );

  // CLIENT SUBMITS REVIEW
  const submitReview = useCallback(
    (data: {
      bookingId: string;
      gigId: string;
      creatorId: string;
      creatorName: string;
      clientName: string;
      rating: number;
      comment: string;
    }): { success: boolean; error?: string; review?: Review } => {
      const targetBooking = bookings.find((b) => b.id === data.bookingId);
      if (!targetBooking) {
        return { success: false, error: 'Booking not found.' };
      }
      if (targetBooking.status !== 'Completed') {
        return {
          success: false,
          error: 'Only completed bookings can be reviewed.',
        };
      }
      if (targetBooking.reviewed) {
        return {
          success: false,
          error: 'A review has already been submitted for this booking.',
        };
      }

      // Resolve creatorId
      let resolvedCreatorId = data.creatorId;
      if (!resolvedCreatorId) {
        const c = creators.find((cr) => cr.name === data.creatorName);
        resolvedCreatorId = c?.id || 'creator-1';
      }

      const newReview: Review = {
        id: `rev-${Date.now()}`,
        bookingId: data.bookingId,
        gigId: data.gigId,
        creatorId: resolvedCreatorId,
        clientId: activeClientId,
        clientName: data.clientName.trim() || activeClient.name,
        rating: data.rating,
        comment: data.comment.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      StorageService.saveReviews(updatedReviews);

      // Mark booking as reviewed
      const updatedBookings = bookings.map((b) =>
        b.id === data.bookingId ? { ...b, reviewed: true } : b
      );
      setBookings(updatedBookings);
      StorageService.saveBookings(updatedBookings);

      addToast({
        type: 'success',
        title: 'Review Published',
        message: 'Thank you! Your rating and feedback are now live on the creator profile.',
      });

      return { success: true, review: newReview };
    },
    [bookings, creators, reviews, activeClientId, activeClient, addToast]
  );

  // CREATOR PROFILE MANAGEMENT
  const updateCreatorProfile = useCallback(
    (updatedCreator: Creator) => {
      const updated = creators.map((c) =>
        c.id === updatedCreator.id ? updatedCreator : c
      );
      setCreators(updated);
      StorageService.saveCreators(updated);

      // Also update gig creatorNames if name changed
      const updatedGigs = gigs.map((g) =>
        g.creatorId === updatedCreator.id ? { ...g, creatorName: updatedCreator.name } : g
      );
      setGigs(updatedGigs);
      StorageService.saveGigs(updatedGigs);

      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your creator profile and portfolio changes are now live.',
      });
    },
    [creators, gigs, addToast]
  );

  // PORTFOLIO ITEM ADDITION
  const addPortfolioItem = useCallback(
    (creatorId: string, item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
      const newItem: PortfolioItem = {
        ...item,
        id: `port-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedCreators = creators.map((c) => {
        if (c.id === creatorId) {
          return {
            ...c,
            portfolio: [newItem, ...(c.portfolio || [])],
          };
        }
        return c;
      });

      setCreators(updatedCreators);
      StorageService.saveCreators(updatedCreators);

      addToast({
        type: 'success',
        title: 'Portfolio Item Added',
        message: `"${newItem.title}" has been added to your portfolio showcase.`,
      });
    },
    [creators, addToast]
  );

  // PORTFOLIO ITEM DELETION
  const deletePortfolioItem = useCallback(
    (creatorId: string, itemId: string) => {
      const updatedCreators = creators.map((c) => {
        if (c.id === creatorId) {
          return {
            ...c,
            portfolio: (c.portfolio || []).filter((p) => p.id !== itemId),
          };
        }
        return c;
      });

      setCreators(updatedCreators);
      StorageService.saveCreators(updatedCreators);

      addToast({
        type: 'info',
        title: 'Portfolio Item Removed',
        message: 'The item has been deleted from your portfolio.',
      });
    },
    [creators, addToast]
  );

  // RESET ALL DATA
  const resetData = useCallback(() => {
    const fresh = StorageService.resetAll();

    setCreators(fresh.creators);
    setGigs(fresh.gigs);
    setBookings(fresh.bookings);
    setReviews(fresh.reviews);
    setClients(fresh.clients);
    setCurrentRole('client');
    setActiveCreatorIdState('creator-1');
    setActiveClientIdState('client-1');
    setClientFilterState('All');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGigId(null);
    setSelectedCreatorId(null);
    navigateTo('marketplace');

    addToast({
      type: 'info',
      title: 'Reset Completed',
      message: 'Restored original demo data, client profiles, creators, and sample ratings.',
    });
  }, [navigateTo, addToast]);

  return (
    <AppContext.Provider
      value={{
        gigs,
        bookings,
        creators,
        reviews,
        clients,
        activeClientId,
        activeClient,
        currentRole,
        activeView,
        selectedGigId,
        selectedCreatorId,
        activeCreatorId,
        searchQuery,
        selectedCategory,
        clientFilter,
        sortBy,
        toasts,
        setRole,
        setActiveCreatorId,
        setActiveClientId,
        updateClientProfile,
        setSortBy,
        navigateTo,
        createGig,
        withdrawGig,
        bookGig,
        acceptBooking,
        declineBooking,
        completeBooking,
        submitReview,
        updateCreatorProfile,
        addPortfolioItem,
        deletePortfolioItem,
        getCreatorById,
        getCreatorForGig,
        getCreatorStats,
        getGigStatus,
        resetData,
        addToast,
        removeToast,
        setSearchQuery,
        setSelectedCategory,
        setClientFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
