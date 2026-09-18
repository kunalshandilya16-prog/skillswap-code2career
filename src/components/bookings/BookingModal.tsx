import React, { useState } from 'react';
import { Gig, Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { validateBookingForm, BookingFormErrors } from '../../utils/validation';
import { formatCurrency } from '../../utils/formatting';
import {
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  Users,
} from 'lucide-react';

interface BookingModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ gig, isOpen, onClose }) => {
  const { bookGig, navigateTo, activeClient, currentRole, activeCreatorId, bookings } = useApp();

  const isOwnGig = Boolean(gig && currentRole === 'creator' && activeCreatorId === gig.creatorId);

  const gigBookings = gig ? bookings.filter((b) => b.gigId === gig.id) : [];
  const totalAppliedRequests = gigBookings.length;
  const pendingRequestsCount = gigBookings.filter((b) => b.status === 'Pending').length;

  const [formData, setFormData] = useState({
    clientName: activeClient?.name || '',
    clientEmail: activeClient?.email || '',
    message: '',
  });

  // Sync with active client when modal opens
  React.useEffect(() => {
    if (isOpen && activeClient) {
      setFormData((prev) => ({
        ...prev,
        clientName: prev.clientName || activeClient.name,
        clientEmail: prev.clientEmail || activeClient.email,
      }));
    }
  }, [isOpen, activeClient]);

  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  if (!gig) return null;

  const handleClose = () => {
    setSubmittedBooking(null);
    setErrors({});
    setSubmissionError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (isOwnGig) {
      setSubmissionError('You cannot book your own gig.');
      return;
    }

    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = bookGig(gig.id, formData);
      if (res.success && res.booking) {
        setSubmittedBooking(res.booking);
      } else {
        setSubmissionError(res.error || 'Failed to submit booking request.');
      }
    } catch {
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      id="booking-gig-modal"
      isOpen={isOpen}
      onClose={handleClose}
      title={submittedBooking ? 'Booking Confirmed' : `Book "${gig.title}"`}
      maxWidth="max-w-lg"
    >
      {submittedBooking ? (
        /* Confirmation Screen */
        <div id="booking-confirmation-view" className="space-y-5 text-center py-2 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              <Clock className="w-3.5 h-3.5" /> Status: Pending Review
            </span>
            <h4 className="text-xl font-bold text-slate-900">
              Booking request sent
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your request has been forwarded to{' '}
              <strong className="text-slate-800 font-semibold">{gig.creatorName}</strong>. You will see updates in My Bookings.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800 text-right">{gig.title}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Creator:</span>
              <span className="font-semibold text-slate-800">{gig.creatorName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Total Rate:</span>
              <span className="font-bold text-indigo-700">{formatCurrency(gig.rate)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Booked By:</span>
              <span className="font-semibold text-slate-800">{submittedBooking.clientName}</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-left text-[11px] text-indigo-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Decision Point 2 Applied:</span> Multiple clients can apply for this gig. {gig.creatorName} will evaluate all candidate requests and accept the best match. Any alternative requests will automatically be declined with the reason <strong className="text-indigo-950 font-bold">"Unfortunately, not available"</strong>.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-confirm-view-bookings"
              type="button"
              onClick={() => {
                handleClose();
                navigateTo('bookings');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              View My Bookings
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-confirm-back-marketplace"
              type="button"
              onClick={() => {
                handleClose();
                navigateTo('marketplace');
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              Browse More Gigs
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gig Summary Pill */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                {gig.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{gig.title}</h4>
              <p className="text-[11px] text-slate-500">Offered by {gig.creatorName}</p>
            </div>
            <div className="text-right shrink-0 pl-3">
              <span className="text-xs text-slate-400 block">Service Rate</span>
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(gig.rate)}
              </span>
            </div>
          </div>

          {/* Applied Requests Insight Banner */}
          <div
            id="modal-applied-requests-banner"
            className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-indigo-950 block">
                  {totalAppliedRequests} {totalAppliedRequests === 1 ? 'request' : 'requests'} already applied
                </span>
                <span className="text-[11px] text-indigo-700 block">
                  {pendingRequestsCount} currently pending creator review
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shrink-0">
              Multiple Applicants Allowed
            </span>
          </div>

          {isOwnGig && (
            <div id="booking-modal-own-gig-warning" className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>You cannot book your own gig. Please switch to Client View or select a different profile.</span>
            </div>
          )}

          {submissionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Client Name */}
          <div>
            <label htmlFor="booking-client-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="booking-client-name"
              type="text"
              value={formData.clientName}
              onChange={(e) => {
                setFormData({ ...formData, clientName: e.target.value });
                if (errors.clientName) setErrors({ ...errors, clientName: undefined });
              }}
              placeholder="e.g., Kritikesh Sharma"
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                errors.clientName
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.clientName && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.clientName}</p>
            )}
          </div>

          {/* Client Email */}
          <div>
            <label htmlFor="booking-client-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Your Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="booking-client-email"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => {
                setFormData({ ...formData, clientEmail: e.target.value });
                if (errors.clientEmail) setErrors({ ...errors, clientEmail: undefined });
              }}
              placeholder="e.g., kritikesh@example.com"
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                errors.clientEmail
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.clientEmail && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.clientEmail}</p>
            )}
          </div>

          {/* Message / Request Details */}
          <div>
            <label htmlFor="booking-message" className="block text-xs font-semibold text-slate-700 mb-1">
              Project Brief / Requirements <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="booking-message"
              rows={4}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              placeholder="Describe your goals, timeline, reference links, or specific requirements for the creator..."
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition-all resize-none ${
                errors.message
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.message}</p>
            )}
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Submitting sends a direct booking request with status <strong>Pending</strong>. The creator can accept or decline from their dashboard.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-booking"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-booking-form"
              disabled={isSubmitting || isOwnGig}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              {isOwnGig ? 'Cannot Book Own Gig' : isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
