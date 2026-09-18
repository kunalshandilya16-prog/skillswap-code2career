import { Gig, Booking, UserRole, Creator, Review, PortfolioItem, Client } from '../types';
import {
  INITIAL_CREATORS,
  INITIAL_GIGS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_CLIENTS,
} from '../data/seedData';

const STORAGE_KEYS = {
  CREATORS: 'skillswap_creators_v2',
  GIGS: 'skillswap_gigs_v2',
  BOOKINGS: 'skillswap_bookings_v2',
  REVIEWS: 'skillswap_reviews_v2',
  CLIENTS: 'skillswap_clients_v2',
  ROLE: 'skillswap_current_role_v2',
  ACTIVE_CREATOR_ID: 'skillswap_active_creator_id_v2',
  ACTIVE_CLIENT_ID: 'skillswap_active_client_id_v2',
  SELECTED_CLIENT: 'skillswap_selected_client_v2',
};

export const StorageService = {
  // ----------------- CLIENTS -----------------
  getClients(): Client[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (!data) {
        this.saveClients(INITIAL_CLIENTS);
        return INITIAL_CLIENTS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveClients(INITIAL_CLIENTS);
        return INITIAL_CLIENTS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load clients from localStorage:', e);
      return INITIAL_CLIENTS;
    }
  },

  saveClients(clients: Client[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error('Failed to save clients to localStorage:', e);
    }
  },

  getClientById(id: string): Client | undefined {
    const clients = this.getClients();
    return clients.find((c) => c.id === id);
  },

  getActiveClientId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_CLIENT_ID) || 'client-1';
    } catch {
      return 'client-1';
    }
  },

  saveActiveClientId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CLIENT_ID, id);
    } catch (e) {
      console.error('Failed to save active client id:', e);
    }
  },

  // ----------------- CREATORS -----------------
  getCreators(): Creator[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREATORS);
      if (!data) {
        this.saveCreators(INITIAL_CREATORS);
        return INITIAL_CREATORS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveCreators(INITIAL_CREATORS);
        return INITIAL_CREATORS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load creators from localStorage:', e);
      return INITIAL_CREATORS;
    }
  },

  saveCreators(creators: Creator[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
    } catch (e) {
      console.error('Failed to save creators to localStorage:', e);
    }
  },

  getCreatorById(id: string): Creator | undefined {
    const creators = this.getCreators();
    return creators.find((c) => c.id === id);
  },

  updateCreator(updated: Creator): void {
    const creators = this.getCreators();
    const index = creators.findIndex((c) => c.id === updated.id);
    if (index >= 0) {
      creators[index] = updated;
    } else {
      creators.push(updated);
    }
    this.saveCreators(creators);
  },

  getActiveCreatorId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_CREATOR_ID) || 'creator-1';
    } catch {
      return 'creator-1';
    }
  },

  saveActiveCreatorId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CREATOR_ID, id);
    } catch (e) {
      console.error('Failed to save active creator id:', e);
    }
  },

  // ----------------- GIGS -----------------
  getGigs(): Gig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GIGS);
      if (!data) {
        this.saveGigs(INITIAL_GIGS);
        return INITIAL_GIGS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveGigs(INITIAL_GIGS);
        return INITIAL_GIGS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load gigs from localStorage:', e);
      return INITIAL_GIGS;
    }
  },

  saveGigs(gigs: Gig[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GIGS, JSON.stringify(gigs));
    } catch (e) {
      console.error('Failed to save gigs to localStorage:', e);
    }
  },

  // ----------------- BOOKINGS -----------------
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        this.saveBookings(INITIAL_BOOKINGS);
        return INITIAL_BOOKINGS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        this.saveBookings(INITIAL_BOOKINGS);
        return INITIAL_BOOKINGS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load bookings from localStorage:', e);
      return INITIAL_BOOKINGS;
    }
  },

  saveBookings(bookings: Booking[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage:', e);
    }
  },

  // ----------------- REVIEWS -----------------
  getReviews(): Review[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!data) {
        this.saveReviews(INITIAL_REVIEWS);
        return INITIAL_REVIEWS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        this.saveReviews(INITIAL_REVIEWS);
        return INITIAL_REVIEWS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load reviews from localStorage:', e);
      return INITIAL_REVIEWS;
    }
  },

  saveReviews(reviews: Review[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage:', e);
    }
  },

  // ----------------- ROLE & CLIENT IDENTITY -----------------
  getRole(): UserRole {
    try {
      const role = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (role === 'creator' || role === 'client') {
        return role;
      }
      return 'client';
    } catch {
      return 'client';
    }
  },

  saveRole(role: UserRole): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {
      console.error('Failed to save role to localStorage:', e);
    }
  },

  getSelectedClient(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_CLIENT) || 'All';
    } catch {
      return 'All';
    }
  },

  saveSelectedClient(client: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CLIENT, client);
    } catch (e) {
      console.error('Failed to save selected client to localStorage:', e);
    }
  },

  // ----------------- RESET ALL -----------------
  resetAll(): {
    creators: Creator[];
    gigs: Gig[];
    bookings: Booking[];
    reviews: Review[];
    clients: Client[];
  } {
    try {
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(INITIAL_CREATORS));
      localStorage.setItem(STORAGE_KEYS.GIGS, JSON.stringify(INITIAL_GIGS));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem(STORAGE_KEYS.ROLE, 'client');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CREATOR_ID, 'creator-1');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CLIENT_ID, 'client-1');
      localStorage.setItem(STORAGE_KEYS.SELECTED_CLIENT, 'All');
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
    return {
      creators: INITIAL_CREATORS,
      gigs: INITIAL_GIGS,
      bookings: INITIAL_BOOKINGS,
      reviews: INITIAL_REVIEWS,
      clients: INITIAL_CLIENTS,
    };
  },

  /**
   * Helper to evaluate a gig's booking availability according to updated Decision Point 2:
   * - Multiple clients can submit booking requests for the same gig
   * - If Pending requests exist -> isAvailable: true (clients can still apply)
   * - If Accepted -> unavailable ("Currently unavailable" / booked)
   * - If Withdrawn -> unavailable ("Service withdrawn")
   */
  getGigBookingStatus(gigId: string, bookings: Booking[], gig?: Gig): {
    isAvailable: boolean;
    state: 'available' | 'pending' | 'accepted' | 'withdrawn';
    activeBooking?: Booking;
    pendingCount: number;
    totalApplied: number;
  } {
    const gigBookings = bookings.filter((b) => b.gigId === gigId);
    const totalApplied = gigBookings.length;
    const pendingBookings = gigBookings.filter((b) => b.status === 'Pending');

    if (gig?.isWithdrawn) {
      return {
        isAvailable: false,
        state: 'withdrawn',
        pendingCount: pendingBookings.length,
        totalApplied,
      };
    }

    const activeAccepted = gigBookings.find((b) => b.status === 'Accepted');
    if (activeAccepted) {
      return {
        isAvailable: false,
        state: 'accepted',
        activeBooking: activeAccepted,
        pendingCount: pendingBookings.length,
        totalApplied,
      };
    }

    if (pendingBookings.length > 0) {
      return {
        isAvailable: true,
        state: 'pending',
        activeBooking: pendingBookings[0],
        pendingCount: pendingBookings.length,
        totalApplied,
      };
    }

    return {
      isAvailable: true,
      state: 'available',
      pendingCount: 0,
      totalApplied,
    };
  },
};
