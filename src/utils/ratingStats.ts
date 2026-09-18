import { Review, Gig, Booking, Creator } from '../types';

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface CreatorStats {
  averageRating: number;
  reviewCount: number;
  distribution: RatingDistribution[];
  positivePercentage: number;
  positiveCount: number;
  totalGigsPosted: number;
  totalGigsCompleted: number;
}

/**
 * Calculates real dynamic rating statistics for a creator based on real stored reviews
 */
export function calculateCreatorStats(
  creator: Creator | undefined,
  reviews: Review[],
  gigs: Gig[],
  bookings: Booking[]
): CreatorStats {
  const creatorId = creator?.id || '';
  
  // Filter reviews for this creator
  const creatorReviews = reviews.filter((r) => r.creatorId === creatorId);
  const reviewCount = creatorReviews.length;

  // Star counts
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;

  creatorReviews.forEach((rev) => {
    const star = Math.max(1, Math.min(5, Math.round(rev.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
    totalRatingSum += rev.rating;
  });

  const averageRating = reviewCount > 0 ? Number((totalRatingSum / reviewCount).toFixed(1)) : 5.0;

  // Distribution
  const distribution: RatingDistribution[] = [5, 4, 3, 2, 1].map((stars) => {
    const count = starCounts[stars] || 0;
    const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { stars, count, percentage };
  });

  // Positive reviews defined strictly as 4 or 5 star ratings
  const positiveCount = (starCounts[5] || 0) + (starCounts[4] || 0);
  const positivePercentage =
    reviewCount > 0 ? Math.round((positiveCount / reviewCount) * 100) : 100;

  // Gigs count
  const creatorGigs = gigs.filter((g) => g.creatorId === creatorId);
  const postedGigsCount = Math.max(creatorGigs.length, creator?.totalGigsPosted || 0);

  // Completed bookings count
  const completedBookings = bookings.filter(
    (b) => (b.creatorId === creatorId || b.creatorName === creator?.name) && b.status === 'Completed'
  );
  const completedCount = (creator?.totalGigsCompleted || 0) + completedBookings.length;

  return {
    averageRating,
    reviewCount,
    distribution,
    positivePercentage,
    positiveCount,
    totalGigsPosted: postedGigsCount,
    totalGigsCompleted: completedCount,
  };
}
