export type Category =
  | 'Design'
  | 'Video Editing'
  | 'Programming'
  | 'Tutoring'
  | 'Music'
  | 'Writing'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Design',
  'Video Editing',
  'Programming',
  'Tutoring',
  'Music',
  'Writing',
  'Other',
];

export type BookingStatus = 'Pending' | 'Accepted' | 'Completed' | 'Declined';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category?: Category;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedAt: string;
  totalBookings?: number;
  completedBookings?: number;
  company?: string;
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  specialization: Category;
  portfolio: PortfolioItem[];
  createdAt: string; // ISO string
  totalGigsPosted?: number;
  totalGigsCompleted?: number;
}

export interface Gig {
  id: string;
  creatorId: string;
  title: string;
  category: Category;
  rate: number; // in INR / currency units
  description: string;
  creatorName: string;
  createdAt: string; // ISO string
  available: boolean; // Computed or persisted availability
  isWithdrawn?: boolean;
  withdrawnAt?: string;
}

export interface Booking {
  id: string;
  gigId: string;
  creatorId?: string;
  clientId?: string;
  gigTitle: string;
  gigCategory?: Category;
  gigRate?: number;
  creatorName: string;
  clientName: string;
  clientEmail: string;
  message: string;
  createdAt: string; // ISO string
  status: BookingStatus;
  declineReason?: string;
  completedAt?: string;
  reviewed?: boolean;
}

export interface Review {
  id: string;
  gigId: string;
  creatorId: string;
  bookingId?: string;
  clientId?: string;
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string; // ISO string
}

export type SortOption =
  | 'newest'
  | 'cheapest'
  | 'expensive'
  | 'highest-rated'
  | 'most-reviewed'
  | 'most-popular';

export type UserRole = 'client' | 'creator';

export type AppView =
  | 'marketplace'
  | 'gig-details'
  | 'post'
  | 'dashboard'
  | 'creator-dashboard'
  | 'bookings'
  | 'creator-profile'
  | 'creator-gigs'
  | 'creator-profile-edit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number;
}
