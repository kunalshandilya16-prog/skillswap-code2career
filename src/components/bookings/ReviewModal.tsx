import React, { useState } from 'react';
import { Booking } from '../../types';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, isOpen, onClose }) => {
  const { submitReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError('Please write a brief comment sharing your feedback.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Please provide at least 10 characters describing your experience.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = submitReview({
        bookingId: booking.id,
        gigId: booking.gigId,
        creatorId: booking.creatorId || '',
        creatorName: booking.creatorName,
        clientName: booking.clientName,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        onClose();
        setComment('');
        setRating(5);
      } else {
        setError(res.error || 'Failed to submit review.');
      }
    } catch {
      setError('An unexpected error occurred while saving your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      id="leave-review-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={`Review "${booking.gigTitle}"`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Creator & Service summary */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
              Creator
            </span>
            <span className="font-bold text-slate-900">{booking.creatorName}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Completed Service
            </span>
            <span className="font-medium text-slate-700">{booking.gigCategory || 'Gig'}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Rating selector */}
        <div className="text-center py-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Your Overall Rating
          </label>
          <div className="flex justify-center">
            <StarRating
              rating={rating}
              interactive={true}
              onChange={(val) => setRating(val)}
              size="lg"
            />
          </div>
          <span className="text-xs font-bold text-indigo-600">
            {rating === 5 && 'Outstanding experience! (5 Stars)'}
            {rating === 4 && 'Great work & communication (4 Stars)'}
            {rating === 3 && 'Average delivery (3 Stars)'}
            {rating === 2 && 'Needs improvement (2 Stars)'}
            {rating === 1 && 'Unsatisfactory (1 Star)'}
          </span>
        </div>

        {/* Comment input */}
        <div>
          <label htmlFor="review-comment" className="block text-xs font-semibold text-slate-700 mb-1">
            Your Review / Feedback <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Share details about the quality of work, delivery speed, and communication..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Your review will appear publicly on the creator's profile and gig details page.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btn-submit-review"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Star className="w-3.5 h-3.5 fill-white text-white" />
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
